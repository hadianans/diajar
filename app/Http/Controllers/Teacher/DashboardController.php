<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AssessmentAttempt;
use App\Models\AssignmentSubmission;
use App\Models\Chapter;
use App\Models\ClassAssessment;
use App\Models\ClassAssignment;
use App\Models\ClassModel;
use App\Models\MaterialCompletion;
use App\Models\Plan;
use App\Models\Reflection;
use App\Models\SchoolYear;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    use ApiResponse;

    public function summary(): JsonResponse
    {
        $teacherId = auth()->id();
        $activeYearId = SchoolYear::where('status', 'active')->value('id');

        $activeClassIds = ClassModel::where('teacher_id', $teacherId)
            ->whereNull('deleted_at')
            ->when($activeYearId, fn($q) => $q->whereHas('groupYear', fn($q2) => $q2->where('year_id', $activeYearId)))
            ->pluck('id');

        return $this->success([
            'pending_actions' => $this->getPendingActions($activeClassIds),
            'class_health' => $this->getClassHealth($activeClassIds),
            'srl_snapshot' => $this->getSrlSnapshot($activeClassIds),
            'chapter_progress' => $this->getChapterProgress($teacherId),
            'upcoming_deadlines' => $this->getUpcomingDeadlines($activeClassIds),
        ]);
    }

    public function subjects(): JsonResponse
    {
        $subjects = \App\Models\Subject::whereHas('subjectTeachers', fn($q) => $q->where('teacher_id', auth()->id()))
            ->get(['id', 'subject_name', 'description']);
            
        return $this->success($subjects);
    }

    private function getPendingActions(Collection $activeClassIds): array
    {
        $ungradedSubmissions = AssignmentSubmission::whereHas('classAssignment', fn($q) => $q->whereIn('class_id', $activeClassIds)->whereNull('deleted_at'))
            ->where('status', 'submitted')
            ->count();

        $pendingAttempts = AssessmentAttempt::whereHas('classAssessment', fn($q) => $q->whereIn('class_id', $activeClassIds)->whereNull('deleted_at'))
            ->where('status', 'submitted')
            ->count();

        return [
            'ungraded_submissions' => $ungradedSubmissions,
            'pending_attempts' => $pendingAttempts,
        ];
    }

    private function getClassHealth(Collection $activeClassIds): array
    {
        $avgAssignment = round((float) AssignmentSubmission::whereHas('classAssignment', fn($q) => $q->whereIn('class_id', $activeClassIds)->whereNull('deleted_at'))
            ->where('status', 'graded')
            ->avg('grade'), 1);

        $avgAssessment = round((float) AssessmentAttempt::whereHas('classAssessment', fn($q) => $q->whereIn('class_id', $activeClassIds)->whereNull('deleted_at'))
            ->whereIn('status', ['submitted', 'graded'])
            ->avg('grade'), 1);

        return [
            'avg_assignment_grade' => $avgAssignment,
            'avg_assessment_score' => $avgAssessment,
        ];
    }

    private function getSrlSnapshot(Collection $activeClassIds): array
    {
        $activePlans = Plan::whereHas('student.studentGroups.groupYear.classes', fn($q) => $q->whereIn('classes.id', $activeClassIds))
            ->where('completed_at', '0000-00-00 00:00:00')
            ->count();

        $newReflections = Reflection::whereHas('student.studentGroups.groupYear.classes', fn($q) => $q->whereIn('classes.id', $activeClassIds))
            ->where('created_at', '>=', Carbon::now()->startOfWeek())
            ->count();

        return [
            'active_plans' => $activePlans,
            'new_reflections' => $newReflections,
        ];
    }

    private function getChapterProgress(int $teacherId): Collection
    {
        return Chapter::where('teacher_id', $teacherId)
            ->withCount('materials')
            ->get()
            ->map(function ($ch) {
                $total = $ch->materials_count ?: 1;
                $completed = MaterialCompletion::where('is_completed', true)
                    ->whereHas('material', fn($q) => $q->where('chapter_id', $ch->id))
                    ->count();

                return [
                    'id' => $ch->id,
                    'name' => $ch->name,
                    'completion' => round(($completed / $total) * 100, 1),
                ];
            });
    }

    private function getUpcomingDeadlines(Collection $activeClassIds): array
    {
        $now = Carbon::now();
        $nearestAssignment = ClassAssignment::whereIn('class_id', $activeClassIds)
            ->whereNull('deleted_at')
            ->where('status', 'open')
            ->where('due_date', '>=', $now)
            ->orderBy('due_date')
            ->first(['id', 'title', 'due_date']);

        $nearestAssessment = ClassAssessment::whereIn('class_id', $activeClassIds)
            ->whereNull('deleted_at')
            ->where('due_date', '>=', $now)
            ->orderBy('due_date')
            ->first(['id', 'title', 'due_date']);

        return [
            'assignment' => $nearestAssignment,
            'assessment' => $nearestAssessment,
        ];
    }
}
