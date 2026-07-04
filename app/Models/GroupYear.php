<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupYear extends Model
{
    protected $fillable = [
        'group_id',
        'year_id',
        'grade',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class, 'year_id');
    }

    public function studentGroups(): HasMany
    {
        return $this->hasMany(StudentGroup::class, 'group_year_id');
    }

    public function classes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(ClassModel::class, 'class_group_years', 'group_year_id', 'class_id');
    }
}
