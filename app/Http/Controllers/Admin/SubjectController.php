<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SubjectRequest;
use App\Models\Subject;
use App\Models\SubjectTeacher;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class SubjectController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $subjects = Subject::withCount('subjectTeachers as teacher_count')->get();

        $subjects->each(fn ($s) => $s->has_no_teacher = $s->teacher_count === 0);

        return $this->success($subjects);
    }

    public function store(SubjectRequest $request): JsonResponse
    {
        $subject = Subject::create($request->validated());

        return $this->created($subject);
    }

    public function show(int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        $subject->load([
            'subjectTeachers.teacher:id,full_name,email,picture',
            'classes' => fn ($q) => $q->whereNull('deleted_at'),
            'classes.teacher:id,full_name',
            'classes.groupYear.group:id,name',
            'classes.groupYear.schoolYear:id,name',
        ]);

        return $this->success($subject);
    }

    public function update(SubjectRequest $request, int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);
        $subject->update($request->validated());

        return $this->success($subject);
    }

    public function destroy(int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        $hasClasses = $subject->classes()->whereNull('deleted_at')->exists();
        $hasTeachers = $subject->subjectTeachers()->exists();

        if ($hasClasses || $hasTeachers) {
            return $this->conflict('Cannot delete: subject has linked classes or teachers. Remove them first.');
        }

        $subject->delete();

        return $this->success(null, 'Subject deleted');
    }

    public function linkTeacher(SubjectRequest $request, int $subjectId): JsonResponse
    {
        $subject = Subject::findOrFail($subjectId);

        $teacherIds = $request->teacher_ids;
        $validTeachers = User::whereIn('id', $teacherIds)
            ->whereNull('deleted_at')
            ->where('role', 'teacher')
            ->pluck('id');

        foreach ($validTeachers as $teacherId) {
            SubjectTeacher::firstOrCreate([
                'subject_id' => $subjectId,
                'teacher_id' => $teacherId,
            ]);

            ActivityLogService::log(auth()->id(), 'subject.teacher_linked', 'Subject', $subjectId, "Teacher #{$teacherId}");
        }

        $subject->load('subjectTeachers.teacher:id,full_name,email,picture');

        return $this->success($subject->subjectTeachers);
    }

    public function unlinkTeacher(int $subjectId, int $teacherId): JsonResponse
    {
        SubjectTeacher::where('subject_id', $subjectId)
            ->where('teacher_id', $teacherId)
            ->delete();

        ActivityLogService::log(auth()->id(), 'subject.teacher_unlinked', 'Subject', $subjectId, "Teacher #{$teacherId}");

        return $this->success(null, 'Teacher unlinked');
    }
}
