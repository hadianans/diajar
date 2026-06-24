<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RubricPoint extends Model
{
    protected $fillable = [
        'class_criterion_id',
        'student_id',
        'class_rubric_level_id',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classRubricCriterion(): BelongsTo
    {
        return $this->belongsTo(ClassRubricCriterion::class, 'class_criterion_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function classRubricLevel(): BelongsTo
    {
        return $this->belongsTo(ClassRubricLevel::class, 'class_rubric_level_id');
    }
}
