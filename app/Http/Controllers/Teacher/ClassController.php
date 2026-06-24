<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\SchoolYear;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $teacherId = auth()->id();

        $query = ClassModel::where('teacher_id', $teacherId)
            ->whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'groupYear.group:id,name',
                'groupYear.schoolYear:id,name,status',
            ]);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->whereHas('subject', fn ($q) => $q->where('subject_name', 'like', "%{$s}%"))
                ->orWhereHas('groupYear.group', fn ($q) => $q->where('name', 'like', "%{$s}%"));
        }

        if ($request->filled('year_id')) {
            $query->whereHas('groupYear', fn ($q) => $q->where('year_id', $request->year_id));
        }

        $classes = $query->get();

        $classes->each(function ($class) {
            $class->student_count = StudentGroup::where('group_year_id', $class->group_years_id)->count();
            $class->is_active = $class->groupYear?->schoolYear?->status === 'active';
        });

        // Sort: active first, then by year desc
        $sorted = $classes->sortByDesc('is_active')->values();

        return $this->success($sorted);
    }

    public function show(int $id): JsonResponse
    {
        $class = ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'groupYear.group:id,name',
                'groupYear.schoolYear:id,name,status',
                'groupYear.studentGroups.student:id,full_name,username,picture',
            ])
            ->findOrFail($id);

        // Enhance each student with metrics
        $students = $class->groupYear?->studentGroups?->map(function ($sg) use ($class) {
            $student = $sg->student;
            if (! $student) {
                return null;
            }

            $studentId = $student->id;

            $totalMaterials = $class->subject?->chapters()
                ->where('teacher_id', auth()->id())
                ->withCount('materials')
                ->get()
                ->sum('materials_count') ?: 1;

            $completedMaterials = \App\Models\MaterialCompletion::where('student_id', $studentId)
                ->where('is_completed', true)
                ->whereHas('material.chapter', fn ($q) => $q->where('teacher_id', auth()->id()))
                ->count();

            $student->material_completion = round(($completedMaterials / $totalMaterials) * 100, 1);

            return $student;
        })->filter()->values();

        $class->students = $students;

        return $this->success($class);
    }
}
