<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GerenteController extends Controller
{
    public function dashboard()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $sucursalId = $empleado?->sucursal_id;

        $miembrosActivos = DB::table('miembros')
            ->where('sucursal_id', $sucursalId)
            ->where('estado', true)
            ->count();

        $checkinsHoy = DB::table('checkins')
            ->join('miembros', 'checkins.miembro_id', '=', 'miembros.id')
            ->where('miembros.sucursal_id', $sucursalId)
            ->whereDate('checkins.fecha', today())
            ->count();

        $membresiasPorVencer = DB::table('membresias')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->where('miembros.sucursal_id', $sucursalId)
            ->where('membresias.activa', true)
            ->whereBetween('membresias.fecha_fin', [today(), today()->addDays(7)])
            ->count();

        $empleados = DB::table('empleados')
            ->where('sucursal_id', $sucursalId)
            ->where('activo', true)
            ->count();

        $clasesHoy = DB::table('clases')
            ->where('sucursal_id', $sucursalId)
            ->whereDate('fecha', today())
            ->get();

        $pagosRecientes = DB::table('pagos')
            ->join('membresias', 'pagos.membresia_id', '=', 'membresias.id')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->select('miembros.nombre', 'pagos.monto', 'pagos.estado', 'pagos.fecha_pago')
            ->where('miembros.sucursal_id', $sucursalId)
            ->orderBy('pagos.fecha_pago', 'desc')
            ->limit(5)
            ->get();

        $sucursal = DB::table('sucursales')->find($sucursalId);

        return Inertia::render('gerente/dashboard', [
            'sucursal' => $sucursal,
            'miembrosActivos' => $miembrosActivos,
            'checkinsHoy' => $checkinsHoy,
            'membresiasPorVencer' => $membresiasPorVencer,
            'empleados' => $empleados,
            'clasesHoy' => $clasesHoy,
            'pagosRecientes' => $pagosRecientes,
        ]);
    }
}