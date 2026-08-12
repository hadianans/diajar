<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\MaterialRequest;
use App\Models\Chapter;
use App\Models\Material;
use App\Models\Taggable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        if ($request->filled('order')) {
            $query = Material::where('chapter_id', $request->chapter_id);

            if ($request->filled('subchapter_id')) {
                $query->where('subchapter_id', $request->subchapter_id);
            } else {
                $query->whereNull('subchapter_id');
            }

            $query->where('order', '>=', $request->order)->increment('order');
        }

        if ($request->hasFile('core_file')) {
            $path = $request->file('core_file')->store('materials/core', 'public');
            $request->merge(['file_url' => asset('storage/' . $path)]);
        }

        $material = Material::create($request->except(['tag_ids', 'attachments', 'attachment_titles', 'core_file']));

        $this->syncTags($material, $request->input('tag_ids', []));
        $this->handleAttachments($material, $request);

        $material->load('tags', 'attachments');

        return $this->created($material);
    }

    public function show(int $id): JsonResponse
    {
        $material = Material::with(['chapter', 'subchapter', 'attachments', 'tags'])->findOrFail($id);

        // Verify teacher ownership via chapter or subchapter->chapter
        $teacherId = $material->chapter?->teacher_id ?? $material->subchapter?->chapter?->teacher_id;
        if (!$teacherId || (int) $teacherId !== (int) auth()->id()) {
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

        $material->activities = \App\Models\User::whereHas('materialCompletions', function($q) use ($material) {
            $q->where('material_id', $material->id);
        })->orWhereHas('materialAccessLogs', function($q) use ($material) {
            $q->where('material_id', $material->id);
        })->with(['materialCompletions' => function($q) use ($material) {
            $q->where('material_id', $material->id);
        }, 'materialAccessLogs' => function($q) use ($material) {
            $q->where('material_id', $material->id)->latest('access_start');
        }])->get()->map(function($student) {
            $completion = $student->materialCompletions->first();
            $log = $student->materialAccessLogs->first();
            
            return [
                'id' => $student->id,
                'name' => $student->full_name,
                'picture' => $student->picture,
                'is_completed' => $completion ? (bool) $completion->is_completed : false,
                'completed_at' => $completion ? $completion->completed_at : null,
                'last_access' => $log ? $log->access_start : null,
                'duration_seconds' => $log ? $log->duration_seconds : 0,
            ];
        });

        return $this->success($material);
    }

    public function update(MaterialRequest $request, int $id): JsonResponse
    {
        $material = Material::findOrFail($id);
        $this->verifyChapterOwnership($material->chapter_id);

        if ($request->filled('order')) {
            $newOrder = $request->order;
            $oldOrder = $material->order;
            $newSubchapterId = $request->input('subchapter_id');
            $oldSubchapterId = $material->subchapter_id;
            $newChapterId = $request->input('chapter_id', $material->chapter_id);

            // Scope logic closures
            $applyOldScope = fn($q) => $q->where('chapter_id', $material->chapter_id)
                                         ->when($oldSubchapterId, fn($q2) => $q2->where('subchapter_id', $oldSubchapterId), fn($q2) => $q2->whereNull('subchapter_id'));
            $applyNewScope = fn($q) => $q->where('chapter_id', $newChapterId)
                                         ->when($newSubchapterId, fn($q2) => $q2->where('subchapter_id', $newSubchapterId), fn($q2) => $q2->whereNull('subchapter_id'));

            if ($newSubchapterId != $oldSubchapterId || $newChapterId != $material->chapter_id) {
                // Remove from old scope (decrement items after it)
                Material::where($applyOldScope)
                    ->where('order', '>', $oldOrder)
                    ->decrement('order');

                // Insert into new scope (increment items at or after it)
                Material::where($applyNewScope)
                    ->where('order', '>=', $newOrder)
                    ->increment('order');
            } else {
                // Same scope
                if ($newOrder != $oldOrder) {
                    $query = Material::where($applyOldScope);

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

        if ($request->hasFile('core_file')) {
            $path = $request->file('core_file')->store('materials/core', 'public');
            $request->merge(['file_url' => asset('storage/' . $path)]);
        }

        if ($request->filled('deleted_attachments')) {
            $material->attachments()->whereIn('id', $request->input('deleted_attachments'))->delete();
        }

        $material->update($request->except(['tag_ids', 'attachments', 'attachment_titles', 'core_file', 'deleted_attachments']));
        $this->syncTags($material, $request->input('tag_ids', []));
        $this->handleAttachments($material, $request);

        $material->load('tags', 'attachments');

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

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $path = $request->file('image')->store('materials/images', 'public');

        return $this->success(['url' => asset('storage/' . $path)]);
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

    private function handleAttachments(Material $material, Request $request): void
    {
        if ($request->hasFile('attachments')) {
            $files = $request->file('attachments');
            $titles = $request->input('attachment_titles', []);
            
            foreach ($files as $index => $file) {
                $path = $file->store('materials/attachments', 'public');
                $title = !empty($titles[$index]) ? $titles[$index] : $file->getClientOriginalName();
                
                $material->attachments()->create([
                    'title' => $title,
                    'file_url' => asset('storage/' . $path),
                    'description' => null, // Or handle description if needed later
                ]);
            }
        }
    }
}
