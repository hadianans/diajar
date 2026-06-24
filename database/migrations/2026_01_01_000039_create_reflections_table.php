<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('reflections')) Schema::create('reflections', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('student_id');
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->integer('comprehension_level');
            $table->longText('emotions')->nullable()->charset('utf8mb4');
            $table->text('teacher_comment')->nullable();
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reflections');
    }
};
