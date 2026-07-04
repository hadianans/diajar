<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('class_group_years', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_id');
            $table->integer('group_year_id');
            $table->timestamps();
            
            $table->foreign('class_id')->references('id')->on('classes')->cascadeOnDelete();
            $table->foreign('group_year_id')->references('id')->on('group_years')->cascadeOnDelete();

            // Ensure unique combination
            $table->unique(['class_id', 'group_year_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_group_years');
    }
};
