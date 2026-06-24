<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    protected $fillable = [
        'name',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function groupYears(): HasMany
    {
        return $this->hasMany(GroupYear::class);
    }
}
