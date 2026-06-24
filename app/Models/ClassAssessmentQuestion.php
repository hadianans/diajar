<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassAssessmentQuestion extends Model
{
    protected $table = 'class_assessment_questions';

    protected $fillable = [
        'class_assessment_id',
        'class_question_id',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classAssessment(): BelongsTo
    {
        return $this->belongsTo(ClassAssessment::class);
    }

    public function classQuestion(): BelongsTo
    {
        return $this->belongsTo(ClassQuestion::class);
    }
}
