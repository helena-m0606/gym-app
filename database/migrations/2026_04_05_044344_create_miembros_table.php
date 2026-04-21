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
        Schema::create('miembros', function (Blueprint $table) {
            $table->id();$table->foreignId('sucursal_id')
                ->constrained('sucursales')
                ->onDelete('cascade');

            $table->string('nombre', 150);
            $table->string('email', 150)->unique();
            $table->string('telefono', 20)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('genero', 20)->nullable();
            $table->boolean('estado')->default(true);
            $table->jsonb('datos_adicionales')->default('{}');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('miembros');
    }
};
