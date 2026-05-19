<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MiembroPerfilController extends Controller
{
    public function dashboard()
    {
        $miembro = DB::table('miembros')->first();

        $checkinsMes = DB::table('checkins')
            ->where('miembro_id', $miembro->id)
            ->whereMonth('fecha', now()->month)
            ->count();

        $membresia = DB::table('membresias')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->select('membresias.*', 'tipos_membresia.nombre as tipo')
            ->where('membresias.miembro_id', $miembro->id)
            ->where('membresias.activa', true)
            ->first();

        $clasesReservadas = DB::table('reservas_clase')
            ->join('clases', 'reservas_clase.clase_id', '=', 'clases.id')
            ->select('clases.nombre', 'clases.fecha', 'reservas_clase.estado')
            ->where('reservas_clase.miembro_id', $miembro->id)
            ->orderBy('clases.fecha', 'asc')
            ->limit(5)
            ->get();

        $rutina = DB::table('rutinas')
            ->join('rutina_ejercicio', 'rutinas.id', '=', 'rutina_ejercicio.rutina_id')
            ->join('ejercicios', 'rutina_ejercicio.ejercicio_id', '=', 'ejercicios.id')
            ->select('ejercicios.nombre', 'rutina_ejercicio.series', 'rutina_ejercicio.repeticiones')
            ->where('rutinas.miembro_id', $miembro->id)
            ->limit(5)
            ->get();

        $progreso = DB::table('progreso_miembro')
            ->where('miembro_id', $miembro->id)
            ->orderBy('fecha', 'desc')
            ->limit(2)
            ->get();

        return Inertia::render('Miembro-Perfil/dashboard', [
            'miembro' => $miembro,
            'checkinsMes' => $checkinsMes,
            'membresia' => $membresia,
            'clasesReservadas' => $clasesReservadas,
            'rutina' => $rutina,
            'progreso' => $progreso,
        ]);
    }
}