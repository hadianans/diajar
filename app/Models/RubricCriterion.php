<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RubricCriterion extends Model
{
    protected $table = 'rubric_criteria';

    protected $fillable = [
        'rubric_id',
        'title',
        'description',
        'weight',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function rubric(): BelongsTo
    {
        return $this->belongsTo(Rubric::class);
    }

    public function rubricLevels(): HasMany
    {
        return $this->hasMany(RubricLevel::class, 'criterion_id');
    }
}
