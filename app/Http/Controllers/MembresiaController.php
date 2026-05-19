<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MembresiaController extends Controller
{
    public function index()
    {
        $membresias = DB::table('membresias')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->select(
                'membresias.id',
                'miembros.nombre as miembro',
                'tipos_membresia.nombre as tipo',
                'tipos_membresia.precio',
                'membresias.fecha_inicio',
                'membresias.fecha_fin',
                'membresias.activa'
            )
            ->orderBy('membresias.fecha_fin', 'asc')
            ->get();

        $tiposMembresia = DB::table('tipos_membresia')->get();
        $miembros = DB::table('miembros')->where('estado', true)->get();

        return Inertia::render('membresias/index', [
            'membresias' => $membresias,
            'tiposMembresia' => $tiposMembresia,
            'miembros' => $miembros,
        ]);
    }

    // CRUD MEMBRESÍAS DE MIEMBROS
    public function store(Request $request)
    {
        $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'tipo_membresia_id' => 'required|exists:tipos_membresia,id',
            'fecha_inicio' => 'required|date',
        ]);

        $tipo = DB::table('tipos_membresia')->find($request->tipo_membresia_id);
        $fechaFin = date('Y-m-d', strtotime($request->fecha_inicio . ' + ' . $tipo->duracion_dias . ' days'));

        DB::table('membresias')->insert([
            'miembro_id' => $request->miembro_id,
            'tipo_membresia_id' => $request->tipo_membresia_id,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $fechaFin,
            'activa' => true,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'tipo_membresia_id' => 'required|exists:tipos_membresia,id',
            'fecha_inicio' => 'required|date',
        ]);

        $tipo = DB::table('tipos_membresia')->find($request->tipo_membresia_id);
        $fechaFin = date('Y-m-d', strtotime($request->fecha_inicio . ' + ' . $tipo->duracion_dias . ' days'));

        DB::table('membresias')->where('id', $id)->update([
            'tipo_membresia_id' => $request->tipo_membresia_id,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $fechaFin,
            'activa' => $request->activa ?? true,
        ]);

        return redirect()->back();
    }

    public function destroy(string $id)
    {
        DB::table('membresias')->where('id', $id)->delete();
        return redirect()->back();
    }

    // CRUD TIPOS DE MEMBRESÍA
    public function storeTipo(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'duracion_dias' => 'required|integer|min:1',
            'precio' => 'required|numeric|min:0',
        ]);

        DB::table('tipos_membresia')->insert([
            'nombre' => $request->nombre,
            'duracion_dias' => $request->duracion_dias,
            'precio' => $request->precio,
        ]);

        return redirect()->back();
    }

    public function updateTipo(Request $request, string $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'duracion_dias' => 'required|integer|min:1',
            'precio' => 'required|numeric|min:0',
        ]);

        DB::table('tipos_membresia')->where('id', $id)->update([
            'nombre' => $request->nombre,
            'duracion_dias' => $request->duracion_dias,
            'precio' => $request->precio,
        ]);

        return redirect()->back();
    }

    public function destroyTipo(string $id)
    {
        DB::table('tipos_membresia')->where('id', $id)->delete();
        return redirect()->back();
    }
}