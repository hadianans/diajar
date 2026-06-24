<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Planable extends Model
{
    protected $fillable = [
        'plan_id',
        'planable_id',
        'planable_type',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Polymorphic target (e.g. Material, ClassAssessment, ClassAssignment).
     */
    public function planable()
    {
        return $this->morphTo();
    }
}
