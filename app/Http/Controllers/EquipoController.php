<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EquipoController extends Controller
{
    public function index()
    {
        return Inertia::render('Equipo/index', [
            'equipos' => DB::table('equipos')
                ->join('sucursales', 'equipos.sucursal_id', '=', 'sucursales.id')
                ->join('categorias_equipo', 'equipos.categoria_id', '=', 'categorias_equipo.id')
                ->select('equipos.*', 'sucursales.nombre as nombre_sucursal', 'categorias_equipo.nombre as nombre_categoria')
                ->orderBy('id', 'desc')->get(),
            'sucursales' => DB::table('sucursales')->get(),
            'categorias' => DB::table('categorias_equipo')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'sucursal_id' => 'required|exists:sucursales,id',
            'categoria_id' => 'required|exists:categorias_equipo,id',
            'estado' => 'required|in:activo,mantenimiento'
        ]);

        DB::table('equipos')->insert($validated);
        return redirect()->route('equipos.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'sucursal_id' => 'required|exists:sucursales,id',
            'categoria_id' => 'required|exists:categorias_equipo,id',
            'estado' => 'required|in:activo,mantenimiento'
        ]);

        DB::table('equipos')->where('id', $id)->update($validated);
        return redirect()->route('equipos.index');
    }

    public function destroy($id)
    {
        DB::table('equipos')->where('id', $id)->delete();
        return redirect()->route('equipos.index');
    }
}