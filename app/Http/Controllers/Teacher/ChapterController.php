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
        $chapters = Chapter::where('teacher_id', auth()->id())
            ->withCount(['materials', 'classAssignments', 'classAssessments'])
            ->orderBy('order')
            ->get();

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
        $chapter->update($request->validated());

        return $this->success($chapter);
    }

    public function destroy(int $id): JsonResponse
    {
        $chapter = Chapter::where('teacher_id', auth()->id())->findOrFail($id);

        $hasDependents = $chapter->materials()->exists()
            || $chapter->classAssignments()->whereNull('deleted_at')->exists()
            || $chapter->classAssessments()->whereNull('deleted_at')->exists();

        if ($hasDependents) {
            return $this->conflict('Cannot delete chapter with existing materials, assignments, or assessments.');
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
