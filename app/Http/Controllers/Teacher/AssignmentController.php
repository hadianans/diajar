<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\AssignmentRequest;
use App\Models\ClassAssignment;
use App\Models\ClassModel;
use App\Models\ClassRubric;
use App\Models\ClassRubricCriterion;
use App\Models\ClassRubricLevel;
use App\Models\Taggable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $teacherClassIds = ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->pluck('id');

        $query = ClassAssignment::whereIn('class_id', $teacherClassIds)
            ->whereNull('deleted_at')
            ->with(['chapter:id,name', 'classModel:id,subject_id', 'classModel.subject:id,subject_name', 'tags']);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        if ($request->filled('chapter_id')) {
            $query->where('chapter_id', $request->chapter_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $assignments = $query->withCount([
            'submissions as total_submissions',
            'submissions as graded_submissions' => fn ($q) => $q->where('status', 'graded'),
            'submissions as pending_submissions' => fn ($q) => $q->where('status', 'submitted'),
        ])->orderByDesc('pending_submissions')
          ->get();

        $assignments->each(function ($a) {
            $a->avg_grade = round((float) $a->submissions()->avg('grade'), 1);
        });

        return $this->success($assignments);
    }

    public function store(AssignmentRequest $request): JsonResponse
    {
        $class = ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->findOrFail($request->class_id);

        $assignment = ClassAssignment::create($request->only(
            'class_id', 'chapter_id', 'material_id', 'title', 'description', 'due_date', 'grade'
        ));

        // Create rubric if provided
        if ($request->filled('rubric')) {
            $rubric = ClassRubric::create([
                'class_assignment_id' => $assignment->id,
                'title'               => $request->input('rubric.title'),
                'description'         => $request->input('rubric.description'),
            ]);

            foreach ($request->input('rubric.criteria', []) as $criterionData) {
                $criterion = ClassRubricCriterion::create([
                    'class_rubric_id' => $rubric->id,
                    'title'           => $criterionData['title'],
                    'description'     => $criterionData['description'] ?? null,
                    'weight'          => $criterionData['weight'],
                ]);

                foreach ($criterionData['levels'] ?? [] as $levelData) {
                    ClassRubricLevel::create([
                        'class_criterion_id' => $criterion->id,
                        'label'              => $levelData['label'],
                        'score'              => $levelData['score'],
                        'description'        => $levelData['description'] ?? null,
                    ]);
                }
            }
        }

        $this->syncTags($assignment->id, $request->input('tag_ids', []));
        $assignment->load('rubric.criteria.levels', 'tags');

        return $this->created($assignment);
    }

    public function show(int $id): JsonResponse
    {
        $assignment = ClassAssignment::whereNull('deleted_at')
            ->with([
                'chapter:id,name',
                'classModel:id,subject_id,teacher_id',
                'rubric.criteria.levels',
                'tags',
                'submissions' => fn ($q) => $q->with('student:id,full_name,username,picture')
                    ->orderByDesc('created_at'),
            ])
            ->findOrFail($id);

        if ($assignment->classModel?->teacher_id !== auth()->id()) {
            return $this->forbidden();
        }

        $assignment->total_submissions = $assignment->submissions->count();
        $assignment->graded_count = $assignment->submissions->where('status', 'graded')->count();
        $assignment->ungraded_count = $assignment->submissions->where('status', 'submitted')->count();
        $assignment->avg_grade = round($assignment->submissions->avg('grade') ?? 0, 1);

        // Grade distribution buckets
        $buckets = ['0-49' => 0, '50-59' => 0, '60-69' => 0, '70-79' => 0, '80-89' => 0, '90-100' => 0];
        foreach ($assignment->submissions->whereNotNull('grade') as $sub) {
            $g = $sub->grade;
            match (true) {
                $g >= 90 => $buckets['90-100']++,
                $g >= 80 => $buckets['80-89']++,
                $g >= 70 => $buckets['70-79']++,
                $g >= 60 => $buckets['60-69']++,
                $g >= 50 => $buckets['50-59']++,
                default  => $buckets['0-49']++,
            };
        }
        $assignment->grade_distribution = $buckets;

        return $this->success($assignment);
    }

    public function update(AssignmentRequest $request, int $id): JsonResponse
    {
        $assignment = ClassAssignment::whereNull('deleted_at')->findOrFail($id);

        if ($assignment->classModel?->teacher_id !== auth()->id()) {
            return $this->forbidden();
        }

        $assignment->update($request->only('title', 'description', 'due_date', 'grade', 'status'));
        $this->syncTags($assignment->id, $request->input('tag_ids', []));
        $assignment->load('tags');

        return $this->success($assignment);
    }

    public function close(int $id): JsonResponse
    {
        $assignment = ClassAssignment::whereNull('deleted_at')->findOrFail($id);
        $assignment->update(['status' => 'closed']);

        return $this->success($assignment);
    }

    public function reopen(int $id): JsonResponse
    {
        $assignment = ClassAssignment::whereNull('deleted_at')->findOrFail($id);
        $assignment->update(['status' => 'open']);

        return $this->success($assignment);
    }

    public function destroy(int $id): JsonResponse
    {
        $assignment = ClassAssignment::whereNull('deleted_at')->findOrFail($id);
        $assignment->update(['deleted_at' => now()]);

        return $this->success(null, 'Assignment deleted');
    }

    private function syncTags(int $assignmentId, array $tagIds): void
    {
        Taggable::where('taggable_id', $assignmentId)->where('taggable_type', 'App\\Models\\ClassAssignment')->delete();

        foreach ($tagIds as $tagId) {
            Taggable::create([
                'tag_id'        => $tagId,
                'taggable_id'   => $assignmentId,
                'taggable_type' => 'App\\Models\\ClassAssignment',
            ]);
        }
    }
}
