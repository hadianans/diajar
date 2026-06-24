<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\AttachmentRequest;
use App\Models\Attachment;
use App\Models\Material;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AttachmentController extends Controller
{
    use ApiResponse;

    private function verifyMaterialOwnership(int $materialId): Material
    {
        return Material::whereHas('chapter', fn ($q) => $q->where('teacher_id', auth()->id()))
            ->findOrFail($materialId);
    }

    public function store(AttachmentRequest $request, int $materialId): JsonResponse
    {
        $this->verifyMaterialOwnership($materialId);

        $attachment = Attachment::create([
            'material_id' => $materialId,
            ...$request->validated(),
        ]);

        return $this->created($attachment);
    }

    public function update(AttachmentRequest $request, int $materialId, int $id): JsonResponse
    {
        $this->verifyMaterialOwnership($materialId);

        $attachment = Attachment::where('material_id', $materialId)->findOrFail($id);
        $attachment->update($request->validated());

        return $this->success($attachment);
    }

    public function destroy(int $materialId, int $id): JsonResponse
    {
        $this->verifyMaterialOwnership($materialId);

        $attachment = Attachment::where('material_id', $materialId)->findOrFail($id);
        $attachment->delete();

        return $this->success(null, 'Attachment deleted');
    }
}
