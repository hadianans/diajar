<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AssessmentAnswer;
use App\Models\AssessmentAttempt;
use App\Models\ClassAssessment;
use App\Models\ClassAssessmentQuestion;
use App\Models\ClassModel;
use App\Models\ClassOption;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AssessmentController extends Controller
{
    use ApiResponse;

    private function getStudentClassIds(): array
    {
        $groupYearIds = StudentGroup::where('student_id', auth()->id())->pluck('group_year_id');

        return ClassModel::whereHas('groupYears', fn($q) => $q->whereIn('group_years.id', $groupYearIds))
            ->whereNull('deleted_at')
            ->pluck('id')
            ->toArray();
    }

    public function index(Request $request): JsonResponse
    {
        $classIds = $this->getStudentClassIds();
        $studentId = auth()->id();

        $query = ClassAssessment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->with(['chapter:id,name,target_groups', 'classModel.subject:id,subject_name', 'tags'])
            ->withCount('questions as question_count');

        if ($request->filled('subject_id')) {
            $query->whereHas('classModel', fn ($q) => $q->where('subject_id', $request->subject_id));
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id')->toArray();
        $assessments = $query->get()->filter(function ($a) use ($groupYearIds) {
            if (!$a->chapter || empty($a->chapter->target_groups)) return true;
            return count(array_intersect($groupYearIds, $a->chapter->target_groups)) > 0;
        })->values();

        $assessments->each(function ($a) use ($studentId) {
            $attempt = AssessmentAttempt::where('class_assessment_id', $a->id)
                ->where('student_id', $studentId)
                ->latest()
                ->first();

            $a->attempt_status = match (true) {
                $attempt === null                   => 'no_attempt',
                $attempt->status === 'progress'     => 'in_progress',
                $attempt->status === 'submitted'    => 'submitted',
                $attempt->status === 'graded'       => 'graded',
                default                             => 'unknown',
            };
        });

        return $this->success($assessments);
    }

    public function show(int $id): JsonResponse
    {
        $classIds = $this->getStudentClassIds();
        $studentId = auth()->id();

        $assessment = ClassAssessment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->with(['chapter:id,name,target_groups'])
            ->findOrFail($id);

        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id')->toArray();
        if ($assessment->chapter && !empty($assessment->chapter->target_groups)) {
            if (count(array_intersect($groupYearIds, $assessment->chapter->target_groups)) === 0) {
                return $this->error('You do not have access to this assessment.', 403);
            }
        }

        $attemptCount = AssessmentAttempt::where('class_assessment_id', $id)
            ->where('student_id', $studentId)
            ->count();

        $latestAttempt = AssessmentAttempt::where('class_assessment_id', $id)
            ->where('student_id', $studentId)
            ->latest()
            ->first();

        return $this->success([
            'assessment'    => $assessment,
            'attempts_used' => $attemptCount,
            'latest_attempt' => $latestAttempt ? [
                'status' => $latestAttempt->status,
                'grade'  => $latestAttempt->grade,
            ] : null,
        ]);
    }

    public function startAttempt(int $id): JsonResponse
    {
        $classIds = $this->getStudentClassIds();
        $studentId = auth()->id();

        $assessment = ClassAssessment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->with(['chapter:id,name,target_groups'])
            ->findOrFail($id);

        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id')->toArray();
        if ($assessment->chapter && !empty($assessment->chapter->target_groups)) {
            if (count(array_intersect($groupYearIds, $assessment->chapter->target_groups)) === 0) {
                return $this->error('You do not have access to this assessment.', 403);
            }
        }

        // Check max attempts
        $attemptCount = AssessmentAttempt::where('class_assessment_id', $id)
            ->where('student_id', $studentId)
            ->count();

        if ($attemptCount >= $assessment->max_attempts) {
            return $this->error('Maximum attempts reached.', 422);
        }

        // Check assessment window
        $now = Carbon::now();
        if ($assessment->start_date && Carbon::parse($assessment->start_date)->gt($now)) {
            return $this->error('Assessment has not started yet.', 422);
        }
        if ($assessment->due_date && Carbon::parse($assessment->due_date)->lt($now)) {
            return $this->error('Assessment deadline has passed.', 422);
        }

        // Create attempt
        $attempt = AssessmentAttempt::create([
            'class_assessment_id' => $id,
            'student_id'          => $studentId,
            'start_time'          => $now,
            'status'              => 'progress',
        ]);

        // Load questions and pre-seed answers
        $questionLinks = ClassAssessmentQuestion::where('class_assessment_id', $id)
            ->with('classQuestion.options')
            ->get();

        $questions = [];
        foreach ($questionLinks as $link) {
            $cq = $link->classQuestion;

            AssessmentAnswer::create([
                'attempt_id'  => $attempt->id,
                'question_id' => $cq->id,
            ]);

            $questions[] = [
                'id'       => $cq->id,
                'question' => $cq->question,
                'options'  => $cq->options->map(fn ($o) => [
                    'id'     => $o->id,
                    'option' => $o->option,
                    // Note: is_correct NOT exposed
                ]),
            ];
        }

        return $this->success([
            'attempt_id' => $attempt->id,
            'questions'  => $questions,
        ]);
    }

    public function saveAnswer(Request $request, int $attemptId, int $questionId): JsonResponse
    {
        $request->validate([
            'selected_option_id' => 'required|integer|exists:class_options,id',
            'marked_for_review'  => 'nullable|boolean',
        ]);

        $attempt = AssessmentAttempt::where('student_id', auth()->id())
            ->where('status', 'progress')
            ->findOrFail($attemptId);

        // Verify option belongs to this question
        $option = ClassOption::where('id', $request->selected_option_id)
            ->where('class_question_id', $questionId)
            ->firstOrFail();

        $answer = AssessmentAnswer::where('attempt_id', $attemptId)
            ->where('question_id', $questionId)
            ->firstOrFail();

        $answer->update([
            'selected_option_id' => $option->id,
            'is_correct'         => (bool) $option->is_correct,
            'marked_for_review'  => $request->boolean('marked_for_review', $answer->marked_for_review),
        ]);

        return $this->success($answer->fresh());
    }

    public function submitAttempt(int $attemptId): JsonResponse
    {
        $attempt = AssessmentAttempt::where('student_id', auth()->id())
            ->where('status', 'progress')
            ->findOrFail($attemptId);

        $now = Carbon::now();

        // Auto-score
        $totalScore = AssessmentAnswer::where('attempt_id', $attemptId)
            ->where('is_correct', true)
            ->join('class_questions', 'assessment_answers.question_id', '=', 'class_questions.id')
            ->sum('class_questions.score');

        $maxPossibleScore = ClassAssessmentQuestion::where('class_assessment_id', $attempt->class_assessment_id)
            ->join('class_questions', 'class_assessment_questions.class_question_id', '=', 'class_questions.id')
            ->sum('class_questions.score');

        $finalGrade = $maxPossibleScore > 0 ? round(($totalScore / $maxPossibleScore) * 100, 1) : 0;

        $attempt->update([
            'submit_time'        => $now,
            'end_time'           => $now,
            'time_spent_seconds' => $attempt->start_time ? $now->diffInSeconds($attempt->start_time) : 0,
            'grade'              => $finalGrade,
            'status'             => 'submitted',
        ]);

        return $this->success($attempt->fresh());
    }

    public function getAttemptResult(int $attemptId): JsonResponse
    {
        $attempt = AssessmentAttempt::where('student_id', auth()->id())
            ->where('status', '!=', 'progress')
            ->findOrFail($attemptId);

        $answers = AssessmentAnswer::where('attempt_id', $attemptId)
            ->with([
                'classQuestion',
                'classQuestion.options',
                'selectedOption:id,option,is_correct',
            ])
            ->get();

        return $this->success([
            'attempt' => $attempt,
            'answers' => $answers,
        ]);
    }
}
