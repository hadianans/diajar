<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('bookmarks')) Schema::create('bookmarks', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('student_id');
            $table->integer('bookmarkable_id');
            $table->string('bookmarkable_type');
            $table->timestamps();

            $table->unique(['student_id', 'bookmarkable_id', 'bookmarkable_type'], 'student_bookmark_unique');
            $table->index('student_id', 'bookmarks_student_index');
            $table->index(['bookmarkable_type', 'bookmarkable_id'], 'bookmarks_bookmarkable_index');
            $table->foreign('student_id', 'bookmarks_student_id_foreign')
                  ->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
