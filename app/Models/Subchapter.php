<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subchapter extends Model
{
    protected $fillable = [
        'chapter_id',
        'name',
        'description',
        'order',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }
}
