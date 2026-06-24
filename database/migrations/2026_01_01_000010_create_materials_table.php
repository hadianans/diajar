<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('materials')) Schema::create('materials', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('chapter_id');
            $table->integer('subchapter_id')->nullable();
            $table->string('title');
            $table->string('description')->nullable();
            $table->text('content')->nullable();
            $table->integer('order')->nullable();
            $table->enum('file_type', ['video', 'text']);
            $table->integer('duration_seconds')->nullable();
            $table->string('file_url')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();

            $table->foreign('chapter_id')->references('id')->on('chapters');
            $table->foreign('subchapter_id')->references('id')->on('subchapters');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
