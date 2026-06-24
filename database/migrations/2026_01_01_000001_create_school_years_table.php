<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('school_years')) Schema::create('school_years', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->date('date_start');
            $table->date('date_end');
            $table->string('name', 20);
            $table->enum('status', ['active', 'archive']);
            $table->timestamps();
            // active_validator is a generated/stored column — handled at DB level
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_years');
    }
};
