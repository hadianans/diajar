<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\ClassAssessment;
use App\Models\Material;
use App\Models\MaterialAccessLog;
use App\Models\MaterialCompletion;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    use ApiResponse;

    public function show(int $id): JsonResponse
    {
        $material = Material::where('status', 'published')
            ->with(['attachments', 'tags', 'chapter:id,name,subject_id', 'subchapter:id,name'])
            ->findOrFail($id);

        $studentId = auth()->id();

        $material->is_completed = MaterialCompletion::where('student_id', $studentId)
            ->where('material_id', $id)
            ->where('is_completed', true)
            ->exists();

        $material->is_bookmarked = Bookmark::where('student_id', $studentId)
            ->where('bookmarkable_id', $id)
            ->where('bookmarkable_type', 'App\\Models\\Material')
            ->exists();

        // Related assessment
        $material->related_assessment = ClassAssessment::where('material_id', $id)
            ->whereNull('deleted_at')
            ->first(['id', 'title']);

        // Prev / next materials in same chapter
        $siblings = Material::where('chapter_id', $material->chapter_id)
            ->where('status', 'published')
            ->orderBy('order')
            ->pluck('id');

        $currentIndex = $siblings->search($id);
        $material->prev_material_id = $currentIndex > 0 ? $siblings[$currentIndex - 1] : null;
        $material->next_material_id = $currentIndex < $siblings->count() - 1 ? $siblings[$currentIndex + 1] : null;

        return $this->success($material);
    }

    public function startAccess(Request $request, int $id): JsonResponse
    {
        $log = MaterialAccessLog::create([
            'material_id' => $id,
            'student_id'  => auth()->id(),
            'access_start' => now(),
        ]);

        return $this->success(['log_id' => $log->id]);
    }

    public function endAccess(Request $request, int $logId): JsonResponse
    {
        $log = MaterialAccessLog::where('student_id', auth()->id())->findOrFail($logId);

        $now = now();
        $log->update([
            'access_end'       => $now,
            'duration_seconds' => $log->access_start ? $now->diffInSeconds($log->access_start) : 0,
            'interaction_data' => $request->input('interaction_data'),
        ]);

        return $this->success($log->fresh());
    }

    public function markComplete(int $id): JsonResponse
    {
        $completion = MaterialCompletion::updateOrCreate(
            ['student_id' => auth()->id(), 'material_id' => $id],
            ['is_completed' => true, 'completed_at' => now()]
        );

        return $this->success($completion);
    }

    public function markIncomplete(int $id): JsonResponse
    {
        $completion = MaterialCompletion::updateOrCreate(
            ['student_id' => auth()->id(), 'material_id' => $id],
            ['is_completed' => false, 'completed_at' => null]
        );

        return $this->success($completion);
    }
}
