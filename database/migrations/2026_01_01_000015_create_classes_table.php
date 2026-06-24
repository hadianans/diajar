<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('classes')) Schema::create('classes', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('subject_id');
            $table->integer('teacher_id');
            $table->integer('group_years_id');
            $table->integer('day_schedule')->nullable();
            $table->time('time_schedule')->nullable();
            $table->float('assignment_weight')->default(50);
            $table->float('assessment_weight')->default(50);
            $table->timestamp('deleted_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();

            $table->foreign('subject_id')->references('id')->on('subjects');
            $table->foreign('teacher_id')->references('id')->on('users');
            $table->foreign('group_years_id')->references('id')->on('group_years');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
