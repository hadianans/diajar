<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_questions')) Schema::create('class_questions', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->text('question')->nullable();
            $table->enum('levels', ['0', '1', '2', '3', '4', '5'])->nullable();
            $table->float('score')->default(1);
            $table->text('explanation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_questions');
    }
};
