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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('gender')->after('role')->nullable()->comment('0 = female, 1 = male');
            if (Schema::hasColumn('users', 'remember_token')) {
                $table->boolean('is_active')->after('remember_token')->default(1)->index();
            } else {
                $table->boolean('is_active')->after('gender')->default(1)->index();
            }
            $table->timestamp('active_at')->after('is_active')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['gender', 'is_active', 'active_at']);
        });
    }
};
