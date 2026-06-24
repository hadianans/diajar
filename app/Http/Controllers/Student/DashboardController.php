<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AssessmentAttempt;
use App\Models\AssignmentSubmission;
use App\Models\ClassAssessment;
use App\Models\ClassAssignment;
use App\Models\ClassModel;
use App\Models\MaterialAccessLog;
use App\Models\MaterialCompletion;
use App\Models\Plan;
use App\Models\Reflection;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    use ApiResponse;

    public function home(): JsonResponse
    {
        $studentId = auth()->id();

        // Resolve student's current classes
        $classIds = $this->getStudentClassIds($studentId);

        // Last accessed material
        $lastAccess = MaterialAccessLog::where('student_id', $studentId)
            ->with('material:id,title,file_type')
            ->orderByDesc('access_start')
            ->first(['id', 'material_id', 'access_start']);

        // Progress summary
        $totalPublished = \App\Models\Material::where('status', 'published')
            ->whereHas('chapter.subject.classes', fn ($q) => $q->whereIn('classes.id', $classIds)->whereNull('classes.deleted_at'))
            ->count() ?: 1;

        $materialCompleted = MaterialCompletion::where('student_id', $studentId)
            ->where('is_completed', true)
            ->count();

        $totalAssignments = ClassAssignment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->where('status', 'open')
            ->count() ?: 1;

        $submittedAssignments = AssignmentSubmission::where('student_id', $studentId)
            ->whereHas('classAssignment', fn ($q) => $q->whereIn('class_id', $classIds)->whereNull('deleted_at'))
            ->count();

        $totalAssessments = ClassAssessment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->count() ?: 1;

        $submittedAssessments = AssessmentAttempt::where('student_id', $studentId)
            ->whereIn('status', ['submitted', 'graded'])
            ->whereHas('classAssessment', fn ($q) => $q->whereIn('class_id', $classIds)->whereNull('deleted_at'))
            ->count();

        $now = Carbon::now();

        // Nearest assignment deadline (not yet submitted by student)
        $submittedAssignmentIds = AssignmentSubmission::where('student_id', $studentId)->pluck('class_assignment_id');
        $nearestAssignment = ClassAssignment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->where('status', 'open')
            ->where('due_date', '>=', $now)
            ->whereNotIn('id', $submittedAssignmentIds)
            ->orderBy('due_date')
            ->first(['id', 'title', 'due_date']);

        // Nearest assessment deadline (not yet attempted)
        $attemptedAssessmentIds = AssessmentAttempt::where('student_id', $studentId)->pluck('class_assessment_id');
        $nearestAssessment = ClassAssessment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->where('due_date', '>=', $now)
            ->whereNotIn('id', $attemptedAssessmentIds)
            ->orderBy('due_date')
            ->first(['id', 'title', 'due_date']);

        // Nearest learning targets
        $nearestPlans = Plan::where('student_id', $studentId)
            ->where('completed_at', '0000-00-00 00:00:00')
            ->orderBy('target_date')
            ->limit(3)
            ->get(['id', 'title', 'target_date', 'progress']);

        return $this->success([
            'last_accessed_material' => $lastAccess,
            'progress' => [
                'material_completion'   => round(($materialCompleted / $totalPublished) * 100, 1),
                'assignment_completion' => round(($submittedAssignments / $totalAssignments) * 100, 1),
                'assessment_completion' => round(($submittedAssessments / $totalAssessments) * 100, 1),
            ],
            'nearest_deadlines' => [
                'assignment' => $nearestAssignment,
                'assessment' => $nearestAssessment,
            ],
            'learning_targets' => $nearestPlans,
        ]);
    }

    public function srlDashboard(Request $request): JsonResponse
    {
        $studentId = auth()->id();

        $plans = Plan::where('student_id', $studentId)
            ->with('planables')
            ->orderBy('target_date')
            ->get();

        // Calendar data for current month
        $calendarDates = Plan::where('student_id', $studentId)
            ->whereMonth('target_date', now()->month)
            ->whereYear('target_date', now()->year)
            ->pluck('target_date');

        // Comprehension distribution
        $comprehension = Reflection::where('student_id', $studentId)
            ->selectRaw('comprehension_level, COUNT(*) as count')
            ->groupBy('comprehension_level')
            ->pluck('count', 'comprehension_level');

        // Reflections
        $reflections = Reflection::where('student_id', $studentId)
            ->with('reflectables')
            ->orderByDesc('created_at')
            ->get();

        return $this->success([
            'plans'                      => $plans,
            'calendar_dates'             => $calendarDates,
            'comprehension_distribution' => $comprehension,
            'reflections'                => $reflections,
        ]);
    }

    private function getStudentClassIds(int $studentId): array
    {
        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id');

        return ClassModel::whereIn('group_years_id', $groupYearIds)
            ->whereNull('deleted_at')
            ->pluck('id')
            ->toArray();
    }
}
