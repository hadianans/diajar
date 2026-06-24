<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\SubchapterRequest;
use App\Models\Chapter;
use App\Models\Subchapter;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class SubchapterController extends Controller
{
    use ApiResponse;

    private function verifyChapterOwnership(int $chapterId): Chapter
    {
        return Chapter::where('id', $chapterId)
            ->where('teacher_id', auth()->id())
            ->firstOrFail();
    }

    public function store(SubchapterRequest $request, int $chapterId): JsonResponse
    {
        $this->verifyChapterOwnership($chapterId);

        $subchapter = Subchapter::create([
            'chapter_id'  => $chapterId,
            ...$request->validated(),
        ]);

        return $this->created($subchapter);
    }

    public function update(SubchapterRequest $request, int $chapterId, int $id): JsonResponse
    {
        $this->verifyChapterOwnership($chapterId);

        $subchapter = Subchapter::where('chapter_id', $chapterId)->findOrFail($id);
        $subchapter->update($request->validated());

        return $this->success($subchapter);
    }

    public function destroy(int $chapterId, int $id): JsonResponse
    {
        $this->verifyChapterOwnership($chapterId);

        $subchapter = Subchapter::where('chapter_id', $chapterId)->findOrFail($id);

        // Nullify subchapter_id on materials instead of cascade-deleting
        $subchapter->materials()->update(['subchapter_id' => null]);
        $subchapter->delete();

        return $this->success(null, 'Subchapter deleted');
    }

    public function reorder(SubchapterRequest $request, int $chapterId): JsonResponse
    {
        $this->verifyChapterOwnership($chapterId);

        foreach ($request->orders as $item) {
            Subchapter::where('id', $item['id'])
                ->where('chapter_id', $chapterId)
                ->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Reordered');
    }
}
