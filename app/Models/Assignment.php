<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    protected $fillable = [
        'subject_id',
        'title',
        'description',
        'grade',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function rubrics(): HasMany
    {
        return $this->hasMany(Rubric::class);
    }
}
