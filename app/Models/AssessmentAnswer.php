<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentAnswer extends Model
{
    protected $fillable = [
        'attempt_id',
        'question_id',
        'selected_option_id',
        'is_correct',
        'marked_for_review',
    ];

    protected function casts(): array
    {
        return [
            'is_correct'        => 'boolean',
            'marked_for_review' => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(AssessmentAttempt::class, 'attempt_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(ClassQuestion::class, 'question_id');
    }

    public function selectedOption(): BelongsTo
    {
        return $this->belongsTo(ClassOption::class, 'selected_option_id');
    }

    public function classQuestion(): BelongsTo
    {
        return $this->belongsTo(ClassQuestion::class, 'question_id');
    }
}
