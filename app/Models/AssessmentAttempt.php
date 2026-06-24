<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentAttempt extends Model
{
    protected $fillable = [
        'class_assessment_id',
        'student_id',
        'start_time',
        'end_time',
        'submit_time',
        'time_spent_seconds',
        'status',
        'grade',
        'grade_by',
    ];

    protected function casts(): array
    {
        return [
            'start_time'         => 'datetime',
            'end_time'           => 'datetime',
            'submit_time'        => 'datetime',
            'time_spent_seconds' => 'integer',
            'grade'              => 'float',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function classAssessment(): BelongsTo
    {
        return $this->belongsTo(ClassAssessment::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function gradedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'grade_by');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(AssessmentAnswer::class, 'attempt_id');
    }
}
