<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('rubric_points')) Schema::create('rubric_points', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_criterion_id');
            $table->integer('student_id');
            $table->integer('class_rubric_level_id');
            $table->timestamps();

            $table->unique(['student_id', 'class_criterion_id'], 'rubric_points_index');
            $table->foreign('class_criterion_id')->references('id')->on('class_rubric_criteria');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('class_rubric_level_id')->references('id')->on('class_rubric_levels');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rubric_points');
    }
};
