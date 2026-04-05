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
        Schema::create('contacto_emergencia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miembro_id')
                ->constrained('miembros')
                ->onDelete('cascade');

            $table->string('nombre', 150);
            $table->string('telefono', 20);
            $table->string('relacion', 100);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacto_emergencia');
    }
};
