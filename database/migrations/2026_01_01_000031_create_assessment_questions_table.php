<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('assessment_questions')) Schema::create('assessment_questions', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('assessment_id')->nullable();
            $table->integer('question_id')->nullable();
            $table->timestamps();

            $table->foreign('assessment_id')->references('id')->on('assessments');
            $table->foreign('question_id')->references('id')->on('questions');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_questions');
    }
};
