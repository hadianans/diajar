<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('rubric_levels')) Schema::create('rubric_levels', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('criterion_id')->nullable();
            $table->string('label')->nullable();
            $table->integer('score')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('criterion_id')->references('id')->on('rubric_criteria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rubric_levels');
    }
};
