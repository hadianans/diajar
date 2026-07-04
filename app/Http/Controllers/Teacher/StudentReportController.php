<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AssessmentAttempt;
use App\Models\AssignmentSubmission;
use App\Models\ClassModel;
use App\Models\MaterialAccessLog;
use App\Models\MaterialCompletion;
use App\Models\Plan;
use App\Models\Reflection;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class StudentReportController extends Controller
{
    use ApiResponse;

    public function show(int $classId, int $studentId): JsonResponse
    {
        $class = ClassModel::where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->with('subject')
            ->findOrFail($classId);

        // Verify student belongs to this class (checking against all groups assigned to the class)
        $enrolled = StudentGroup::whereIn('group_year_id', $class->groupYears->pluck('id'))
            ->where('student_id', $studentId)
            ->exists();

        if (! $enrolled) {
            return $this->forbidden('Student is not enrolled in this class.');
        }

        $student = \App\Models\User::findOrFail($studentId)->makeHidden('password');

        // Academic summary
        $avgAssignment = round((float) AssignmentSubmission::where('student_id', $studentId)
            ->whereHas('classAssignment', fn ($q) => $q->where('class_id', $classId)->whereNull('deleted_at'))
            ->where('status', 'graded')
            ->avg('grade'), 1);

        $avgAssessment = round((float) AssessmentAttempt::where('student_id', $studentId)
            ->whereHas('classAssessment', fn ($q) => $q->where('class_id', $classId)->whereNull('deleted_at'))
            ->whereIn('status', ['submitted', 'graded'])
            ->avg('grade'), 1);

        $totalMaterials = $class->subject?->chapters()
            ->where('teacher_id', auth()->id())
            ->withCount('materials')
            ->get()
            ->sum('materials_count') ?: 1;

        $completedMaterials = MaterialCompletion::where('student_id', $studentId)
            ->where('is_completed', true)
            ->whereHas('material.chapter', fn ($q) => $q->where('teacher_id', auth()->id()))
            ->count();

        $materialCompletion = round(($completedMaterials / $totalMaterials) * 100, 1);

        // Material engagement
        $totalTimeSpent = MaterialAccessLog::where('student_id', $studentId)
            ->whereHas('material.chapter', fn ($q) => $q->where('teacher_id', auth()->id()))
            ->sum('duration_seconds');

        // Assignment history
        $assignmentHistory = AssignmentSubmission::where('student_id', $studentId)
            ->whereHas('classAssignment', fn ($q) => $q->where('class_id', $classId)->whereNull('deleted_at'))
            ->with('classAssignment:id,title')
            ->orderByDesc('created_at')
            ->get(['id', 'class_assignment_id', 'grade', 'status', 'created_at']);

        // Assessment history
        $assessmentHistory = AssessmentAttempt::where('student_id', $studentId)
            ->whereHas('classAssessment', fn ($q) => $q->where('class_id', $classId)->whereNull('deleted_at'))
            ->with('classAssessment:id,title')
            ->orderByDesc('created_at')
            ->get(['id', 'class_assessment_id', 'status', 'time_spent_seconds', 'grade', 'created_at']);

        // SRL Plans
        $plans = Plan::where('student_id', $studentId)
            ->where('class_id', $classId)
            ->with('planables')
            ->orderByDesc('created_at')
            ->get();

        // SRL Reflections
        $reflections = Reflection::where('student_id', $studentId)
            ->with('reflectables')
            ->orderByDesc('created_at')
            ->get();

        return $this->success([
            'student'             => $student,
            'academic_summary'    => [
                'avg_assignment_grade' => $avgAssignment,
                'avg_assessment_score' => $avgAssessment,
                'material_completion'  => $materialCompletion,
            ],
            'material_engagement' => [
                'total_time_spent' => $totalTimeSpent,
            ],
            'assignment_history'  => $assignmentHistory,
            'assessment_history'  => $assessmentHistory,
            'plans'               => $plans,
            'reflections'         => $reflections,
        ]);
    }
}
