<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassModel extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'subject_id',
        'teacher_id',
        'group_years_id',
        'day_schedule',
        'time_schedule',
        'assignment_weight',
        'assessment_weight',
    ];

    protected function casts(): array
    {
        return [
            'assignment_weight' => 'float',
            'assessment_weight' => 'float',
            'deleted_at'        => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function groupYear(): BelongsTo
    {
        return $this->belongsTo(GroupYear::class, 'group_years_id');
    }

    public function classAssessments(): HasMany
    {
        return $this->hasMany(ClassAssessment::class, 'class_id');
    }

    public function classAssignments(): HasMany
    {
        return $this->hasMany(ClassAssignment::class, 'class_id');
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class, 'class_id');
    }
}
