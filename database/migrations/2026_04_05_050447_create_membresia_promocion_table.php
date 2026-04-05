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
        Schema::create('membresia_promocion', function (Blueprint $table) {
            $table->foreignId('membresia_id')
                ->constrained('membresias')
                ->onDelete('cascade');

            $table->foreignId('promocion_id')
                ->constrained('promociones')
                ->onDelete('cascade');

            $table->primary(['membresia_id', 'promocion_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membresia_promocion');
    }
};
