<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('taggables')) Schema::create('taggables', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('tag_id')->nullable();
            $table->integer('taggable_id')->nullable();
            $table->string('taggable_type')->nullable();
            $table->timestamps();

            $table->unique(['tag_id', 'taggable_id', 'taggable_type'], 'taggables_unique');
            $table->index(['taggable_type', 'taggable_id'], 'taggables_taggable_type_taggable_id_index');
            $table->foreign('tag_id', 'taggables_tag_id_foreign')
                  ->references('id')->on('tags')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taggables');
    }
};
