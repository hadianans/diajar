<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('planables')) Schema::create('planables', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('plan_id')->nullable();
            $table->integer('planable_id')->nullable();
            $table->string('planable_type')->nullable();
            $table->timestamps();

            $table->unique(['plan_id', 'planable_id', 'planable_type'], 'planables_unique');
            $table->index(['planable_type', 'planable_id'], 'planables_planable_type_planable_id_index');
            $table->foreign('plan_id', 'planables_plan_id_foreign')
                  ->references('id')->on('plans')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planables');
    }
};
