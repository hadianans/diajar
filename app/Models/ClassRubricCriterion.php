<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassRubricCriterion extends Model
{
    protected $table = 'class_rubric_criteria';

    protected $fillable = [
        'class_rubric_id',
        'title',
        'description',
        'weight',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classRubric(): BelongsTo
    {
        return $this->belongsTo(ClassRubric::class, 'class_rubric_id');
    }

    public function classRubricLevels(): HasMany
    {
        return $this->hasMany(ClassRubricLevel::class, 'class_criterion_id');
    }

    public function rubricPoints(): HasMany
    {
        return $this->hasMany(RubricPoint::class, 'class_criterion_id');
    }

    public function levels(): HasMany
    {
        return $this->hasMany(ClassRubricLevel::class, 'class_criterion_id');
    }
}
