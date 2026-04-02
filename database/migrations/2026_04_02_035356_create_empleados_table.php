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
        Schema::create('empleados', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sucursal_id')
              ->constrained('sucursales')
              ->onDelete('cascade');

            $table->string('nombre', 150);
            $table->string('email', 150)->unique();
            $table->string('telefono', 20)->nullable();
            $table->decimal('salario', 10, 2);
            $table->boolean('activo')->default(true);
            $table->json('metadata')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
