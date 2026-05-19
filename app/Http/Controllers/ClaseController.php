<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClaseController extends Controller
{
    public function index()
    {
        $clases = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
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
            ->orderBy('clases.nombre', 'asc')
            ->get();

        $entrenadores = DB::table('empleados')
            ->join('users', 'empleados.user_id', '=', 'users.id')
            ->where('users.rol', '=', 'entrenador')
            ->select('empleados.id', 'empleados.nombre', 'empleados.sucursal_id')
            ->orderBy('empleados.nombre', 'asc')
            ->get();

        $sucursales = DB::table('sucursales')
            ->select('id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get();

        return Inertia::render('Clase/index', [
            'clases' => $clases,
            'entrenadores' => $entrenadores,
            'sucursales' => $sucursales,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entrenador_id' => 'required|exists:empleados,id',
            'sucursal_id' => 'required|exists:sucursales,id',
            'horario' => 'required|string|max:150',
            'cupo_maximo' => 'required|integer|min:1',
        ]);

        DB::table('clases')->insert([
            'nombre' => $request->nombre,
            'entrenador_id' => $request->entrenador_id,
            'sucursal_id' => $request->sucursal_id,
            'fecha' => $request->horario,          
            'capacidad' => $request->cupo_maximo,  
        ]);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entrenador_id' => 'required|exists:empleados,id',
            'sucursal_id' => 'required|exists:sucursales,id',
            'horario' => 'required|string|max:150',
            'cupo_maximo' => 'required|integer|min:1',
        ]);

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

    public function destroy($id)
    {
        DB::table('clases')->where('id', $id)->delete();

        return redirect()->back();
    }
}