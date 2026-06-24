<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('student_groups')) Schema::create('student_groups', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('student_id')->nullable();
            $table->integer('group_year_id')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'group_year_id'], 'student_groups_index');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('group_year_id')->references('id')->on('group_years');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_groups');
    }
};
