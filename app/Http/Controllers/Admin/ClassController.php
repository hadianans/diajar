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
                'groupYear.group:id,name',
                'groupYear.schoolYear:id,name,status',
            ])
            ->withCount([
                'groupYear as student_count' => fn ($q) => $q->withCount('studentGroups'),
            ]);

        if ($yearId) {
            $query->whereHas('groupYear', fn ($q) => $q->where('year_id', $yearId));
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }
        if ($request->filled('group_id')) {
            $query->whereHas('groupYear', fn ($q) => $q->where('group_id', $request->group_id));
        }

        $classes = $query->get();

        // Compute student_count and is_complete flags
        $classes->each(function ($class) {
            $class->student_count = $class->groupYear?->studentGroups?->count() ?? 0;
            $class->is_complete = $class->group_years_id
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

        $class = ClassModel::create($request->validated());

        $class->load('subject:id,subject_name', 'teacher:id,full_name', 'groupYear.group:id,name', 'groupYear.schoolYear:id,name');

        ActivityLogService::log(auth()->id(), 'class.created', 'Class', $class->id);

        return $this->created($class);
    }

    public function show(int $id): JsonResponse
    {
        $class = ClassModel::whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'teacher:id,full_name,email,picture',
                'groupYear.group:id,name',
                'groupYear.schoolYear:id,name,status',
                'groupYear.studentGroups' => fn ($q) => $q->with('student:id,full_name,username,picture')->limit(8),
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

    public function destroy(int $id): JsonResponse
    {
        $class = ClassModel::whereNull('deleted_at')->findOrFail($id);
        $class->update(['deleted_at' => now()]);

        ActivityLogService::log(auth()->id(), 'class.deleted', 'Class', $class->id);

        return $this->success(null, 'Class deleted');
    }
}
