<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassRubric;
use App\Models\ClassRubricCriterion;
use App\Models\ClassRubricLevel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RubricController extends Controller
{
    use ApiResponse;

    public function updateRubric(Request $request, int $assignmentId): JsonResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $rubric = ClassRubric::where('class_assignment_id', $assignmentId)->firstOrFail();
        $rubric->update($request->only('title', 'description'));

        return $this->success($rubric);
    }

    public function destroyRubric(int $assignmentId): JsonResponse
    {
        $rubric = ClassRubric::where('class_assignment_id', $assignmentId)->first();
        if ($rubric) {
            $rubric->criteria()->each(function ($criterion) {
                $criterion->levels()->delete();
                $criterion->delete();
            });
            $rubric->delete();
        }

        return $this->success(null, 'Rubric deleted');
    }

    public function storeCriterion(Request $request, int $rubricId): JsonResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'weight'      => 'required|integer|min:0',
        ]);

        $criterion = ClassRubricCriterion::create([
            'class_rubric_id' => $rubricId,
            ...$request->only('title', 'description', 'weight'),
        ]);

        return $this->created($criterion);
    }

    public function updateCriterion(Request $request, int $rubricId, int $criterionId): JsonResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'weight'      => 'required|integer|min:0',
        ]);

        $criterion = ClassRubricCriterion::where('class_rubric_id', $rubricId)->findOrFail($criterionId);
        $criterion->update($request->only('title', 'description', 'weight'));

        return $this->success($criterion);
    }

    public function destroyCriterion(int $rubricId, int $criterionId): JsonResponse
    {
        $criterion = ClassRubricCriterion::where('class_rubric_id', $rubricId)->findOrFail($criterionId);
        $criterion->levels()->delete();
        $criterion->delete();

        return $this->success(null, 'Criterion deleted');
    }

    public function storeLevel(Request $request, int $criterionId): JsonResponse
    {
        $request->validate([
            'label'       => 'required|string|max:255',
            'score'       => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $level = ClassRubricLevel::create([
            'class_criterion_id' => $criterionId,
            ...$request->only('label', 'score', 'description'),
        ]);

        return $this->created($level);
    }

    public function updateLevel(Request $request, int $criterionId, int $levelId): JsonResponse
    {
        $request->validate([
            'label'       => 'required|string|max:255',
            'score'       => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $level = ClassRubricLevel::where('class_criterion_id', $criterionId)->findOrFail($levelId);
        $level->update($request->only('label', 'score', 'description'));

        return $this->success($level);
    }

    public function destroyLevel(int $criterionId, int $levelId): JsonResponse
    {
        $level = ClassRubricLevel::where('class_criterion_id', $criterionId)->findOrFail($levelId);
        $level->delete();

        return $this->success(null, 'Level deleted');
    }
}
