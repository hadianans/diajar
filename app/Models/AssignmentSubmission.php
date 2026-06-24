<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssignmentSubmission extends Model
{
    protected $fillable = [
        'student_id',
        'class_assignment_id',
        'path_url',
        'student_note',
        'grade',
        'feedback',
        'status',
        'grade_by',
    ];

    protected function casts(): array
    {
        return [
            'grade'      => 'float',
            'deleted_at' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function classAssignment(): BelongsTo
    {
        return $this->belongsTo(ClassAssignment::class);
    }

    public function gradedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'grade_by');
    }

    public function rubricPoints()
    {
        return RubricPoint::where('student_id', $this->student_id)
            ->whereHas('classRubricCriterion.classRubric', fn ($q) => $q->where('class_assignment_id', $this->class_assignment_id));
    }
}
