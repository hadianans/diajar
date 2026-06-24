<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SchoolYearRequest;
use App\Models\SchoolYear;
use App\Services\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class SchoolYearController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $years = SchoolYear::orderByDesc('date_start')->get();

        return $this->success($years);
    }

    public function store(SchoolYearRequest $request): JsonResponse
    {
        $year = SchoolYear::create($request->validated());

        ActivityLogService::log(auth()->id(), 'school_year.created', 'SchoolYear', $year->id);

        return $this->created($year);
    }

    public function show(int $id): JsonResponse
    {
        $year = SchoolYear::findOrFail($id);

        $year->load([
            'groupYears.group',
            'groupYears.studentGroups',
            'groupYears.classes',
        ]);

        $year->groupYears->each(function ($gy) {
            $gy->student_count = $gy->studentGroups->count();
            $gy->class_count = $gy->classes->count();
            unset($gy->studentGroups, $gy->classes);
        });

        return $this->success($year);
    }

    public function update(SchoolYearRequest $request, int $id): JsonResponse
    {
        $year = SchoolYear::findOrFail($id);
        $year->update($request->validated());

        return $this->success($year);
    }

    public function archive(int $id): JsonResponse
    {
        $year = SchoolYear::findOrFail($id);

        if ($year->status !== 'active') {
            return $this->error('Only active years can be archived.', 422);
        }

        $year->update(['status' => 'archive']);

        ActivityLogService::log(auth()->id(), 'school_year.archived', 'SchoolYear', $year->id);

        return $this->success($year);
    }

    public function reactivate(int $id): JsonResponse
    {
        $year = SchoolYear::findOrFail($id);

        if ($year->status === 'active') {
            return $this->error('Year is already active.', 422);
        }

        try {
            $year->update(['status' => 'active']);
        } catch (\Illuminate\Database\QueryException $e) {
            return $this->error('Another school year is already active. Archive it first.', 409);
        }

        ActivityLogService::log(auth()->id(), 'school_year.reactivated', 'SchoolYear', $year->id);

        return $this->success($year);
    }
}
