<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('material_completion')) Schema::create('material_completion', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('student_id');
            $table->integer('material_id');
            $table->tinyInteger('is_completed')->default(0);
            $table->timestamp('completed_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();

            $table->unique(['student_id', 'material_id'], 'material_completion_index');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('material_id')->references('id')->on('materials');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_completion');
    }
};
