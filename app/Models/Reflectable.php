<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reflectable extends Model
{
    protected $fillable = [
        'reflection_id',
        'reflectable_id',
        'reflectable_type',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function reflection(): BelongsTo
    {
        return $this->belongsTo(Reflection::class);
    }

    /**
     * Polymorphic target (e.g. Material, ClassAssessment, ClassAssignment).
     */
    public function reflectable()
    {
        return $this->morphTo();
    }
}
