<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('subchapters')) Schema::create('subchapters', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('chapter_id')->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('order')->nullable();
            $table->timestamps();

            $table->foreign('chapter_id')->references('id')->on('chapters');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subchapters');
    }
};
