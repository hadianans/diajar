<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\MaterialReview;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialReviewController extends Controller
{
    use ApiResponse;

    public function upsert(Request $request, int $materialId): JsonResponse
    {
        $request->validate([
            'score' => 'required|integer|between:1,5',
        ]);

        $review = MaterialReview::updateOrCreate(
            [
                'student_id'  => auth()->id(),
                'material_id' => $materialId,
            ],
            [
                'score' => $request->score,
            ]
        );

        return $this->success($review);
    }

    public function show(int $materialId): JsonResponse
    {
        $review = MaterialReview::where('student_id', auth()->id())
            ->where('material_id', $materialId)
            ->first();

        return $this->success($review);
    }
}
