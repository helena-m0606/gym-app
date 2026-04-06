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
        Schema::create('equipos', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('sucursal_id')
                ->constrained('sucursales')
                ->onDelete('cascade');

            $table->foreignId('categoria_id')
                ->constrained('categorias_equipo')
                ->onDelete('cascade');

            $table->string('nombre', 150);
            $table->string('estado', 50)->default('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};
