<?php

namespace App\Services;

use App\Models\ActivityLog;

class ActivityLogService
{
    public static function log(
        int $actorId,
        string $action,
        ?string $targetType = null,
        ?int $targetId = null,
        ?string $description = null,
    ): ActivityLog {
        return ActivityLog::create([
            'actor_id'    => $actorId,
            'action'      => $action,
            'target_type' => $targetType,
            'target_id'   => $targetId,
            'description' => $description,
        ]);
    }
}
