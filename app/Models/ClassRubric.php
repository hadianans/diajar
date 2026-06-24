<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassRubric extends Model
{
    protected $fillable = [
        'class_assignment_id',
        'title',
        'description',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classAssignment(): BelongsTo
    {
        return $this->belongsTo(ClassAssignment::class);
    }

    public function classRubricCriteria(): HasMany
    {
        return $this->hasMany(ClassRubricCriterion::class, 'class_rubric_id');
    }

    public function criteria(): HasMany
    {
        return $this->hasMany(ClassRubricCriterion::class, 'class_rubric_id');
    }
}
