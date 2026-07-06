<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassAssignmentAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_assignment_id',
        'title',
        'file_url',
    ];

    public function classAssignment()
    {
        return $this->belongsTo(ClassAssignment::class);
    }
}
