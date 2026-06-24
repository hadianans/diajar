<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialAccessLog extends Model
{
    protected $fillable = [
        'material_id',
        'student_id',
        'access_start',
        'access_end',
        'duration_seconds',
        'interaction_data',
    ];

    protected function casts(): array
    {
        return [
            'access_start'     => 'datetime',
            'access_end'       => 'datetime',
            'duration_seconds' => 'integer',
            'interaction_data' => 'array',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
