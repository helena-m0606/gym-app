<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('franquicias')->insert([
            'nombre' => 'Gym Platinum Training Center',
            'razon_social' => 'Gym Platinum Training Center SA de CV',
            'rfc' => 'GPTC123456ABC',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}