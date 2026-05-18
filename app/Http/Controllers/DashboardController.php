<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Aquí mantienes tus consultas de estadísticas actuales
        // Ejemplo (ajústalo según tus variables reales):
        return Inertia::render('dashboard', [
            'miembrosActivos' => 0, // Tus consultas reales aquí...
            'checkinsHoy' => 0,
            'pagosPendientes' => 0,
            'clasesHoy' => [],
            'pagosRecientes' => [],
        ]);
    }
}