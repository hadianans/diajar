<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_rubric_criteria')) Schema::create('class_rubric_criteria', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_rubric_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('weight')->nullable();
            $table->timestamps();

            $table->foreign('class_rubric_id')->references('id')->on('class_rubrics');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_rubric_criteria');
    }
};
