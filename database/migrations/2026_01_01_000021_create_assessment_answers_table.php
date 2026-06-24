<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('assessment_answers')) Schema::create('assessment_answers', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('attempt_id');
            $table->integer('question_id');
            $table->integer('selected_option_id')->nullable();
            $table->tinyInteger('is_correct')->nullable();
            $table->tinyInteger('marked_for_review')->default(0);
            $table->timestamps();

            $table->foreign('attempt_id')->references('id')->on('assessment_attempts');
            $table->foreign('question_id')->references('id')->on('class_questions');
            $table->foreign('selected_option_id', 'fk_assessment_answers_selected_option')
                  ->references('id')->on('class_options');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_answers');
    }
};
