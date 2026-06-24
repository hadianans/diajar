<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolYear extends Model
{
    protected $fillable = [
        'date_start',
        'date_end',
        'name',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_start' => 'date',
            'date_end'   => 'date',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function groupYears(): HasMany
    {
        return $this->hasMany(GroupYear::class, 'year_id');
    }
}
