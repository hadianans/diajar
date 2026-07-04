<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing data to pivot table
        DB::table('classes')->whereNotNull('group_years_id')->orderBy('id')->chunk(100, function ($classes) {
            $inserts = [];
            foreach ($classes as $class) {
                $inserts[] = [
                    'class_id' => $class->id,
                    'group_year_id' => $class->group_years_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('class_group_years')->insertOrIgnore($inserts);
        });

        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign('classes_ibfk_3');
            $table->dropColumn('group_years_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->integer('group_years_id')->nullable();
            $table->foreign('group_years_id')->references('id')->on('group_years')->nullOnDelete();
        });

        // Migrate back from pivot table (take the first group_year_id)
        DB::table('class_group_years')->orderBy('id')->chunk(100, function ($pivots) {
            foreach ($pivots as $pivot) {
                DB::table('classes')->where('id', $pivot->class_id)->update([
                    'group_years_id' => $pivot->group_year_id
                ]);
            }
        });
    }
};
