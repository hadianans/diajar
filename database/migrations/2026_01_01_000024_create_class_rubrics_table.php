<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_rubrics')) Schema::create('class_rubrics', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_assignment_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('class_assignment_id')->references('id')->on('class_assignments');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_rubrics');
    }
};
