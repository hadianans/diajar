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
        $tables = [
            'classes',
            'class_assessments',
            'class_assignments',
            'assignment_submissions'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                // Alter the column to remove the ON UPDATE CURRENT_TIMESTAMP
                DB::statement("ALTER TABLE `{$table}` MODIFY `deleted_at` TIMESTAMP NULL DEFAULT NULL");
                
                // Clear out incorrectly set deleted_at (which matched created_at or updated_at roughly)
                DB::statement("UPDATE `{$table}` SET `deleted_at` = NULL");
            }
        }
    }

    public function down(): void
    {
        // Reverting this would mean putting back the bug, so we leave it empty.
    }
};
