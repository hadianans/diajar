<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('assessment_attempts')) Schema::create('assessment_attempts', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_assessment_id');
            $table->integer('student_id');
            $table->timestamp('start_time')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('end_time')->default('0000-00-00 00:00:00');
            $table->timestamp('submit_time')->default('0000-00-00 00:00:00');
            $table->integer('time_spent_seconds')->nullable();
            $table->enum('status', ['progress', 'submitted', 'graded']);
            $table->float('grade')->nullable();
            $table->integer('grade_by')->nullable();
            $table->timestamps();

            $table->foreign('class_assessment_id')->references('id')->on('class_assessments');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('grade_by')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_attempts');
    }
};
