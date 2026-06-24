<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GroupRequest;
use App\Models\Group;
use App\Models\GroupYear;
use App\Models\SchoolYear;
use App\Models\StudentGroup;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $yearId = $request->input('year_id') ?? SchoolYear::where('status', 'active')->value('id');

        if (! $yearId) {
            return $this->success([]);
        }

        $groupYears = GroupYear::where('year_id', $yearId)
            ->with('group')
            ->withCount('studentGroups as student_count')
            ->get();

        $groupYears->each(fn ($gy) => $gy->has_no_students = $gy->student_count === 0);

        return $this->success($groupYears);
    }

    public function store(GroupRequest $request): JsonResponse
    {
        $group = Group::create(['name' => $request->name]);

        $groupYear = GroupYear::create([
            'group_id' => $group->id,
            'year_id'  => $request->year_id,
            'grade'    => $request->grade,
        ]);

        ActivityLogService::log(auth()->id(), 'group.created', 'Group', $group->id);

        return $this->created([
            'group'      => $group,
            'group_year' => $groupYear,
        ]);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $yearId = $request->input('year_id') ?? SchoolYear::where('status', 'active')->value('id');

        $group = Group::findOrFail($id);

        $groupYear = GroupYear::where('group_id', $id)
            ->where('year_id', $yearId)
            ->withCount('studentGroups as student_count')
            ->first();

        $students = [];
        if ($groupYear) {
            $students = StudentGroup::where('group_year_id', $groupYear->id)
                ->with('student:id,full_name,username,email,picture')
                ->get()
                ->pluck('student');
        }

        return $this->success([
            'group'         => $group,
            'group_year'    => $groupYear,
            'students'      => $students,
            'student_count' => $groupYear?->student_count ?? 0,
        ]);
    }

    public function update(GroupRequest $request, int $id): JsonResponse
    {
        $group = Group::findOrFail($id);
        $group->update(['name' => $request->name]);

        return $this->success($group);
    }

    public function updateGrade(GroupRequest $request, int $groupYearId): JsonResponse
    {
        $groupYear = GroupYear::findOrFail($groupYearId);
        $groupYear->update(['grade' => $request->grade]);

        return $this->success($groupYear);
    }

    public function linkStudents(GroupRequest $request, int $groupId): JsonResponse
    {
        $groupYear = GroupYear::where('group_id', $groupId)
            ->where('year_id', $request->year_id)
            ->firstOrFail();

        $validStudents = User::whereIn('id', $request->student_ids)
            ->whereNull('deleted_at')
            ->where('role', 'student')
            ->pluck('id');

        foreach ($validStudents as $studentId) {
            StudentGroup::firstOrCreate([
                'group_year_id' => $groupYear->id,
                'student_id'    => $studentId,
            ]);
        }

        $count = StudentGroup::where('group_year_id', $groupYear->id)->count();

        ActivityLogService::log(auth()->id(), 'group.students_linked', 'Group', $groupId, "Linked {$validStudents->count()} students");

        return $this->success(['student_count' => $count]);
    }

    public function unlinkStudent(int $groupId, int $studentId, Request $request): JsonResponse
    {
        $yearId = $request->input('year_id') ?? SchoolYear::where('status', 'active')->value('id');

        $groupYear = GroupYear::where('group_id', $groupId)
            ->where('year_id', $yearId)
            ->firstOrFail();

        StudentGroup::where('group_year_id', $groupYear->id)
            ->where('student_id', $studentId)
            ->delete();

        ActivityLogService::log(auth()->id(), 'group.student_unlinked', 'Group', $groupId, "Student #{$studentId}");

        return $this->success(null, 'Student unlinked');
    }

    public function unlinkedStudents(Request $request): JsonResponse
    {
        $yearId = $request->input('year_id') ?? SchoolYear::where('status', 'active')->value('id');

        if (! $yearId) {
            return $this->success([]);
        }

        $groupYearIds = GroupYear::where('year_id', $yearId)->pluck('id');

        $linkedStudentIds = StudentGroup::whereIn('group_year_id', $groupYearIds)->pluck('student_id');

        $query = User::where('role', 'student')
            ->whereNull('deleted_at')
            ->whereNotIn('id', $linkedStudentIds);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('full_name', 'like', "%{$s}%")->orWhere('username', 'like', "%{$s}%"));
        }

        return $this->success($query->select('id', 'full_name', 'username', 'email', 'picture')->get());
    }
}
