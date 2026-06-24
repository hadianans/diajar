<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('rubric_criteria')) Schema::create('rubric_criteria', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('rubric_id')->nullable();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->integer('weight')->nullable();
            $table->timestamps();

            $table->foreign('rubric_id')->references('id')->on('rubrics');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rubric_criteria');
    }
};
