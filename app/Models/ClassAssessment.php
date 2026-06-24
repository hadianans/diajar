<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassAssessment extends Model
{
    protected $table = 'class_assessments';

    protected $fillable = [
        'class_id',
        'chapter_id',
        'material_id',
        'title',
        'description',
        'start_date',
        'due_date',
        'duration',
        'max_attempts',
        'pass_threshold',
    ];

    protected function casts(): array
    {
        return [
            'start_date'     => 'datetime',
            'due_date'       => 'datetime',
            'duration'       => 'integer',
            'max_attempts'   => 'integer',
            'pass_threshold' => 'float',
            'deleted_at'     => 'datetime',
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

    public function classAssessmentQuestions(): HasMany
    {
        return $this->hasMany(ClassAssessmentQuestion::class);
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(AssessmentAttempt::class);
    }

    public function classModel(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ClassAssessmentQuestion::class);
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
