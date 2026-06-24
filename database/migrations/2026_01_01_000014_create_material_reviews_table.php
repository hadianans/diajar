<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('material_reviews')) Schema::create('material_reviews', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('material_id');
            $table->integer('student_id');
            $table->integer('score');
            $table->timestamps();

            $table->unique(['student_id', 'material_id'], 'material_reviews_index');
            $table->foreign('material_id')->references('id')->on('materials');
            $table->foreign('student_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_reviews');
    }
};
