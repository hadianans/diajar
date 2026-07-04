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
                'groupYears.group:id,name',
                'groupYears.schoolYear:id,name,status',
                'schoolYear:id,name,status',
            ]);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->whereHas('subject', fn ($q) => $q->where('subject_name', 'like', "%{$s}%"))
                ->orWhereHas('groupYears.group', fn ($q) => $q->where('name', 'like', "%{$s}%"));
        }

        if ($request->filled('year_id')) {
            $query->whereHas('groupYears', fn ($q) => $q->where('year_id', $request->year_id));
        }

        $classes = $query->get();

        $classes->each(function ($class) {
            $class->student_count = \App\Models\StudentGroup::whereIn('group_year_id', $class->groupYears->pluck('id'))->count();
            // A class is active if any of its linked school years is active
            $class->is_active = $class->groupYears->contains(fn($gy) => $gy->schoolYear?->status === 'active');
        });

        // Sort: active first, then by year desc
        $sorted = $classes->sortByDesc('is_active')->values();

        return $this->success($sorted);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $class = ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'groupYears.group:id,name',
                'groupYears.schoolYear:id,name,status',
                'groupYears.studentGroups.student:id,full_name,username,picture',
                'schoolYear:id,name,status',
            ])
            ->findOrFail($id);

        if ($request->filled('group_id')) {
            $groupId = $request->input('group_id');
            $class->setRelation('groupYears', $class->groupYears->filter(fn($gy) => $gy->id == $groupId)->values());
        }

        // Enhance each student with metrics
        $allStudentGroups = $class->groupYears->flatMap->studentGroups;
        $students = $allStudentGroups->map(function ($sg) use ($class) {
            $student = $sg->student;
            if (! $student) {
                return null;
            }

            $studentId = $student->id;
            // Add group name for frontend display
            $student->group_name = $sg->groupYear?->group?->name;

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

            // Assignment grade average
            $student->assignment_avg = \App\Models\AssignmentSubmission::where('student_id', $studentId)
                ->where('status', 'graded')
                ->whereHas('classAssignment', fn($q) => $q->where('class_id', $class->id))
                ->avg('grade') ?: 0;

            // Assessment score average
            $student->assessment_avg = \App\Models\AssessmentAttempt::where('student_id', $studentId)
                ->whereIn('status', ['submitted', 'graded'])
                ->whereHas('classAssessment', fn($q) => $q->where('class_id', $class->id))
                ->avg('grade') ?: 0;

            // Simple Urgent logic
            $student->is_urgent = $student->material_completion < 30 || $student->assignment_avg < 60;

            return $student;
        })->filter()->values();

        $class->students = $students;

        return $this->success($class);
    }
}
