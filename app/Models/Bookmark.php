<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bookmark extends Model
{
    protected $fillable = [
        'student_id',
        'bookmarkable_id',
        'bookmarkable_type',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Polymorphic target (e.g. Material, ClassAssessment, ClassAssignment).
     */
    public function bookmarkable()
    {
        return $this->morphTo();
    }
}
