<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('group_years')) Schema::create('group_years', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('group_id')->nullable();
            $table->integer('year_id')->nullable();
            $table->integer('grade');
            $table->timestamps();

            $table->foreign('group_id')->references('id')->on('groups');
            $table->foreign('year_id')->references('id')->on('school_years');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_years');
    }
};
