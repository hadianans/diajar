<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('plans')) Schema::create('plans', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('student_id');
            $table->integer('class_id')->nullable();
            $table->integer('chapter_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('target_date')->useCurrent()->useCurrentOnUpdate();
            $table->float('progress')->nullable();
            $table->timestamp('completed_at')->default('0000-00-00 00:00:00');
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('class_id')->references('id')->on('classes');
            $table->foreign('chapter_id')->references('id')->on('chapters');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
