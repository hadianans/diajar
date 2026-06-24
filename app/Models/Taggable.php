<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Taggable extends Model
{
    protected $fillable = [
        'tag_id',
        'taggable_id',
        'taggable_type',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    /**
     * Polymorphic target (e.g. Material, Question, ClassAssignment, etc.).
     */
    public function taggable()
    {
        return $this->morphTo();
    }
}
