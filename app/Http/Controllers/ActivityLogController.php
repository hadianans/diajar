<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $days = $request->input('days', 7);

        $query = ActivityLog::with('actor:id,full_name,role')
            ->where('created_at', '>=', now()->subDays($days))
            ->orderByDesc('created_at');

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        
        $actorId = $request->input('actor_id');
        if (auth()->user()->role === 'teacher') {
            $actorId = auth()->id();
        }

        if ($actorId) {
            $query->where('actor_id', $actorId);
        }

        $logs = $query->paginate(50)->withQueryString();

        return $this->success($logs);
    }
}
