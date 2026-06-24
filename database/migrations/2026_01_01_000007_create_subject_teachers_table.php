<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('subject_teachers')) Schema::create('subject_teachers', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('teacher_id')->nullable();
            $table->integer('subject_id')->nullable();
            $table->timestamps();

            $table->unique(['subject_id', 'teacher_id'], 'subject_teachers_index');
            $table->foreign('teacher_id')->references('id')->on('users');
            $table->foreign('subject_id')->references('id')->on('subjects');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_teachers');
    }
};
