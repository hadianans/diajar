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

        // 1. Planning Snapshot: "Up Next" (Immediate upcoming plans)
        $upcomingPlans = Plan::where('student_id', $studentId)
            ->whereNull('completed_at')
            ->where('target_date', '>=', now()->startOfDay())
            ->orderBy('target_date')
            ->limit(5)
            ->with('planables.planable')
            ->get();

        // 2. Monitoring Snapshot: Weekly Stats
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();
        
        $weeklyPlansTotal = Plan::where('student_id', $studentId)
            ->whereBetween('target_date', [$startOfWeek, $endOfWeek])
            ->count();
            
        $weeklyPlansCompleted = Plan::where('student_id', $studentId)
            ->whereBetween('target_date', [$startOfWeek, $endOfWeek])
            ->whereNotNull('completed_at')
            ->count();
            
        $weeklyProgress = $weeklyPlansTotal > 0 ? round(($weeklyPlansCompleted / $weeklyPlansTotal) * 100) : 0;

        $comprehension = Reflection::where('student_id', $studentId)
            ->selectRaw('comprehension_level, COUNT(*) as count')
            ->groupBy('comprehension_level')
            ->pluck('count', 'comprehension_level');

        // LMS Progress Stats
        $classIds = $this->getStudentClassIds($studentId);

        $totalPublished = \App\Models\Material::where('status', 'published')
            ->whereHas('chapter.subject.classes', fn ($q) => $q->whereIn('classes.id', $classIds)->whereNull('classes.deleted_at'))
            ->count() ?: 1;
        $materialCompleted = MaterialCompletion::where('student_id', $studentId)->where('is_completed', true)->count();

        $totalAssignments = ClassAssignment::whereIn('class_id', $classIds)->whereNull('deleted_at')->where('status', 'open')->count() ?: 1;
        $submittedAssignments = AssignmentSubmission::where('student_id', $studentId)
            ->whereHas('classAssignment', fn ($q) => $q->whereIn('class_id', $classIds)->whereNull('deleted_at'))->count();

        $totalAssessments = ClassAssessment::whereIn('class_id', $classIds)->whereNull('deleted_at')->count() ?: 1;
        $submittedAssessments = AssessmentAttempt::where('student_id', $studentId)
            ->whereIn('status', ['submitted', 'graded'])
            ->whereHas('classAssessment', fn ($q) => $q->whereIn('class_id', $classIds)->whereNull('deleted_at'))->count();

        $lmsProgress = [
            'material' => round(($materialCompleted / $totalPublished) * 100),
            'assignment' => round(($submittedAssignments / $totalAssignments) * 100),
            'assessment' => round(($submittedAssessments / $totalAssessments) * 100),
        ];

        // 3. Reflection Prompts: Recently completed but un-reflected tasks
        $completedAssessmentIds = AssessmentAttempt::where('student_id', $studentId)
            ->whereIn('status', ['submitted', 'graded'])
            ->pluck('class_assessment_id');

        $reflectedAssessmentIds = \App\Models\Reflectable::where('reflectable_type', ClassAssessment::class)
            ->whereHas('reflection', fn($q) => $q->where('student_id', $studentId))
            ->pluck('reflectable_id');

        $pendingAssessments = ClassAssessment::whereIn('id', $completedAssessmentIds)
            ->whereNotIn('id', $reflectedAssessmentIds)
            ->get(['id', 'title'])->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'type' => 'assessment'
            ]);

        $completedAssignmentIds = AssignmentSubmission::where('student_id', $studentId)
            ->whereIn('status', ['submitted', 'graded'])
            ->pluck('class_assignment_id');

        $reflectedAssignmentIds = \App\Models\Reflectable::where('reflectable_type', ClassAssignment::class)
            ->whereHas('reflection', fn($q) => $q->where('student_id', $studentId))
            ->pluck('reflectable_id');

        $pendingAssignments = ClassAssignment::whereIn('id', $completedAssignmentIds)
            ->whereNotIn('id', $reflectedAssignmentIds)
            ->get(['id', 'title'])->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'type' => 'assignment'
            ]);

        $pendingReflections = collect($pendingAssessments)->merge($pendingAssignments)->take(3);

        return $this->success([
            'upcoming_plans'             => $upcomingPlans,
            'weekly_stats'               => [
                'total'     => $weeklyPlansTotal,
                'completed' => $weeklyPlansCompleted,
                'progress'  => $weeklyProgress,
            ],
            'lms_progress'               => $lmsProgress,
            'comprehension_distribution' => $comprehension,
            'pending_reflections'        => $pendingReflections,
        ]);
    }

    private function getStudentClassIds(int $studentId): array
    {
        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id');

        return ClassModel::whereHas('groupYears', fn($q) => $q->whereIn('group_years.id', $groupYearIds))
            ->whereNull('deleted_at')
            ->pluck('id')
            ->toArray();
    }
}
