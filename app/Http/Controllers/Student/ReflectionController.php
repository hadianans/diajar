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
            ->with(['reflectables.reflectable'])
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $query->where(fn($q) => $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('content', 'like', '%' . $request->search . '%'));
        }

        if ($request->filled('type')) {
            $typeClass = match ($request->type) {
                'assessment' => \App\Models\ClassAssessment::class,
                'assignment' => \App\Models\ClassAssignment::class,
                'material', 'lesson' => \App\Models\Material::class,
                default      => null,
            };
            if ($typeClass) {
                $query->whereHas('reflectables', fn($q) => $q->where('reflectable_type', $typeClass));
            }
        }

        if ($request->filled('subject_id')) {
            $query->whereHas('reflectables', function ($q) use ($request) {
                $q->where(function ($q2) use ($request) {
                    $q2->whereHasMorph('reflectable', [\App\Models\Material::class], function ($q3) use ($request) {
                        $q3->whereHas('chapter', fn($q4) => $q4->where('subject_id', $request->subject_id));
                    })->orWhereHasMorph('reflectable', [\App\Models\ClassAssignment::class, \App\Models\ClassAssessment::class], function ($q3) use ($request) {
                        $q3->whereHas('class', fn($q4) => $q4->where('subject_id', $request->subject_id));
                    });
                });
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                \Carbon\Carbon::parse($request->start_date)->startOfDay(),
                \Carbon\Carbon::parse($request->end_date)->endOfDay()
            ]);
        }

        $perPage = $request->input('per_page', 5);
        $paginated = $query->paginate($perPage);

        // Map relation paths so frontend gets consistent data structure
        $paginated->getCollection()->transform(function ($reflection) {
            $reflection->reflectables->each(function ($reflectable) {
                if ($reflectable->reflectable_type === \App\Models\Material::class && $reflectable->reflectable) {
                    $reflectable->reflectable->load('chapter.subject');
                } elseif (in_array($reflectable->reflectable_type, [\App\Models\ClassAssignment::class, \App\Models\ClassAssessment::class]) && $reflectable->reflectable) {
                    $reflectable->reflectable->load('class.subject');
                }
            });
            return $reflection;
        });

        return $this->success($paginated);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'comprehension_level' => 'required|integer|between:1,5',
            'emotions' => 'nullable|array',
            'reflectable_id' => 'required|integer',
            'reflectable_type' => 'required|string',
        ]);

        $reflection = Reflection::create([
            'student_id' => auth()->id(),
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'comprehension_level' => $request->input('comprehension_level'),
            'emotions' => json_encode($request->input('emotions', [])),
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
            'content' => 'nullable|string',
            'comprehension_level' => 'required|integer|between:1,5',
            'emotions' => 'nullable|array',
        ]);

        $reflection = Reflection::where('student_id', auth()->id())->findOrFail($id);

        $reflection->update([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'comprehension_level' => $request->input('comprehension_level'),
            'emotions' => json_encode($request->input('emotions', [])),
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
