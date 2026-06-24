<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'student_id',
        'class_id',
        'chapter_id',
        'title',
        'description',
        'target_date',
        'progress',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'target_date'  => 'datetime',
            'completed_at' => 'datetime',
            'progress'     => 'float',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function planables(): HasMany
    {
        return $this->hasMany(Planable::class);
    }
}
