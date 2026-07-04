<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AssessmentAttempt;
use App\Models\AssignmentSubmission;
use App\Models\ClassAssessment;
use App\Models\ClassAssignment;
use App\Models\ClassModel;
use App\Models\GroupYear;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradebookController extends Controller
{
    use ApiResponse;

    public function groupGrades(int $classId, Request $request): JsonResponse
    {
        $class = ClassModel::where('id', $classId)
            ->where('teacher_id', auth()->id())
            ->whereNull('deleted_at')
            ->with('groupYears.studentGroups.student:id,full_name,username,picture')
            ->firstOrFail();

        $students = $class->groupYears
            ->flatMap->studentGroups
            ->map->student
            ->filter();

        $assignments = ClassAssignment::where('class_id', $class->id)
            ->whereNull('deleted_at')
            ->get();

        $assessments = ClassAssessment::where('class_id', $class->id)
            ->whereNull('deleted_at')
            ->get();

        $columnFilter = $request->input('column_filter', 'all');

        $gradebook = $students->map(function ($student) use ($assignments, $assessments, $class, $columnFilter) {
            $grades = [];
            $assignmentGrades = [];
            $assessmentGrades = [];

            if ($columnFilter !== 'assessments') {
                foreach ($assignments as $a) {
                    $sub = AssignmentSubmission::where('class_assignment_id', $a->id)
                        ->where('student_id', $student->id)
                        ->first();

                    $value = null;
                    if ($sub) {
                        $value = $sub->status === 'graded' ? $sub->grade : 'pending';
                    }

                    $grades["assignment_{$a->id}"] = $value;
                    if (is_numeric($value)) {
                        $assignmentGrades[] = $value;
                    }
                }
            }

            if ($columnFilter !== 'assignments') {
                foreach ($assessments as $a) {
                    $attempt = AssessmentAttempt::where('class_assessment_id', $a->id)
                        ->where('student_id', $student->id)
                        ->whereIn('status', ['submitted', 'graded'])
                        ->latest()
                        ->first();

                    $grades["assessment_{$a->id}"] = $attempt?->grade;
                    if ($attempt?->grade !== null) {
                        $assessmentGrades[] = $attempt->grade;
                    }
                }
            }

            $avgAssignment = count($assignmentGrades) > 0 ? array_sum($assignmentGrades) / count($assignmentGrades) : 0;
            $avgAssessment = count($assessmentGrades) > 0 ? array_sum($assessmentGrades) / count($assessmentGrades) : 0;

            $finalGrade = ($avgAssignment * $class->assignment_weight / 100)
                        + ($avgAssessment * $class->assessment_weight / 100);

            return [
                'id'          => $student->id,
                'name'        => $student->full_name,
                'grades'      => $grades,
                'final_grade' => round($finalGrade, 1),
            ];
        })->values();

        // Sort
        $sort = $request->input('sort', 'name');
        $gradebook = match ($sort) {
            'grade_desc' => $gradebook->sortByDesc('final_grade')->values(),
            'grade_asc'  => $gradebook->sortBy('final_grade')->values(),
            default      => $gradebook->sortBy('name')->values(),
        };

        // Build column definitions
        $columns = [];
        if ($columnFilter !== 'assessments') {
            foreach ($assignments as $a) {
                $columns[] = ['key' => "assignment_{$a->id}", 'label' => $a->title, 'type' => 'assignment'];
            }
        }
        if ($columnFilter !== 'assignments') {
            foreach ($assessments as $a) {
                $columns[] = ['key' => "assessment_{$a->id}", 'label' => $a->title, 'type' => 'assessment'];
            }
        }

        return $this->success([
            'grading_scheme' => [
                'assignment_weight' => $class->assignment_weight,
                'assessment_weight' => $class->assessment_weight,
            ],
            'columns'  => $columns,
            'students' => $gradebook,
        ]);
    }
}
