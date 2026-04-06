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
        Schema::create('rutinas', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('miembro_id')
                ->constrained('miembros')
                ->onDelete('cascade');

            $table->foreignId('entrenador_id')
                ->constrained('empleados')
                ->onDelete('cascade');

            $table->string('nombre', 150);
            $table->date('fecha_inicio')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rutinas');
    }
};
