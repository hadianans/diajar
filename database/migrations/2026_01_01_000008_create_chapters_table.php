<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('chapters')) Schema::create('chapters', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('subject_id');
            $table->integer('teacher_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order')->nullable();
            $table->timestamps();

            $table->foreign('subject_id')->references('id')->on('subjects');
            $table->foreign('teacher_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
