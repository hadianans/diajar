<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rubric extends Model
{
    protected $fillable = [
        'assignment_id',
        'title',
        'description',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    public function rubricCriteria(): HasMany
    {
        return $this->hasMany(RubricCriterion::class);
    }
}
