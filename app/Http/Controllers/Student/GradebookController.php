<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use App\Models\ClassModel;
use App\Models\AssignmentSubmission;
use App\Models\AssessmentAttempt;
use App\Models\ClassAssignment;
use App\Models\ClassAssessment;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class GradebookController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $studentId = auth()->id();
        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id');

        $classes = ClassModel::whereHas('groupYears', fn($q) => $q->whereIn('group_years.id', $groupYearIds))
            ->whereNull('deleted_at')
            ->with(['subject:id,subject_name,subject_code'])
            ->get();

        $grades = [];

        foreach ($classes as $classModel) {
            // Get all graded assignments for this class
            $assignments = ClassAssignment::where('class_id', $classModel->id)->pluck('id');
            $assignmentSubmissions = AssignmentSubmission::whereIn('class_assignment_id', $assignments)
                ->where('student_id', $studentId)
                ->where('status', 'graded')
                ->get();
            
            $totalAssignmentScore = $assignmentSubmissions->sum('score');
            $assignmentCount = $assignments->count();
            
            // Get all graded assessments for this class
            $assessments = ClassAssessment::where('class_id', $classModel->id)->pluck('id');
            $assessmentAttempts = AssessmentAttempt::whereIn('class_assessment_id', $assessments)
                ->where('student_id', $studentId)
                ->whereIn('status', ['submitted', 'graded'])
                ->get();

            // We only consider the max grade if there are multiple attempts? Actually, we'll just sum highest per assessment.
            $totalAssessmentScore = 0;
            foreach ($assessments as $assessmentId) {
                $bestAttempt = $assessmentAttempts->where('class_assessment_id', $assessmentId)->max('grade');
                if ($bestAttempt) {
                    $totalAssessmentScore += $bestAttempt;
                }
            }
            $assessmentCount = $assessments->count();

            // Very simple average for demo
            $totalItems = $assignmentCount + $assessmentCount;
            $average = $totalItems > 0 
                ? round(($totalAssignmentScore + $totalAssessmentScore) / $totalItems, 2) 
                : 0;

            $grades[] = [
                'class_id' => $classModel->id,
                'subject_name' => $classModel->subject->subject_name,
                'subject_code' => $classModel->subject->subject_code,
                'assignment_score' => $totalAssignmentScore,
                'assessment_score' => $totalAssessmentScore,
                'average' => $average,
                'total_items' => $totalItems
            ];
        }

        return $this->success($grades);
    }
}
