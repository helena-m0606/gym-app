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
        Schema::create('rutina_ejercicio', function (Blueprint $table) {
            $table->foreignId('rutina_id')
                ->constrained('rutinas')
                ->onDelete('cascade');

            $table->foreignId('ejercicio_id')
                ->constrained('ejercicios')
                ->onDelete('cascade');

            $table->integer('series');
            $table->integer('repeticiones');
            $table->integer('descanso_segundos')->default(60);

            $table->primary(['rutina_id', 'ejercicio_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rutina_ejercicio');
    }
};
