<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = User::whereNull('deleted_at');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'newest');
        $query->when($sort === 'name', fn ($q) => $q->orderBy('full_name'))
              ->when($sort === 'newest', fn ($q) => $q->orderByDesc('created_at'))
              ->when($sort === 'role', fn ($q) => $q->orderBy('role')->orderBy('full_name'));

        $users = $query->paginate(15)->withQueryString();

        $counts = User::whereNull('deleted_at')
            ->selectRaw("SUM(role='admin') as admin_count, SUM(role='teacher') as teacher_count, SUM(role='student') as student_count")
            ->first();

        return $this->success([
            'users'         => $users,
            'admin_count'   => (int) $counts->admin_count,
            'teacher_count' => (int) $counts->teacher_count,
            'student_count' => (int) $counts->student_count,
        ]);
    }

    public function store(UserRequest $request): JsonResponse
    {
        $user = User::create([
            'full_name' => $request->full_name,
            'username'  => $request->username,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => $request->role,
            'picture'   => $request->picture,
        ]);

        ActivityLogService::log(auth()->id(), 'user.created', 'User', $user->id);

        return $this->created($user);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::whereNull('deleted_at')->findOrFail($id);

        if ($user->role === 'teacher') {
            $user->load('subjectTeachers.subject');
        } elseif ($user->role === 'student') {
            $user->load('studentGroups.groupYear.group', 'studentGroups.groupYear.schoolYear');
        }

        return $this->success($user->makeHidden('password'));
    }

    public function update(UserRequest $request, int $id): JsonResponse
    {
        $user = User::whereNull('deleted_at')->findOrFail($id);

        $oldRole = $user->role;
        $newRole = $request->role;

        if ($oldRole !== $newRole && ! $request->boolean('role_change_confirmed')) {
            return $this->error('Role change requires role_change_confirmed: true', 422);
        }

        $user->update($request->only('full_name', 'username', 'email', 'role', 'picture'));

        $description = $oldRole !== $newRole ? "Role changed from {$oldRole} to {$newRole}" : null;
        ActivityLogService::log(auth()->id(), 'user.updated', 'User', $user->id, $description);

        return $this->success($user->makeHidden('password'));
    }

    public function updatePassword(UserRequest $request, int $id): JsonResponse
    {
        $user = User::whereNull('deleted_at')->findOrFail($id);
        $user->update(['password' => Hash::make($request->password)]);

        ActivityLogService::log(auth()->id(), 'user.password_reset', 'User', $user->id);

        return $this->success(null, 'Password updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::whereNull('deleted_at')->findOrFail($id);
        $user->update(['deleted_at' => now()]);

        ActivityLogService::log(auth()->id(), 'user.deleted', 'User', $user->id);

        return $this->success(null, 'User deleted');
    }

    public function checkUsername(Request $request): JsonResponse
    {
        $request->validate(['username' => 'required|string']);

        $query = User::whereNull('deleted_at')->where('username', $request->username);

        if ($request->filled('exclude_id')) {
            $query->where('id', '!=', $request->exclude_id);
        }

        return $this->success(['available' => ! $query->exists()]);
    }
}
