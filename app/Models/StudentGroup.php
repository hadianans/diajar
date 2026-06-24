<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentGroup extends Model
{
    protected $fillable = [
        'student_id',
        'group_year_id',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function groupYear(): BelongsTo
    {
        return $this->belongsTo(GroupYear::class, 'group_year_id');
    }
}
