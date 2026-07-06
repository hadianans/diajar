<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassAssignment;
use App\Models\ClassAssignmentAttachment;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherAssignmentAttachmentController extends Controller
{
    use ApiResponse;

    private function verifyAssignmentOwnership(int $assignmentId): ClassAssignment
    {
        return ClassAssignment::whereHas('chapter', fn ($q) => $q->where('teacher_id', auth()->id()))
            ->findOrFail($assignmentId);
    }

    public function store(Request $request, int $assignmentId): JsonResponse
    {
        $assignment = $this->verifyAssignmentOwnership($assignmentId);

        $request->validate([
            'attachments' => 'required|array',
            'attachments.*' => 'required|file|max:8192', // 8 MB
            'attachment_titles' => 'nullable|array',
        ]);

        if ($request->hasFile('attachments')) {
            $files = $request->file('attachments');
            $titles = $request->input('attachment_titles', []);
            
            $createdAttachments = [];
            foreach ($files as $index => $file) {
                $path = $file->store('assignments/attachments', 'public');
                $title = !empty($titles[$index]) ? $titles[$index] : $file->getClientOriginalName();
                
                $createdAttachments[] = $assignment->attachments()->create([
                    'title' => $title,
                    'file_url' => asset('storage/' . $path),
                ]);
            }
            return $this->created($createdAttachments, 'Attachments uploaded successfully');
        }

        return $this->error('No files provided', 400);
    }

    public function destroy(int $assignmentId, int $id): JsonResponse
    {
        $this->verifyAssignmentOwnership($assignmentId);

        $attachment = ClassAssignmentAttachment::where('class_assignment_id', $assignmentId)->findOrFail($id);
        $attachment->delete();

        return $this->success(null, 'Attachment deleted');
    }
}
