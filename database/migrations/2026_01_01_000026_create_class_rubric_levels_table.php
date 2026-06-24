<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_rubric_levels')) Schema::create('class_rubric_levels', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_criterion_id')->nullable();
            $table->string('label')->nullable();
            $table->integer('score')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('class_criterion_id')->references('id')->on('class_rubric_criteria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_rubric_levels');
    }
};
