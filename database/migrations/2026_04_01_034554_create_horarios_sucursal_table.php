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
        Schema::create('horarios_sucursal', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sucursal_id')
                ->constrained('sucursales')
                ->onDelete('cascade');

            $table->string('dia_semana', 20);
            $table->time('hora_apertura');
            $table->time('hora_cierre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarios_sucursal');
    }
};
