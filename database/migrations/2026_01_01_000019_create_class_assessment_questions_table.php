<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_assessment_questions')) Schema::create('class_assessment_questions', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_assessment_id')->nullable();
            $table->integer('class_question_id')->nullable();
            $table->timestamps();

            $table->foreign('class_assessment_id')->references('id')->on('class_assessments');
            $table->foreign('class_question_id')->references('id')->on('class_questions');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_assessment_questions');
    }
};
