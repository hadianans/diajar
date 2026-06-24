<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('reflectables')) Schema::create('reflectables', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('reflection_id')->nullable();
            $table->integer('reflectable_id')->nullable();
            $table->string('reflectable_type')->nullable();
            $table->timestamps();

            $table->unique(['reflection_id', 'reflectable_id', 'reflectable_type'], 'reflectables_unique');
            $table->index(['reflectable_type', 'reflectable_id'], 'reflectables_reflectable_type_reflectable_id_index');
            $table->foreign('reflection_id', 'reflectables_reflection_id_foreign')
                  ->references('id')->on('reflections')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reflectables');
    }
};
