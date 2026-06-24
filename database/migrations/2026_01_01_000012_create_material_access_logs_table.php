<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('material_access_logs')) Schema::create('material_access_logs', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('material_id')->nullable();
            $table->integer('student_id')->nullable();
            $table->timestamp('access_start')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('access_end')->default('0000-00-00 00:00:00');
            $table->integer('duration_seconds')->nullable();
            $table->longText('interaction_data')->nullable()->charset('utf8mb4');
            $table->timestamps();

            $table->foreign('material_id')->references('id')->on('materials');
            $table->foreign('student_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_access_logs');
    }
};
