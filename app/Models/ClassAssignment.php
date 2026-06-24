<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class ClassAssignment extends Model
{
    protected $table = 'class_assignments';

    protected $fillable = [
        'class_id',
        'chapter_id',
        'material_id',
        'title',
        'description',
        'due_date',
        'grade',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'due_date'   => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function class(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function classRubrics(): HasMany
    {
        return $this->hasMany(ClassRubric::class);
    }

    public function classModel(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function rubric(): HasOne
    {
        return $this->hasOne(ClassRubric::class, 'class_assignment_id');
    }

    public function tags()
    {
        return Tag::whereHas('taggables', fn ($q) => $q->where('taggable_id', $this->id)->where('taggable_type', self::class));
    }

    public function taggables(): HasMany
    {
        return $this->hasMany(Taggable::class, 'taggable_id')->where('taggable_type', self::class);
    }
}
