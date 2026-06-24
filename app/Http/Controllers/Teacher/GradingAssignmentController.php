<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\ClassRubricCriterion;
use App\Models\RubricPoint;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradingAssignmentController extends Controller
{
    use ApiResponse;

    public function show(int $assignmentId, int $studentId): JsonResponse
    {
        $submission = AssignmentSubmission::where('class_assignment_id', $assignmentId)
            ->where('student_id', $studentId)
            ->with('student:id,full_name,username,picture')
            ->firstOrFail();

        $rubric = $submission->classAssignment
            ->rubric()
            ?->with('criteria.levels')
            ->first();

        // Load existing rubric points for this student
        $existingPoints = [];
        if ($rubric) {
            $criterionIds = $rubric->criteria->pluck('id');
            $existingPoints = RubricPoint::where('student_id', $studentId)
                ->whereIn('class_criterion_id', $criterionIds)
                ->get()
                ->keyBy('class_criterion_id');
        }

        // Load prev/next student IDs
        $allSubmissions = AssignmentSubmission::where('class_assignment_id', $assignmentId)
            ->orderBy('student_id')
            ->pluck('student_id');
        $currentIndex = $allSubmissions->search($studentId);
        $prevStudentId = $currentIndex > 0 ? $allSubmissions[$currentIndex - 1] : null;
        $nextStudentId = $currentIndex < $allSubmissions->count() - 1 ? $allSubmissions[$currentIndex + 1] : null;

        return $this->success([
            'submission'      => $submission,
            'rubric'          => $rubric,
            'rubric_points'   => $existingPoints,
            'prev_student_id' => $prevStudentId,
            'next_student_id' => $nextStudentId,
        ]);
    }

    public function saveScore(Request $request, int $assignmentId, int $studentId): JsonResponse
    {
        $request->validate([
            'rubric_points'                          => 'required|array|min:1',
            'rubric_points.*.class_criterion_id'     => 'required|integer|exists:class_rubric_criteria,id',
            'rubric_points.*.class_rubric_level_id'  => 'required|integer|exists:class_rubric_levels,id',
            'feedback'                               => 'nullable|string',
        ]);

        $submission = AssignmentSubmission::where('class_assignment_id', $assignmentId)
            ->where('student_id', $studentId)
            ->firstOrFail();

        // Upsert rubric points
        foreach ($request->rubric_points as $point) {
            RubricPoint::updateOrCreate(
                [
                    'student_id'        => $studentId,
                    'class_criterion_id' => $point['class_criterion_id'],
                ],
                [
                    'class_rubric_level_id' => $point['class_rubric_level_id'],
                ]
            );
        }

        // Compute weighted grade
        $grade = $this->computeGrade($assignmentId, $studentId);

        $submission->update([
            'grade'    => $grade,
            'feedback' => $request->input('feedback', $submission->feedback),
        ]);

        return $this->success($submission->fresh());
    }

    public function submitGrade(Request $request, int $assignmentId, int $studentId): JsonResponse
    {
        $request->validate([
            'rubric_points'                          => 'nullable|array',
            'rubric_points.*.class_criterion_id'     => 'required|integer',
            'rubric_points.*.class_rubric_level_id'  => 'required|integer',
            'feedback'                               => 'nullable|string',
        ]);

        $submission = AssignmentSubmission::where('class_assignment_id', $assignmentId)
            ->where('student_id', $studentId)
            ->firstOrFail();

        // Upsert rubric points if provided
        if ($request->filled('rubric_points')) {
            foreach ($request->rubric_points as $point) {
                RubricPoint::updateOrCreate(
                    [
                        'student_id'         => $studentId,
                        'class_criterion_id' => $point['class_criterion_id'],
                    ],
                    [
                        'class_rubric_level_id' => $point['class_rubric_level_id'],
                    ]
                );
            }
        }

        $grade = $this->computeGrade($assignmentId, $studentId);

        $submission->update([
            'grade'    => $grade,
            'feedback' => $request->input('feedback', $submission->feedback),
            'status'   => 'graded',
            'grade_by' => auth()->id(),
        ]);

        return $this->success($submission->fresh());
    }

    private function computeGrade(int $assignmentId, int $studentId): float
    {
        $assignment = \App\Models\ClassAssignment::findOrFail($assignmentId);
        $rubric = $assignment->rubric;

        if (! $rubric) {
            return 0;
        }

        $criteria = ClassRubricCriterion::where('class_rubric_id', $rubric->id)->get();
        $totalWeight = $criteria->sum('weight') ?: 1;

        $weightedScore = 0;
        foreach ($criteria as $criterion) {
            $point = RubricPoint::where('student_id', $studentId)
                ->where('class_criterion_id', $criterion->id)
                ->first();

            if ($point) {
                $level = $criterion->levels()->where('id', $point->class_rubric_level_id)->first();
                $maxScore = $criterion->levels()->max('score') ?: 1;
                $weightedScore += ($level?->score ?? 0) / $maxScore * $criterion->weight;
            }
        }

        $maxGrade = $assignment->grade ?: 100;

        return round(($weightedScore / $totalWeight) * $maxGrade, 1);
    }
}
