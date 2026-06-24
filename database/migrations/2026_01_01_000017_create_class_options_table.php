<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_options')) Schema::create('class_options', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_question_id')->nullable();
            $table->string('option')->nullable();
            $table->tinyInteger('is_correct')->nullable();
            $table->timestamps();

            $table->foreign('class_question_id')->references('id')->on('class_questions');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_options');
    }
};
