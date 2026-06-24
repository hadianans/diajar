<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('activity_logs')) Schema::create('activity_logs', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('actor_id');
            $table->string('action', 100);
            $table->string('target_type', 100)->nullable();
            $table->integer('target_id')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('actor_id', 'fk_activity_logs_actor')
                  ->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
