<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function taggables(): HasMany
    {
        return $this->hasMany(Taggable::class);
    }
}
