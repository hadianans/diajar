<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClassRequest;
use App\Models\ClassModel;
use App\Models\SchoolYear;
use App\Models\SubjectTeacher;
use App\Services\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $yearId = $request->input('year_id') ?? SchoolYear::where('status', 'active')->value('id');

        $query = ClassModel::whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'teacher:id,full_name',
                'schoolYear:id,name',
                'groupYears' => function ($q) {
                    $q->withCount('studentGroups')
                      ->with(['group:id,name', 'schoolYear:id,name,status']);
                }
            ]);

        if ($yearId) {
            $query->where(function ($q) use ($yearId) {
                $q->whereHas('groupYears', fn ($q2) => $q2->where('year_id', $yearId))
                  ->orDoesntHave('groupYears');
            });
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }
        if ($request->filled('group_id')) {
            $query->whereHas('groupYears', fn ($q) => $q->where('group_id', $request->group_id));
        }

        $classes = $query->get();

        // Compute student_count and is_complete flags
        $classes->each(function ($class) {
            $class->student_count = $class->groupYears->sum('student_groups_count');
            $class->is_complete = $class->groupYears->isNotEmpty()
                && $class->day_schedule !== null
                && $class->time_schedule !== null;
        });

        return $this->success($classes);
    }

    public function store(ClassRequest $request): JsonResponse
    {
        // Validate teacher is linked to subject
        $linked = SubjectTeacher::where('subject_id', $request->subject_id)
            ->where('teacher_id', $request->teacher_id)
            ->exists();

        if (! $linked) {
            return $this->error('Teacher is not linked to this subject.', 422);
        }

        $class = ClassModel::create($request->except('group_years_ids'));
        $class->groupYears()->attach($request->group_years_ids);

        $class->load([
            'subject',
            'teacher',
            'schoolYear',
            'groupYears.group',
            'groupYears.schoolYear',
        ]);

        ActivityLogService::log(auth()->id(), 'class.created', 'Class', $class->id);

        return $this->created($class);
    }

    public function show(int $id): JsonResponse
    {
        $class = ClassModel::whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'teacher:id,full_name,email,picture',
                'schoolYear:id,name',
                'groupYears.group:id,name',
                'groupYears.schoolYear:id,name,status',
                'groupYears.studentGroups' => fn ($q) => $q->with('student:id,full_name,username,picture'),
            ])
            ->findOrFail($id);

        return $this->success($class);
    }

    public function updateSchedule(ClassRequest $request, int $id): JsonResponse
    {
        $class = ClassModel::whereNull('deleted_at')->findOrFail($id);
        $class->update($request->validated());

        return $this->success($class);
    }

    public function updateGradingScheme(ClassRequest $request, int $id): JsonResponse
    {
        $class = ClassModel::whereNull('deleted_at')->findOrFail($id);
        $class->update($request->validated());

        return $this->success($class);
    }

    public function updateCohorts(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'group_years_ids'   => 'present|array',
            'group_years_ids.*' => 'exists:group_years,id',
        ]);

        $class = ClassModel::whereNull('deleted_at')->findOrFail($id);
        $class->groupYears()->sync($request->group_years_ids);

        ActivityLogService::log(auth()->id(), 'class.cohorts_updated', 'Class', $class->id);

        return $this->success(null, 'Cohorts updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $class = ClassModel::whereNull('deleted_at')->findOrFail($id);
        
        $class->deleted_at = now();
        $class->save();

        // Unlink the teacher from the subject to keep state consistent
        \App\Models\SubjectTeacher::where('subject_id', $class->subject_id)
            ->where('teacher_id', $class->teacher_id)
            ->delete();

        ActivityLogService::log(auth()->id(), 'class.deleted', 'Class', $class->id);

        return $this->success(null, 'Class deleted');
    }
}
