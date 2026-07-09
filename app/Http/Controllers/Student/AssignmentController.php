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

        return ClassModel::whereHas('groupYears', fn($q) => $q->whereIn('group_years.id', $groupYearIds))
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
            ->with(['chapter:id,name,target_groups', 'classModel.subject:id,subject_name', 'tags']);

        if ($request->filled('subject_id')) {
            $query->whereHas('classModel', fn ($q) => $q->where('subject_id', $request->subject_id));
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id')->toArray();

        $assignments = $query->get()->filter(function ($a) use ($groupYearIds) {
            if (!$a->chapter || empty($a->chapter->target_groups)) return true;
            return count(array_intersect($groupYearIds, $a->chapter->target_groups)) > 0;
        })->values();

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
            ->with(['rubric.criteria.levels', 'tags', 'chapter:id,name,target_groups'])
            ->findOrFail($id);

        $groupYearIds = StudentGroup::where('student_id', auth()->id())->pluck('group_year_id')->toArray();
        if ($assignment->chapter && !empty($assignment->chapter->target_groups)) {
            if (count(array_intersect($groupYearIds, $assignment->chapter->target_groups)) === 0) {
                return $this->error('You do not have access to this assignment.', 403);
            }
        }

        $submission = AssignmentSubmission::where('class_assignment_id', $id)
            ->where('student_id', auth()->id())
            ->first();

        if ($submission && $submission->status === 'graded') {
            $submission->setRelation('rubricPoints', $submission->rubricPoints()->get());
        }

        return $this->success([
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'file'         => 'nullable|file|max:10240',
            'link'         => 'nullable|string|max:255',
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

        $pathUrl = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('assignments/submissions', 'public');
            $pathUrl = '/storage/' . $path;
        } elseif ($request->filled('link')) {
            $pathUrl = $request->input('link');
        }

        $submission = AssignmentSubmission::create([
            'student_id'          => auth()->id(),
            'class_assignment_id' => $id,
            'path_url'            => $pathUrl,
            'student_note'        => $request->student_note,
            'status'              => 'submitted',
        ]);

        return $this->created($submission);
    }

    public function updateSubmission(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'file'         => 'nullable|file|max:10240',
            'link'         => 'nullable|string|max:255',
            'student_note' => 'nullable|string',
        ]);

        $submission = AssignmentSubmission::where('class_assignment_id', $id)
            ->where('student_id', auth()->id())
            ->where('status', 'submitted')
            ->firstOrFail();

        $pathUrl = $submission->path_url;
        if ($request->hasFile('file')) {
            if ($pathUrl && str_starts_with($pathUrl, '/storage/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $pathUrl));
            }
            $path = $request->file('file')->store('assignments/submissions', 'public');
            $pathUrl = '/storage/' . $path;
        } elseif ($request->filled('link')) {
            if ($pathUrl && str_starts_with($pathUrl, '/storage/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $pathUrl));
            }
            $pathUrl = $request->input('link');
        }

        $submission->update([
            'path_url' => $pathUrl,
            'student_note' => $request->has('student_note') ? $request->input('student_note') : $submission->student_note,
        ]);

        return $this->success($submission);
    }
}
