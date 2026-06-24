<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('questions')) Schema::create('questions', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('subject_id')->nullable();
            $table->text('question')->nullable();
            $table->enum('levels', ['0', '1', '2', '3', '4', '5'])->nullable();
            $table->text('explanation')->nullable();
            $table->float('score')->default(1);
            $table->timestamps();

            $table->foreign('subject_id')->references('id')->on('subjects');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
