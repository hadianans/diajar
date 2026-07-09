<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

Schema::disableForeignKeyConstraints();

// Recreate planables
if (!Schema::hasTable('planables')) {
    Schema::create('planables', function (Blueprint $table) {
        $table->id();
        $table->integer('plan_id');
        $table->morphs('planable');
        $table->timestamps();
        $table->foreign('plan_id')->references('id')->on('plans')->cascadeOnDelete();
    });
}

// Recreate reflectables
if (!Schema::hasTable('reflectables')) {
    Schema::create('reflectables', function (Blueprint $table) {
        $table->id();
        $table->integer('reflection_id');
        $table->morphs('reflectable');
        $table->timestamps();
        $table->foreign('reflection_id')->references('id')->on('reflections')->cascadeOnDelete();
    });
}

// Remove new columns if they exist
$tables = ['plans', 'reflections'];
$cols = ['material_id', 'class_assignment_id', 'class_assessment_id'];
foreach ($tables as $t) {
    foreach ($cols as $c) {
        try { DB::statement("ALTER TABLE {$t} DROP FOREIGN KEY {$t}_{$c}_foreign"); } catch(\Exception $e) {}
        try { Schema::table($t, function (Blueprint $table) use ($c) { $table->dropColumn($c); }); } catch(\Exception $e) {}
    }
}

// Remove the migration record from migrations table if it exists
DB::table('migrations')->where('migration', 'like', '%refactor_plans_reflections_to_exclusive_arcs%')->delete();

Schema::enableForeignKeyConstraints();
echo "Database successfully restored to original state!\n";
