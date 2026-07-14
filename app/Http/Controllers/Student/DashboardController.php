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
        $subjectId = $request->query('subject_id') ? (int) $request->query('subject_id') : null;

        // Active academic year classes for this student, optionally filtered by subject
        $classIds = $this->getStudentClassIds($studentId, $subjectId, true);

        // 1. Weekly Stats
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();
        
        $weeklyPlansQuery = Plan::where('student_id', $studentId)
            ->whereBetween('target_date', [$startOfWeek, $endOfWeek]);

        if ($subjectId) {
            $weeklyPlansQuery->where(function ($q) use ($subjectId) {
                $q->whereHas('planables', function ($q2) use ($subjectId) {
                    $q2->where(function ($q3) use ($subjectId) {
                        $q3->whereHasMorph('planable', [\App\Models\Material::class], function ($q4) use ($subjectId) {
                            $q4->whereHas('chapter', fn($q5) => $q5->where('subject_id', $subjectId));
                        })->orWhereHasMorph('planable', [\App\Models\ClassAssignment::class, \App\Models\ClassAssessment::class], function ($q4) use ($subjectId) {
                            $q4->whereHas('class', fn($q5) => $q5->where('subject_id', $subjectId));
                        });
                    });
                });
            });
        }

        $weeklyPlansTotal = (clone $weeklyPlansQuery)->count();
        $weeklyPlansCompleted = (clone $weeklyPlansQuery)->whereNotNull('completed_at')->count();
        $weeklyProgress = $weeklyPlansTotal > 0 ? round(($weeklyPlansCompleted / $weeklyPlansTotal) * 100) : 0;

        // 2. Average Comprehension Stats (5-point scale)
        $reflectionsQuery = Reflection::where('student_id', $studentId);
        if ($subjectId) {
            $reflectionsQuery->whereHas('reflectables', function ($q) use ($subjectId) {
                $q->where(function ($q2) use ($subjectId) {
                    $q2->whereHasMorph('reflectable', [\App\Models\Material::class], function ($q3) use ($subjectId) {
                        $q3->whereHas('chapter', fn($q4) => $q4->where('subject_id', $subjectId));
                    })->orWhereHasMorph('reflectable', [\App\Models\ClassAssignment::class, \App\Models\ClassAssessment::class], function ($q3) use ($subjectId) {
                        $q3->whereHas('class', fn($q4) => $q4->where('subject_id', $subjectId));
                    });
                });
            });
        }

        $reflectionsList = (clone $reflectionsQuery)->get(['comprehension_level']);
        $totalReflections = $reflectionsList->count();
        
        $counts = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];
        $sum = 0;
        foreach ($reflectionsList as $ref) {
            $level = (int) $ref->comprehension_level;
            if ($level >= 1 && $level <= 5) {
                $counts[$level]++;
                $sum += $level;
            }
        }
        $averageScore = $totalReflections > 0 ? round($sum / $totalReflections, 1) : 0;

        // 3. LMS Progress Stats (Current Active Academic Year + Subject Filter)
        $publishedMaterialIds = \App\Models\Material::where('status', 'published')
            ->whereHas('chapter.subject.classes', fn ($q) => $q->whereIn('classes.id', $classIds)->whereNull('classes.deleted_at'))
            ->pluck('id');
        $totalPublished = $publishedMaterialIds->count() ?: 1;
        $materialCompleted = MaterialCompletion::where('student_id', $studentId)
            ->where('is_completed', true)
            ->whereIn('material_id', $publishedMaterialIds)
            ->count();

        $classAssignmentIds = ClassAssignment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->where('status', 'open')
            ->pluck('id');
        $totalAssignments = $classAssignmentIds->count() ?: 1;
        $submittedAssignments = AssignmentSubmission::where('student_id', $studentId)
            ->whereIn('class_assignment_id', $classAssignmentIds)
            ->count();

        $classAssessmentIds = ClassAssessment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->pluck('id');
        $totalAssessments = $classAssessmentIds->count() ?: 1;
        $submittedAssessments = AssessmentAttempt::where('student_id', $studentId)
            ->whereIn('status', ['submitted', 'graded'])
            ->whereIn('class_assessment_id', $classAssessmentIds)
            ->count();

        $lmsProgress = [
            'material' => round(($materialCompleted / $totalPublished) * 100),
            'assignment' => round(($submittedAssignments / $totalAssignments) * 100),
            'assessment' => round(($submittedAssessments / $totalAssessments) * 100),
        ];

        return $this->success([
            'weekly_stats'               => [
                'total'     => $weeklyPlansTotal,
                'completed' => $weeklyPlansCompleted,
                'progress'  => $weeklyProgress,
            ],
            'lms_progress'               => $lmsProgress,
            'comprehension_distribution' => $counts,
            'comprehension_average'      => $averageScore,
            'comprehension_total'        => $totalReflections,
        ]);
    }

    private function getStudentClassIds(int $studentId, ?int $subjectId = null, bool $activeYearOnly = true): array
    {
        $groupYearQuery = StudentGroup::where('student_id', $studentId);
        if ($activeYearOnly) {
            $groupYearQuery->whereHas('groupYear.schoolYear', fn($q) => $q->where('status', 'active'));
        }
        $groupYearIds = $groupYearQuery->pluck('group_year_id');

        $classesQuery = ClassModel::whereHas('groupYears', fn($q) => $q->whereIn('group_years.id', $groupYearIds))
            ->whereNull('deleted_at');

        if ($subjectId) {
            $classesQuery->where('subject_id', $subjectId);
        }

        return $classesQuery->pluck('id')->toArray();
    }
}
