<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'username',
        'email',
        'password',
        'picture',
        'role',
        'gender',
        'is_active',
        'active_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'   => 'hashed',
            'deleted_at' => 'datetime',
            'active_at'  => 'datetime',
            'gender'     => 'boolean',
            'is_active'  => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'actor_id');
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class, 'teacher_id');
    }

    public function classes(): HasMany
    {
        return $this->hasMany(ClassModel::class, 'teacher_id');
    }

    public function subjectTeachers(): HasMany
    {
        return $this->hasMany(SubjectTeacher::class, 'teacher_id');
    }

    public function studentGroups(): HasMany
    {
        return $this->hasMany(StudentGroup::class, 'student_id');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class, 'student_id');
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class, 'student_id');
    }

    public function reflections(): HasMany
    {
        return $this->hasMany(Reflection::class, 'student_id');
    }

    public function materialCompletions(): HasMany
    {
        return $this->hasMany(MaterialCompletion::class, 'student_id');
    }

    public function materialAccessLogs(): HasMany
    {
        return $this->hasMany(MaterialAccessLog::class, 'student_id');
    }

    public function materialReviews(): HasMany
    {
        return $this->hasMany(MaterialReview::class, 'student_id');
    }

    public function assessmentAttempts(): HasMany
    {
        return $this->hasMany(AssessmentAttempt::class, 'student_id');
    }

    public function gradedAttempts(): HasMany
    {
        return $this->hasMany(AssessmentAttempt::class, 'grade_by');
    }

    public function assignmentSubmissions(): HasMany
    {
        return $this->hasMany(AssignmentSubmission::class, 'student_id');
    }

    public function gradedSubmissions(): HasMany
    {
        return $this->hasMany(AssignmentSubmission::class, 'grade_by');
    }

    public function rubricPoints(): HasMany
    {
        return $this->hasMany(RubricPoint::class, 'student_id');
    }
}
