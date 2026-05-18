<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 🔄 Restaurando tus consultas originales en tiempo real
        $miembrosActivos = DB::table('miembros')
            ->where('estado', true)
            ->count();

        $checkinsHoy = DB::table('checkins')
            ->whereDate('fecha', today())
            ->count();

        $pagosPendientes = DB::table('membresias')
            ->where('activa', true)
            ->where('fecha_fin', '<', today())
            ->count();

        $clasesHoy = DB::table('clases')
            ->whereDate('fecha', today())
            ->get();

        $pagosRecientes = DB::table('pagos')
            ->join('membresias', 'pagos.membresia_id', '=', 'membresias.id')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->select('miembros.nombre', 'pagos.monto', 'pagos.estado')
            ->orderBy('pagos.fecha_pago', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'miembrosActivos' => $miembrosActivos,
            'checkinsHoy' => $checkinsHoy,
            'pagosPendientes' => $pagosPendientes,
            'clasesHoy' => $clasesHoy,
            'pagosRecientes' => $pagosRecientes,
        ]);
    }
}