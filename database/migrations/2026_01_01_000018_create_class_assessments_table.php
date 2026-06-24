<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('class_assessments')) Schema::create('class_assessments', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_id');
            $table->integer('chapter_id');
            $table->integer('material_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->integer('duration');
            $table->integer('max_attempts')->default(1);
            $table->float('pass_threshold')->default(70);
            $table->timestamp('deleted_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();

            $table->foreign('class_id')->references('id')->on('classes');
            $table->foreign('chapter_id')->references('id')->on('chapters');
            $table->foreign('material_id')->references('id')->on('materials');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_assessments');
    }
};
