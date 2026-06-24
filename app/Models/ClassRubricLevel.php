<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassRubricLevel extends Model
{
    protected $table = 'class_rubric_levels';

    protected $fillable = [
        'class_criterion_id',
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

    public function classRubricCriterion(): BelongsTo
    {
        return $this->belongsTo(ClassRubricCriterion::class, 'class_criterion_id');
    }

    public function rubricPoints(): HasMany
    {
        return $this->hasMany(RubricPoint::class, 'class_rubric_level_id');
    }
}
