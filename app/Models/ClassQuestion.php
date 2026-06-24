<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassQuestion extends Model
{
    protected $fillable = [
        'question',
        'levels',
        'score',
        'explanation',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'float',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classOptions(): HasMany
    {
        return $this->hasMany(ClassOption::class);
    }

    public function classAssessmentQuestions(): HasMany
    {
        return $this->hasMany(ClassAssessmentQuestion::class, 'class_question_id');
    }

    public function assessmentAnswers(): HasMany
    {
        return $this->hasMany(AssessmentAnswer::class, 'question_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(ClassOption::class);
    }
}
