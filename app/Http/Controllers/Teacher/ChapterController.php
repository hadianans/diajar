<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\ChapterRequest;
use App\Models\Chapter;
use App\Models\SubjectTeacher;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Chapter::where('teacher_id', auth()->id())
            ->withCount(['materials', 'classAssignments', 'classAssessments']);
            
        if ($search = $request->input('search')) {
            $searchStr = strtolower($search);
            $query->where(function ($q) use ($searchStr) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchStr}%"])
                  ->orWhereRaw('LOWER(tags) LIKE ?', ["%{$searchStr}%"]);
            });
        }

        $chapters = $query->orderBy('order')->get();

        return $this->success($chapters);
    }

    public function store(ChapterRequest $request): JsonResponse
    {
        $linked = SubjectTeacher::where('subject_id', $request->subject_id)
            ->where('teacher_id', auth()->id())
            ->exists();

        if (! $linked) {
            return $this->forbidden('You are not linked to this subject.');
        }

        if ($request->filled('order')) {
            $query = Chapter::where('teacher_id', auth()->id())
                ->where('subject_id', $request->subject_id);

            if ($request->filled('target_grade')) {
                $query->where('target_grade', $request->target_grade);
            } else {
                $query->whereNull('target_grade');
            }

            $query->where('order', '>=', $request->order)->increment('order');
        }

        $chapter = Chapter::create([
            ...$request->validated(),
            'teacher_id' => auth()->id(),
        ]);

        return $this->created($chapter);
    }

    public function show(int $id): JsonResponse
    {
        $chapter = Chapter::where('teacher_id', auth()->id())
            ->with([
                'subchapters' => fn ($q) => $q->orderBy('order'),
                'subchapters.materials' => fn ($q) => $q->orderBy('order'),
                'materials' => fn ($q) => $q->whereNull('subchapter_id')->orderBy('order'),
                'classAssignments' => fn ($q) => $q->whereNull('deleted_at')->withCount('submissions'),
                'classAssessments' => fn ($q) => $q->whereNull('deleted_at')->withCount('attempts'),
            ])
            ->findOrFail($id);

        return $this->success($chapter);
    }

    public function update(ChapterRequest $request, int $id): JsonResponse
    {
        $chapter = Chapter::where('teacher_id', auth()->id())->findOrFail($id);

        if ($request->filled('order')) {
            $newOrder = $request->order;
            $oldOrder = $chapter->order;
            $newTargetGrade = $request->input('target_grade');
            $oldTargetGrade = $chapter->target_grade;
            $newSubjectId = $request->input('subject_id', $chapter->subject_id);

            // Scope logic closures
            $applyOldScope = fn($q) => $q->where('subject_id', $chapter->subject_id)
                                         ->when($oldTargetGrade, fn($q2) => $q2->where('target_grade', $oldTargetGrade), fn($q2) => $q2->whereNull('target_grade'));
            $applyNewScope = fn($q) => $q->where('subject_id', $newSubjectId)
                                         ->when($newTargetGrade, fn($q2) => $q2->where('target_grade', $newTargetGrade), fn($q2) => $q2->whereNull('target_grade'));

            if ($newTargetGrade != $oldTargetGrade || $newSubjectId != $chapter->subject_id) {
                // Remove from old scope (decrement items after it)
                Chapter::where('teacher_id', auth()->id())
                    ->where($applyOldScope)
                    ->where('order', '>', $oldOrder)
                    ->decrement('order');

                // Insert into new scope (increment items at or after it)
                Chapter::where('teacher_id', auth()->id())
                    ->where($applyNewScope)
                    ->where('order', '>=', $newOrder)
                    ->increment('order');
            } else {
                // Same scope
                if ($newOrder != $oldOrder) {
                    $query = Chapter::where('teacher_id', auth()->id())->where($applyOldScope);

                    if ($oldOrder > $newOrder) {
                        // Moved up (e.g., 3 -> 2). Increment items in between.
                        $query->where('order', '>=', $newOrder)
                              ->where('order', '<', $oldOrder)
                              ->increment('order');
                    } else {
                        // Moved down (e.g., 1 -> 4). Decrement items in between.
                        $query->where('order', '>', $oldOrder)
                              ->where('order', '<=', $newOrder)
                              ->decrement('order');
                    }
                }
            }
        }

        $chapter->update($request->validated());

        return $this->success($chapter);
    }

    public function destroy(int $id): JsonResponse
    {
        $chapter = Chapter::where('teacher_id', auth()->id())->findOrFail($id);

        // Check if there are any materials, assignments, or assessments (including soft-deleted ones)
        // We cannot delete the chapter if it has soft-deleted dependents due to DB foreign key constraints.
        $hasDependents = $chapter->materials()->exists()
            || $chapter->classAssignments()->exists()
            || $chapter->classAssessments()->exists();

        if ($hasDependents) {
            return $this->conflict('Cannot delete chapter with existing materials, assignments, or assessments (including deleted ones).');
        }

        $chapter->delete();

        return $this->success(null, 'Chapter deleted');
    }

    public function reorder(ChapterRequest $request): JsonResponse
    {
        foreach ($request->orders as $item) {
            Chapter::where('id', $item['id'])
                ->where('teacher_id', auth()->id())
                ->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Reordered');
    }
}
