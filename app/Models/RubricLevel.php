<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RubricLevel extends Model
{
    protected $fillable = [
        'criterion_id',
        'label',
        'score',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function criterion(): BelongsTo
    {
        return $this->belongsTo(RubricCriterion::class, 'criterion_id');
    }
}
