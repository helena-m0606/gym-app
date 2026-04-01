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
        Schema::create('franquicias', function (Blueprint $table) {
            $table->id();
            
            $table->string('nombre', 150);
            $table->string('razon_social', 150);
            $table->string('rfc', 20)->unique();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('franquicias');
    }
};
