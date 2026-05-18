<?php

namespace App\Http\Controllers;
use App\Models\Miembro;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MiembroController extends Controller
{
    public function index()
    {
        return Inertia::render('Miembros/Index', [

            'miembros' => Miembro::with('sucursal')
                ->latest()
                ->get(),

            'sucursales' => Sucursal::select('id', 'nombre')
                ->orderBy('nombre')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sucursal_id' => 'required|exists:sucursales,id',
            'nombre' => 'required|string|max:50',
            'email' => 'required|email|max:50|unique:miembros,email',
            'telefono' => 'nullable|string|max:10',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'nullable|string|max:9',
        ]);

        Miembro::create([
            'sucursal_id' => $validated['sucursal_id'],
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'] ?? null,
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'genero' => $validated['genero'] ?? null,
            'estado' => true,
        ]);

        return redirect()->route('miembros.index');
    }

    public function update(Request $request, Miembro $miembro)
    {
        $validated = $request->validate([
            'sucursal_id'      => 'required|exists:sucursales,id',
            'nombre'           => 'required|string|max:50',
            'email'            => 'required|email|max:50|unique:miembros,email,' . $miembro->id,
            'telefono'         => 'nullable|string|max:10',
            'fecha_nacimiento' => 'nullable|date',
            'genero'           => 'nullable|string|max:9',
            'estado'           => 'boolean',
        ]);

        $miembro->update($validated);

        return redirect()->route('miembros.index');
    }

    public function destroy(Miembro $miembro)
    {
        $miembro->delete();

        return redirect()->route('miembros.index');
    }
}

