<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RecepcionistaController extends Controller
{
    public function dashboard()
    {
        $checkinshoy = DB::table('checkins')
            ->whereDate('fecha', today())
            ->count();

        $membresiasPorvencer = DB::table('membresias')
            ->where('activa', true)
            ->whereBetween('fecha_fin', [today(), today()->addDays(7)])
            ->count();

        $nuevosEsteMes = DB::table('miembros')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $ultimosCheckins = DB::table('checkins')
            ->join('miembros', 'checkins.miembro_id', '=', 'miembros.id')
            ->select('miembros.nombre', 'checkins.fecha')
            ->orderBy('checkins.fecha', 'desc')
            ->limit(5)
            ->get();

        $membresiasVencer = DB::table('membresias')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->select('miembros.nombre', 'membresias.fecha_fin', 'membresias.activa')
            ->where('membresias.activa', true)
            ->orderBy('membresias.fecha_fin', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('recepcionista/dashboard', [
            'checkinsHoy' => $checkinshoy,
            'membresiasPorVencer' => $membresiasPorvencer,
            'nuevosEsteMes' => $nuevosEsteMes,
            'ultimosCheckins' => $ultimosCheckins,
            'membresiasVencer' => $membresiasVencer,
        ]);
    }
}