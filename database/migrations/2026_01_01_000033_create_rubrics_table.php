<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('rubrics')) Schema::create('rubrics', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('assignment_id')->nullable();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('assignment_id')->references('id')->on('assignments');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rubrics');
    }
};
