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
        Schema::create('class_assignment_attachments', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('class_assignment_id');
            $table->string('title')->nullable();
            $table->string('file_url');
            $table->timestamps();

            $table->foreign('class_assignment_id')->references('id')->on('class_assignments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_assignment_attachments');
    }
};
