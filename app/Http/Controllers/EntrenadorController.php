<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EntrenadorController extends Controller
{
    public function dashboard()
    {
        $totalClases = DB::table('clases')->count();

        $totalRutinas = DB::table('rutinas')->count();

        $totalMiembros = DB::table('miembros')
            ->where('estado', true)
            ->count();

        $proximasClases = DB::table('clases')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->select('clases.nombre', 'clases.fecha', 'clases.capacidad', 'sucursales.nombre as sucursal')
            ->orderBy('clases.fecha', 'asc')
            ->limit(5)
            ->get();

        $misRutinas = DB::table('rutinas')
            ->join('miembros', 'rutinas.miembro_id', '=', 'miembros.id')
            ->select('rutinas.nombre', 'miembros.nombre as miembro', 'rutinas.fecha_inicio')
            ->orderBy('rutinas.fecha_inicio', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('entrenador/dashboard', [
            'totalClases' => $totalClases,
            'totalRutinas' => $totalRutinas,
            'totalMiembros' => $totalMiembros,
            'proximasClases' => $proximasClases,
            'misRutinas' => $misRutinas,
        ]);
    }
}