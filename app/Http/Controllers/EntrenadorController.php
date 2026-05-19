<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class EntrenadorController extends Controller
{
    public function dashboard()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $empleadoId = $empleado?->id;

        $totalClases = DB::table('clases')
            ->where('entrenador_id', $empleadoId)
            ->count();

        $totalRutinas = DB::table('rutinas')
            ->where('entrenador_id', $empleadoId)
            ->count();

        $totalMiembros = DB::table('rutinas')
            ->where('entrenador_id', $empleadoId)
            ->distinct('miembro_id')
            ->count('miembro_id');

        $proximasClases = DB::table('clases')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->where('clases.entrenador_id', $empleadoId)
            ->select(
                'clases.nombre',
                'clases.fecha as horario',
                'clases.capacidad as cupo_maximo',
                'sucursales.nombre as sucursal'
            )
            ->orderBy('clases.nombre', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('Entrenador/dashboard', [
            'totalClases' => $totalClases,
            'totalRutinas' => $totalRutinas,
            'totalMiembros' => $totalMiembros,
            'proximasClases' => $proximasClases,
        ]);
    }

    public function clases()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $empleadoId = $empleado?->id;
        $sucursalId = $empleado?->sucursal_id;

        $clases = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->where('clases.entrenador_id', $empleadoId)
            ->select(
                'clases.id',
                'clases.nombre',
                'clases.fecha as horario',
                'clases.capacidad as cupo_maximo',
                'clases.entrenador_id',
                'clases.sucursal_id',
                'empleados.nombre as entrenador_nombre',
                'sucursales.nombre as sucursal_nombre'
            )
            ->get();

        $sucursales = DB::table('sucursales')->where('id', $sucursalId)->get();
        $entrenadores = DB::table('empleados')->where('id', $empleadoId)->get();

        return Inertia::render('Entrenador/clases', [
            'clases' => $clases,
            'sucursales' => $sucursales,
            'entrenadores' => $entrenadores,
        ]);
    }

    public function rutinas()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $empleadoId = $empleado?->id;

        $rutinas = DB::table('rutinas')
            ->join('empleados', 'rutinas.entrenador_id', '=', 'empleados.id')
            ->where('rutinas.entrenador_id', $empleadoId)
            ->select('rutinas.*', 'empleados.nombre as entrenador_nombre')
            ->get()
            ->map(function($rutina) {
                $ejercicios = DB::table('rutina_ejercicio')
                    ->join('ejercicios', 'rutina_ejercicio.ejercicio_id', '=', 'ejercicios.id')
                    ->where('rutina_ejercicio.rutina_id', $rutina->id)
                    ->select(
                        'ejercicios.id',
                        'ejercicios.nombre',
                        'rutina_ejercicio.series as pivot_series',
                        'rutina_ejercicio.repeticiones as pivot_repeticiones'
                    )
                    ->get()
                    ->map(function($ej) {
                        $ej->pivot = (object)[
                            'series' => $ej->pivot_series,
                            'repeticiones' => $ej->pivot_repeticiones,
                        ];
                        return $ej;
                    });
                $rutina->ejercicios = $ejercicios;
                return $rutina;
            });

        $catalogoEjercicios = DB::table('ejercicios')->get();
        $entrenadores = DB::table('empleados')->where('id', $empleadoId)->get();

        return Inertia::render('Entrenador/rutinas', [
            'rutinas' => $rutinas,
            'catalogoEjercicios' => $catalogoEjercicios,
            'entrenadores' => $entrenadores,
        ]);
    }

    public function miembros()
    {
        $empleado = DB::table('empleados')
            ->where('user_id', auth()->id())
            ->first();

        $empleadoId = $empleado?->id;
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

        return Inertia::render('Entrenador/miembros', [
            'miembros' => $miembros,
            'sucursales' => $sucursales,
        ]);
    }
}