<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reflection extends Model
{
    protected $fillable = [
        'student_id',
        'title',
        'content',
        'comprehension_level',
        'emotions',
        'teacher_comment',
    ];

    protected function casts(): array
    {
        return [
            'comprehension_level' => 'integer',
            'emotions'            => 'array',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function reflectables(): HasMany
    {
        return $this->hasMany(Reflectable::class, 'reflection_id');
    }
}
