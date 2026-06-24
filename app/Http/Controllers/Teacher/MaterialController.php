<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\MaterialRequest;
use App\Models\Chapter;
use App\Models\Material;
use App\Models\Taggable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class MaterialController extends Controller
{
    use ApiResponse;

    private function verifyChapterOwnership(int $chapterId): void
    {
        Chapter::where('id', $chapterId)->where('teacher_id', auth()->id())->firstOrFail();
    }

    public function store(MaterialRequest $request): JsonResponse
    {
        $this->verifyChapterOwnership($request->chapter_id);

        $material = Material::create($request->except('tag_ids'));

        $this->syncTags($material, $request->input('tag_ids', []));

        $material->load('tags');

        return $this->created($material);
    }

    public function show(int $id): JsonResponse
    {
        $material = Material::with(['chapter', 'subchapter', 'attachments', 'tags'])->findOrFail($id);

        // Verify teacher ownership via chapter
        if ($material->chapter->teacher_id !== auth()->id()) {
            return $this->forbidden();
        }

        // Teacher-side engagement analytics
        $material->completion_count = $material->materialCompletions()->where('is_completed', true)->count();
        $material->avg_time_seconds = round((float) $material->accessLogs()->avg('duration_seconds'));
        $material->avg_material_quality = round((float) $material->reviews()->avg('score'), 1);

        // Comprehension from reflections via reflectables
        $material->avg_comprehension = round((float) \App\Models\Reflection::whereHas('reflectables', function ($q) use ($material) {
            $q->where('reflectable_id', $material->id)
              ->where('reflectable_type', 'App\\Models\\Material');
        })->avg('comprehension_level'), 1);

        return $this->success($material);
    }

    public function update(MaterialRequest $request, int $id): JsonResponse
    {
        $material = Material::findOrFail($id);
        $this->verifyChapterOwnership($material->chapter_id);

        $material->update($request->except('tag_ids'));
        $this->syncTags($material, $request->input('tag_ids', []));

        $material->load('tags');

        return $this->success($material);
    }

    public function publish(int $id): JsonResponse
    {
        $material = Material::findOrFail($id);
        $this->verifyChapterOwnership($material->chapter_id);

        $material->update(['status' => 'published']);

        return $this->success($material);
    }

    public function unpublish(int $id): JsonResponse
    {
        $material = Material::findOrFail($id);
        $this->verifyChapterOwnership($material->chapter_id);

        $material->update(['status' => 'draft']);

        return $this->success($material);
    }

    public function destroy(int $id): JsonResponse
    {
        $material = Material::findOrFail($id);
        $this->verifyChapterOwnership($material->chapter_id);

        // Cascade deletes
        $material->attachments()->delete();
        $material->materialCompletions()->delete();
        $material->accessLogs()->delete();
        $material->reviews()->delete();
        Taggable::where('taggable_id', $material->id)->where('taggable_type', 'App\\Models\\Material')->delete();

        $material->delete();

        return $this->success(null, 'Material deleted');
    }

    public function reorder(MaterialRequest $request): JsonResponse
    {
        foreach ($request->orders as $item) {
            Material::whereHas('chapter', fn ($q) => $q->where('teacher_id', auth()->id()))
                ->where('id', $item['id'])
                ->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Reordered');
    }

    private function syncTags(Material $material, array $tagIds): void
    {
        Taggable::where('taggable_id', $material->id)
            ->where('taggable_type', 'App\\Models\\Material')
            ->delete();

        foreach ($tagIds as $tagId) {
            Taggable::create([
                'tag_id'        => $tagId,
                'taggable_id'   => $material->id,
                'taggable_type' => 'App\\Models\\Material',
            ]);
        }
    }
}
