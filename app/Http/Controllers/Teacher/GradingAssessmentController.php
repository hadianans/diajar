<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AssessmentAnswer;
use App\Models\AssessmentAttempt;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradingAssessmentController extends Controller
{
    use ApiResponse;

    public function showAnswerSheet(int $assessmentId, int $studentId): JsonResponse
    {
        $attempt = AssessmentAttempt::where('class_assessment_id', $assessmentId)
            ->where('student_id', $studentId)
            ->with('student:id,full_name,username,picture')
            ->latest()
            ->firstOrFail();

        $answers = AssessmentAnswer::where('attempt_id', $attempt->id)
            ->with([
                'classQuestion',
                'classQuestion.options',
                'selectedOption:id,option,is_correct',
            ])
            ->get();

        $correctCount = $answers->where('is_correct', true)->count();
        $incorrectCount = $answers->where('is_correct', false)->whereNotNull('is_correct')->count();
        $totalScoreEarned = $answers->where('is_correct', true)->sum(fn ($a) => $a->classQuestion?->score ?? 0);

        // Prev/next student navigation
        $allAttempts = AssessmentAttempt::where('class_assessment_id', $assessmentId)
            ->orderBy('student_id')
            ->pluck('student_id')
            ->unique()
            ->values();
        $currentIndex = $allAttempts->search($studentId);
        $prevStudentId = $currentIndex > 0 ? $allAttempts[$currentIndex - 1] : null;
        $nextStudentId = $currentIndex < $allAttempts->count() - 1 ? $allAttempts[$currentIndex + 1] : null;

        return $this->success([
            'attempt'          => $attempt,
            'answers'          => $answers,
            'correct_count'    => $correctCount,
            'incorrect_count'  => $incorrectCount,
            'total_score'      => $totalScoreEarned,
            'time_spent'       => $attempt->time_spent_seconds,
            'prev_student_id'  => $prevStudentId,
            'next_student_id'  => $nextStudentId,
        ]);
    }

    public function finalizeGrade(Request $request, int $attemptId): JsonResponse
    {
        $attempt = AssessmentAttempt::findOrFail($attemptId);

        $totalScore = AssessmentAnswer::where('attempt_id', $attempt->id)
            ->where('is_correct', true)
            ->join('class_questions', 'assessment_answers.question_id', '=', 'class_questions.id')
            ->sum('class_questions.score');

        $maxPossibleScore = \App\Models\ClassAssessmentQuestion::where('class_assessment_id', $attempt->class_assessment_id)
            ->join('class_questions', 'class_assessment_questions.class_question_id', '=', 'class_questions.id')
            ->sum('class_questions.score');

        $finalGrade = $maxPossibleScore > 0 ? round(($totalScore / $maxPossibleScore) * 100, 1) : 0;

        $attempt->update([
            'grade'    => $finalGrade,
            'status'   => 'graded',
            'grade_by' => auth()->id(),
        ]);

        return $this->success($attempt->fresh());
    }
}
