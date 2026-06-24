<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassOption extends Model
{
    protected $fillable = [
        'class_question_id',
        'option',
        'is_correct',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classQuestion(): BelongsTo
    {
        return $this->belongsTo(ClassQuestion::class);
    }

    public function assessmentAnswers(): HasMany
    {
        return $this->hasMany(AssessmentAnswer::class, 'selected_option_id');
    }
}
