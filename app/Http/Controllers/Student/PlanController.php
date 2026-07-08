<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Planable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PlanController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Plan::where('student_id', auth()->id())
            ->with('planables')
            ->orderBy('target_date');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        if ($request->filled('chapter_id')) {
            $query->where('chapter_id', $request->chapter_id);
        }
        if ($request->filled('search')) {
            $query->where(fn($q) => $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%'));
        }

        $plans = $query->get();

        $now = Carbon::now();
        $plans->each(function ($plan) use ($now, $request) {
            $plan->derived_status = match (true) {
                $plan->completed_at && $plan->completed_at !== '0000-00-00 00:00:00' => 'completed',
                Carbon::parse($plan->target_date)->lt($now)                           => 'overdue',
                default                                                               => 'active',
            };
        });

        if ($request->filled('status')) {
            $plans = $plans->where('derived_status', $request->status)->values();
        }

        return $this->success($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'class_id'               => 'nullable|integer|exists:classes,id',
            'chapter_id'             => 'nullable|integer|exists:chapters,id',
            'title'                  => 'required|string|max:255',
            'description'            => 'nullable|string',
            'target_date'            => 'required|date',
            'planables'              => 'nullable|array',
            'planables.*.planable_id'   => 'required|integer',
            'planables.*.planable_type' => 'required|string',
        ]);

        $plan = Plan::create([
            'student_id'  => auth()->id(),
            'class_id'    => $request->class_id,
            'chapter_id'  => $request->chapter_id,
            'title'       => $request->title,
            'description' => $request->description,
            'target_date' => $request->target_date,
            'progress'    => 0,
        ]);

        foreach ($request->input('planables', []) as $item) {
            Planable::create([
                'plan_id'       => $plan->id,
                'planable_id'   => $item['planable_id'],
                'planable_type' => $item['planable_type'],
            ]);
        }

        $plan->load('planables');

        return $this->created($plan);
    }

    public function show(int $id): JsonResponse
    {
        $plan = Plan::where('student_id', auth()->id())
            ->with('planables')
            ->findOrFail($id);

        return $this->success($plan);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_date' => 'required|date',
        ]);

        $plan = Plan::where('student_id', auth()->id())->findOrFail($id);
        $plan->update($request->only('title', 'description', 'target_date'));

        return $this->success($plan);
    }

    public function updateProgress(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'progress' => 'required|numeric|min:0|max:1',
        ]);

        $plan = Plan::where('student_id', auth()->id())->findOrFail($id);

        $updates = ['progress' => $request->progress];

        if ($request->progress >= 1.0) {
            $updates['completed_at'] = now();
        }

        $plan->update($updates);

        return $this->success($plan);
    }

    public function addPlanable(Request $request, int $planId): JsonResponse
    {
        $request->validate([
            'planable_id'   => 'required|integer',
            'planable_type' => 'required|string',
        ]);

        Plan::where('student_id', auth()->id())->findOrFail($planId);

        $planable = Planable::firstOrCreate([
            'plan_id'       => $planId,
            'planable_id'   => $request->planable_id,
            'planable_type' => $request->planable_type,
        ]);

        return $this->created($planable);
    }

    public function removePlanable(int $planId, int $planableId): JsonResponse
    {
        Plan::where('student_id', auth()->id())->findOrFail($planId);

        Planable::where('plan_id', $planId)
            ->where('id', $planableId)
            ->delete();

        return $this->success(null, 'Planable removed');
    }

    public function destroy(int $id): JsonResponse
    {
        $plan = Plan::where('student_id', auth()->id())->findOrFail($id);
        $plan->delete(); // cascade deletes planables via FK

        return $this->success(null, 'Plan deleted');
    }
}
