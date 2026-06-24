<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('assignments')) Schema::create('assignments', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('subject_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('grade')->nullable();
            $table->timestamps();

            $table->foreign('subject_id')->references('id')->on('subjects');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
