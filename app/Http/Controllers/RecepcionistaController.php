<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RecepcionistaController extends Controller
{
    public function dashboard()
    {
        // Obtener la sucursal del recepcionista
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $sucursalId = $empleado?->sucursal_id;

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

        $miembrosActivos = DB::table('miembros')
            ->where('sucursal_id', $sucursalId)
            ->where('estado', true)
            ->count();

        $ultimosCheckins = DB::table('checkins')
            ->join('miembros', 'checkins.miembro_id', '=', 'miembros.id')
            ->where('miembros.sucursal_id', $sucursalId)
            ->whereDate('checkins.fecha', today())
            ->select('miembros.nombre', 'checkins.fecha')
            ->orderBy('checkins.fecha', 'desc')
            ->limit(8)
            ->get();

        $membresiasVencer = DB::table('membresias')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->where('miembros.sucursal_id', $sucursalId)
            ->where('membresias.activa', true)
            ->whereBetween('membresias.fecha_fin', [today(), today()->addDays(7)])
            ->select('miembros.nombre', 'membresias.fecha_fin')
            ->orderBy('membresias.fecha_fin', 'asc')
            ->get();

        $sucursal = DB::table('sucursales')->find($sucursalId);

        return Inertia::render('Recepcionista/dashboard', [
            'sucursal' => $sucursal,
            'checkinsHoy' => $checkinsHoy,
            'membresiasPorVencer' => $membresiasPorVencer,
            'miembrosActivos' => $miembrosActivos,
            'ultimosCheckins' => $ultimosCheckins,
            'membresiasVencer' => $membresiasVencer,
        ]);
    }

    public function miembros()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $sucursalId = $empleado?->sucursal_id;

        $miembros = DB::table('miembros')
            ->where('sucursal_id', $sucursalId)
            ->join('sucursales', 'miembros.sucursal_id', '=', 'sucursales.id')
            ->select('miembros.*', 'sucursales.nombre as sucursal_nombre')
            ->get()
            ->map(function($m) {
                $m->sucursal = (object)['nombre' => $m->sucursal_nombre, 'id' => $m->sucursal_id];
                return $m;
            });

        $sucursales = DB::table('sucursales')->where('id', $sucursalId)->get();

        return Inertia::render('Recepcionista/miembros', [
            'miembros' => $miembros,
            'sucursales' => $sucursales,
        ]);
    }

    public function clases()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $sucursalId = $empleado?->sucursal_id;

        $clases = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->where('clases.sucursal_id', $sucursalId)
            ->select(
                'clases.*',
                'empleados.nombre as entrenador_nombre',
                'sucursales.nombre as sucursal_nombre'
            )
            ->get();

        $sucursales = DB::table('sucursales')->where('id', $sucursalId)->get();
        $entrenadores = DB::table('empleados')->where('sucursal_id', $sucursalId)->get();

        return Inertia::render('Recepcionista/clases', [
            'clases' => $clases,
            'sucursales' => $sucursales,
            'entrenadores' => $entrenadores,
        ]);
    }

    public function pagos()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $sucursalId = $empleado?->sucursal_id;

        $pagos = DB::table('pagos')
            ->join('membresias', 'pagos.membresia_id', '=', 'membresias.id')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->where('miembros.sucursal_id', $sucursalId)
            ->select(
                'pagos.id',
                'miembros.nombre as miembro',
                'tipos_membresia.nombre as tipo_membresia',
                'pagos.monto',
                'pagos.fecha_pago',
                'pagos.metodo_pago',
                'pagos.estado'
            )
            ->orderBy('pagos.fecha_pago', 'desc')
            ->get();

        $miembros = DB::table('miembros')
            ->where('sucursal_id', $sucursalId)
            ->where('estado', true)
            ->get();

        $tiposMembresia = DB::table('tipos_membresia')->get();
        $promociones = DB::table('promociones')->get();

        return Inertia::render('Recepcionista/pagos', [
            'pagos' => $pagos,
            'miembros' => $miembros,
            'tiposMembresia' => $tiposMembresia,
            'promociones' => $promociones,
        ]);
    }
}