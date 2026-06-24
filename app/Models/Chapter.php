<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chapter extends Model
{
    protected $fillable = [
        'subject_id',
        'teacher_id',
        'name',
        'description',
        'order',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function subchapters(): HasMany
    {
        return $this->hasMany(Subchapter::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function classAssessments(): HasMany
    {
        return $this->hasMany(ClassAssessment::class);
    }

    public function classAssignments(): HasMany
    {
        return $this->hasMany(ClassAssignment::class);
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class);
    }
}
