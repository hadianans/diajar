<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\AssessmentRequest;
use App\Models\ClassAssessment;
use App\Models\ClassAssessmentQuestion;
use App\Models\ClassModel;
use App\Models\ClassOption;
use App\Models\ClassQuestion;
use App\Models\Question;
use App\Models\Taggable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AssessmentController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $teacherClassIds = ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->pluck('id');

        $query = ClassAssessment::whereIn('class_id', $teacherClassIds)
            ->whereNull('deleted_at')
            ->with(['chapter:id,name', 'classModel:id,subject_id', 'classModel.subject:id,subject_name', 'tags']);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        if ($request->filled('chapter_id')) {
            $query->where('chapter_id', $request->chapter_id);
        }

        $assessments = $query->withCount(['questions as question_count', 'attempts as attempt_count'])
            ->get();

        $now = Carbon::now();
        $assessments->each(function ($a) use ($now, $request) {
            $a->avg_score = round((float) $a->attempts()->avg('grade'), 1);

            // Derive lifecycle_status
            if ($a->due_date && Carbon::parse($a->due_date)->lt($now)) {
                $a->lifecycle_status = 'completed';
            } elseif ($a->start_date && Carbon::parse($a->start_date)->gt($now)) {
                $a->lifecycle_status = 'scheduled';
            } else {
                $a->lifecycle_status = 'active';
            }
        });

        if ($request->filled('lifecycle_status')) {
            $assessments = $assessments->where('lifecycle_status', $request->lifecycle_status)->values();
        }

        return $this->success($assessments);
    }

    public function store(AssessmentRequest $request): JsonResponse
    {
        ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->findOrFail($request->class_id);

        $assessment = ClassAssessment::create($request->only(
            'class_id', 'chapter_id', 'material_id', 'title', 'description',
            'start_date', 'due_date', 'duration', 'max_attempts', 'pass_threshold'
        ));

        // Copy questions from bank to class-specific copies
        foreach ($request->question_ids as $questionId) {
            $source = Question::with('options')->findOrFail($questionId);

            $classQuestion = ClassQuestion::create([
                'question'    => $source->question,
                'levels'      => $source->levels,
                'score'       => $source->score,
                'explanation' => $source->explanation,
            ]);

            foreach ($source->options as $opt) {
                ClassOption::create([
                    'class_question_id' => $classQuestion->id,
                    'option'            => $opt->option,
                    'is_correct'        => $opt->is_correct,
                ]);
            }

            ClassAssessmentQuestion::create([
                'class_assessment_id' => $assessment->id,
                'class_question_id'   => $classQuestion->id,
            ]);
        }

        $this->syncTags($assessment->id, $request->input('tag_ids', []));

        $assessment->loadCount('questions as question_count');

        return $this->created($assessment);
    }

    public function show(int $id): JsonResponse
    {
        $assessment = ClassAssessment::whereNull('deleted_at')
            ->with([
                'chapter:id,name',
                'classModel:id,subject_id,teacher_id',
                'questions.classQuestion.options',
                'tags',
                'attempts' => fn ($q) => $q->with('student:id,full_name,username,picture')
                    ->orderByDesc('created_at'),
            ])
            ->findOrFail($id);

        if ($assessment->classModel?->teacher_id !== auth()->id()) {
            return $this->forbidden();
        }

        $attempts = $assessment->attempts;
        $assessment->total_students = $assessment->classModel?->groupYear?->studentGroups?->count() ?? 0;
        $assessment->attempts_submitted = $attempts->whereIn('status', ['submitted', 'graded'])->count();
        $assessment->avg_score = round($attempts->avg('grade') ?? 0, 1);
        $assessment->highest = $attempts->max('grade');
        $assessment->lowest = $attempts->min('grade');
        $assessment->pass_rate = $attempts->count() > 0
            ? round($attempts->where('grade', '>=', $assessment->pass_threshold)->count() / $attempts->count() * 100, 1)
            : 0;

        // Grade distribution
        $buckets = ['0-49' => 0, '50-59' => 0, '60-69' => 0, '70-79' => 0, '80-89' => 0, '90-100' => 0];
        foreach ($attempts->whereNotNull('grade') as $att) {
            $g = $att->grade;
            match (true) {
                $g >= 90 => $buckets['90-100']++,
                $g >= 80 => $buckets['80-89']++,
                $g >= 70 => $buckets['70-79']++,
                $g >= 60 => $buckets['60-69']++,
                $g >= 50 => $buckets['50-59']++,
                default  => $buckets['0-49']++,
            };
        }
        $assessment->grade_distribution = $buckets;

        return $this->success($assessment);
    }

    public function update(AssessmentRequest $request, int $id): JsonResponse
    {
        $assessment = ClassAssessment::whereNull('deleted_at')->findOrFail($id);

        if ($assessment->classModel?->teacher_id !== auth()->id()) {
            return $this->forbidden();
        }

        $assessment->update($request->only(
            'title', 'description', 'start_date', 'due_date', 'duration', 'max_attempts', 'pass_threshold'
        ));

        $this->syncTags($assessment->id, $request->input('tag_ids', []));
        $assessment->load('tags');

        return $this->success($assessment);
    }

    public function destroy(int $id): JsonResponse
    {
        $assessment = ClassAssessment::whereNull('deleted_at')->findOrFail($id);
        $assessment->update(['deleted_at' => now()]);

        return $this->success(null, 'Assessment deleted');
    }

    private function syncTags(int $assessmentId, array $tagIds): void
    {
        Taggable::where('taggable_id', $assessmentId)->where('taggable_type', 'App\\Models\\ClassAssessment')->delete();

        foreach ($tagIds as $tagId) {
            Taggable::create([
                'tag_id'        => $tagId,
                'taggable_id'   => $assessmentId,
                'taggable_type' => 'App\\Models\\ClassAssessment',
            ]);
        }
    }
}
