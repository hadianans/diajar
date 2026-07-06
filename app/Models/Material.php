<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    protected $fillable = [
        'chapter_id',
        'subchapter_id',
        'title',
        'description',
        'content',
        'order',
        'file_type',
        'duration_seconds',
        'file_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'duration_seconds' => 'integer',
            'order'            => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function subchapter(): BelongsTo
    {
        return $this->belongsTo(Subchapter::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function accessLogs(): HasMany
    {
        return $this->hasMany(MaterialAccessLog::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(MaterialCompletion::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(MaterialReview::class);
    }

    public function classAssessments(): HasMany
    {
        return $this->hasMany(ClassAssessment::class);
    }

    public function classAssignments(): HasMany
    {
        return $this->hasMany(ClassAssignment::class);
    }

    public function materialCompletions(): HasMany
    {
        return $this->hasMany(MaterialCompletion::class);
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function taggables(): HasMany
    {
        return $this->hasMany(Taggable::class, 'taggable_id')->where('taggable_type', self::class);
    }
}
