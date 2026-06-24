<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('assignment_submissions')) Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('student_id');
            $table->integer('class_assignment_id');
            $table->string('path_url')->nullable();
            $table->text('student_note')->nullable();
            $table->float('grade')->nullable();
            $table->text('feedback')->nullable();
            $table->enum('status', ['submitted', 'graded']);
            $table->integer('grade_by')->nullable();
            $table->timestamp('deleted_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();

            $table->unique(['student_id', 'class_assignment_id'], 'assignment_submissions_index');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('class_assignment_id')->references('id')->on('class_assignments');
            $table->foreign('grade_by')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
    }
};
