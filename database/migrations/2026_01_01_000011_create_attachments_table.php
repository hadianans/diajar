<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('attachments')) Schema::create('attachments', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('material_id')->nullable();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('file_url')->nullable();
            $table->timestamps();

            $table->foreign('material_id')->references('id')->on('materials');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
