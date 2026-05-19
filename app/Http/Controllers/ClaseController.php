<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClaseController extends Controller
{
    /**
     * Mostrar la lista de clases configuradas y catálogos de apoyo.
     */
    public function index()
    {
        // Cruzamos clases con empleados y sucursales usando los nombres reales de tus columnas
        $clases = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->select(
                'clases.id',
                'clases.nombre',
                'clases.fecha as horario',          // Traduce "fecha" a "horario" para React
                'clases.capacidad as cupo_maximo',  // Traduce "capacidad" a "cupo_maximo" para React
                'clases.entrenador_id',
                'clases.sucursal_id',
                'empleados.nombre as entrenador_nombre',
                'sucursales.nombre as sucursal_nombre'
            )
            ->orderBy('clases.nombre', 'asc')
            ->get();

        // Instructores disponibles (Se añade empleados.sucursal_id para que React pueda filtrar en cascada)
        $entrenadores = DB::table('empleados')
            ->join('users', 'empleados.user_id', '=', 'users.id')
            ->where('users.rol', '=', 'entrenador')
            ->select('empleados.id', 'empleados.nombre', 'empleados.sucursal_id')
            ->orderBy('empleados.nombre', 'asc')
            ->get();

        // Sucursales activas
        $sucursales = DB::table('sucursales')
            ->select('id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get();

        return Inertia::render('clase/index', [
            'clases' => $clases,
            'entrenadores' => $entrenadores,
            'sucursales' => $sucursales,
        ]);
    }

    /**
     * Registrar una nueva clase.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entrenador_id' => 'required|exists:empleados,id',
            'sucursal_id' => 'required|exists:sucursales,id',
            'horario' => 'required|string|max:150',
            'cupo_maximo' => 'required|integer|min:1',
        ]);

        // 🎯 CORREGIDO: Eliminadas las columnas created_at y updated_at
        DB::table('clases')->insert([
            'nombre' => $request->nombre,
            'entrenador_id' => $request->entrenador_id,
            'sucursal_id' => $request->sucursal_id,
            'fecha' => $request->horario,          
            'capacidad' => $request->cupo_maximo,  
        ]);

        return redirect()->back();
    }

    /**
     * Actualizar una clase existente.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entrenador_id' => 'required|exists:empleados,id',
            'sucursal_id' => 'required|exists:sucursales,id',
            'horario' => 'required|string|max:150',
            'cupo_maximo' => 'required|integer|min:1',
        ]);

        // 🎯 CORREGIDO: Eliminada la columna updated_at
        DB::table('clases')
            ->where('id', $id)
            ->update([
                'nombre' => $request->nombre,
                'entrenador_id' => $request->entrenador_id,
                'sucursal_id' => $request->sucursal_id,
                'fecha' => $request->horario,          
                'capacidad' => $request->cupo_maximo,  
            ]);

        return redirect()->back();
    }

    /**
     * Eliminar una clase de la agenda.
     */
    public function destroy($id)
    {
        DB::table('clases')->where('id', $id)->delete();

        return redirect()->back();
    }
}