<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\ClassAssignment;
use App\Models\ClassModel;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    use ApiResponse;

    private function getStudentClassIds(): array
    {
        $groupYearIds = StudentGroup::where('student_id', auth()->id())->pluck('group_year_id');

        return ClassModel::whereIn('group_years_id', $groupYearIds)
            ->whereNull('deleted_at')
            ->pluck('id')
            ->toArray();
    }

    public function index(Request $request): JsonResponse
    {
        $classIds = $this->getStudentClassIds();
        $studentId = auth()->id();

        $query = ClassAssignment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->where('status', 'open')
            ->with(['chapter:id,name', 'classModel.subject:id,subject_name', 'tags']);

        if ($request->filled('subject_id')) {
            $query->whereHas('classModel', fn ($q) => $q->where('subject_id', $request->subject_id));
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $assignments = $query->get();

        $assignments->each(function ($a) use ($studentId) {
            $sub = AssignmentSubmission::where('class_assignment_id', $a->id)
                ->where('student_id', $studentId)
                ->first();

            $a->submission = $sub;
            $a->display_status = match (true) {
                $sub === null             => 'not_submitted',
                $sub->status === 'graded' => 'graded',
                default                   => 'submitted',
            };
        });

        return $this->success($assignments);
    }

    public function show(int $id): JsonResponse
    {
        $classIds = $this->getStudentClassIds();

        $assignment = ClassAssignment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->with(['rubric.criteria.levels', 'tags', 'chapter:id,name'])
            ->findOrFail($id);

        $submission = AssignmentSubmission::where('class_assignment_id', $id)
            ->where('student_id', auth()->id())
            ->first();

        if ($submission && $submission->status === 'graded') {
            $submission->load('rubricPoints');
        }

        return $this->success([
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'path_url'     => 'required|string|max:255',
            'student_note' => 'nullable|string',
        ]);

        $classIds = $this->getStudentClassIds();
        $assignment = ClassAssignment::whereIn('class_id', $classIds)
            ->whereNull('deleted_at')
            ->where('status', 'open')
            ->findOrFail($id);

        $existing = AssignmentSubmission::where('class_assignment_id', $id)
            ->where('student_id', auth()->id())
            ->exists();

        if ($existing) {
            return $this->conflict('You have already submitted this assignment.');
        }

        $submission = AssignmentSubmission::create([
            'student_id'          => auth()->id(),
            'class_assignment_id' => $id,
            'path_url'            => $request->path_url,
            'student_note'        => $request->student_note,
            'status'              => 'submitted',
        ]);

        return $this->created($submission);
    }

    public function updateSubmission(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'path_url'     => 'nullable|string|max:255',
            'student_note' => 'nullable|string',
        ]);

        $submission = AssignmentSubmission::where('class_assignment_id', $id)
            ->where('student_id', auth()->id())
            ->where('status', 'submitted')
            ->firstOrFail();

        $submission->update($request->only('path_url', 'student_note'));

        return $this->success($submission);
    }
}
