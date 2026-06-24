<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Reflectable;
use App\Models\Reflection;
use App\Models\StudentGroup;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReflectionController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Reflection::where('student_id', auth()->id())
            ->with('reflectables')
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $query->where(fn($q) => $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('content', 'like', '%' . $request->search . '%'));
        }

        return $this->success($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'comprehension_level' => 'required|integer|between:1,5',
            'emotions' => 'required|array',
            'reflectable_id' => 'required|integer',
            'reflectable_type' => 'required|string',
        ]);

        $reflection = Reflection::create([
            'student_id' => auth()->id(),
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'comprehension_level' => $request->input('comprehension_level'),
            'emotions' => json_encode($request->input('emotions')),
        ]);

        Reflectable::create([
            'reflection_id' => $reflection->id,
            'reflectable_id' => $request->reflectable_id,
            'reflectable_type' => $request->reflectable_type,
        ]);

        $reflection->load('reflectables');

        return $this->created($reflection);
    }

    public function show(int $id): JsonResponse
    {
        $reflection = Reflection::where('student_id', auth()->id())
            ->with('reflectables')
            ->findOrFail($id);

        return $this->success($reflection);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'comprehension_level' => 'required|integer|between:1,5',
            'emotions' => 'required|array',
        ]);

        $reflection = Reflection::where('student_id', auth()->id())->findOrFail($id);

        $reflection->update([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'comprehension_level' => $request->input('comprehension_level'),
            'emotions' => json_encode($request->input('emotions')),
        ]);

        return $this->success($reflection);
    }

    public function destroy(int $id): JsonResponse
    {
        $reflection = Reflection::where('student_id', auth()->id())->findOrFail($id);
        $reflection->delete(); // cascade deletes reflectables via FK

        return $this->success(null, 'Reflection deleted');
    }

    /**
     * Teacher-only: add comment to a student's reflection.
     * This is routed under /api/teacher/reflections/{id}/comment
     */
    public function addComment(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'teacher_comment' => 'required|string',
        ]);

        $reflection = Reflection::findOrFail($id);

        // Verify teacher has access: reflection student must be in teacher's class
        $studentId = $reflection->student_id;
        $teacherId = auth()->id();

        $hasAccess = StudentGroup::where('student_id', $studentId)
            ->whereHas('groupYear.classes', fn($q) => $q->where('teacher_id', $teacherId)->whereNull('deleted_at'))
            ->exists();

        if (!$hasAccess) {
            return $this->forbidden('Student is not in your class.');
        }

        $reflection->update(['teacher_comment' => $request->teacher_comment]);

        return $this->success($reflection);
    }
}
