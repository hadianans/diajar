<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\GroupYear;
use App\Models\SchoolYear;
use App\Models\Subject;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function summary(): JsonResponse
    {
        $counts = User::whereNull('deleted_at')
            ->selectRaw("SUM(role='student') as student_count, SUM(role='teacher') as teacher_count")
            ->first();

        $subjectCount = Subject::count();
        $activeYear = SchoolYear::where('status', 'active')->first(['id', 'name', 'date_start', 'date_end']);

        return $this->success([
            'student_count' => (int) $counts->student_count,
            'teacher_count' => (int) $counts->teacher_count,
            'subject_count' => $subjectCount,
            'active_year'   => $activeYear,
        ]);
    }

    public function setupChecklist(): JsonResponse
    {
        $activeYear = SchoolYear::where('status', 'active')->first();
        $activeYearId = $activeYear?->id;

        // Step 1: Active year exists
        $step1 = $activeYear !== null;

        // Step 2: At least one subject
        $step2 = Subject::count() > 0;

        // Step 3: All subjects have at least one teacher
        $subjectsWithoutTeacher = Subject::leftJoin('subject_teachers', 'subjects.id', '=', 'subject_teachers.subject_id')
            ->groupBy('subjects.id')
            ->havingRaw('COUNT(subject_teachers.id) = 0')
            ->count();
        $step3 = $step2 && $subjectsWithoutTeacher === 0;

        // Step 4: Groups created for current year
        $groupYearCount = $activeYearId ? GroupYear::where('year_id', $activeYearId)->count() : 0;
        $step4 = $groupYearCount > 0;

        // Step 5: All groups have students
        $groupsWithoutStudents = $activeYearId
            ? GroupYear::where('year_id', $activeYearId)
                ->leftJoin('student_groups', 'group_years.id', '=', 'student_groups.group_year_id')
                ->groupBy('group_years.id')
                ->havingRaw('COUNT(student_groups.id) = 0')
                ->count()
            : 0;
        $step5 = $step4 && $groupsWithoutStudents === 0;

        // Step 6: Classes generated
        $classCount = $activeYearId
            ? ClassModel::whereNull('deleted_at')
                ->whereHas('groupYear', fn ($q) => $q->where('year_id', $activeYearId))
                ->count()
            : 0;
        $step6 = $classCount > 0;

        $checklist = [
            ['label' => 'Set active school year',           'complete' => $step1, 'shortcut_url' => '/admin/school-years'],
            ['label' => 'Create at least one subject',      'complete' => $step2, 'shortcut_url' => '/admin/subjects'],
            ['label' => 'Assign teachers to all subjects',  'complete' => $step3, 'shortcut_url' => '/admin/subjects'],
            ['label' => 'Create groups for current year',   'complete' => $step4, 'shortcut_url' => '/admin/groups'],
            ['label' => 'Add students to all groups',       'complete' => $step5, 'shortcut_url' => '/admin/groups'],
            ['label' => 'Generate classes',                 'complete' => $step6, 'shortcut_url' => '/admin/classes'],
        ];

        $stepsComplete = collect($checklist)->where('complete', true)->count();

        return $this->success([
            'checklist'      => $checklist,
            'steps_complete' => $stepsComplete,
        ]);
    }
}
