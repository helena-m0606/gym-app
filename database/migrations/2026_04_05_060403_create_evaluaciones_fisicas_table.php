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
        Schema::create('evaluaciones_fisicas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('miembro_id')
                ->constrained('miembros')
                ->onDelete('cascade');

            $table->date('fecha')->useCurrent();
            $table->jsonb('resultados')->default('{}');
            $table->text('observaciones')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluaciones_fisicas');
    }
};
