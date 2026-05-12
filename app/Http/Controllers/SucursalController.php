<?php

namespace App\Http\Controllers;

use App\Models\Franquicia;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SucursalController extends Controller
{
    public function index()
    {
        return Inertia::render('sucursales/index', [
            'sucursales' => Sucursal::with('franquicia')->latest()->get(),

            'franquicias' => Franquicia::select('id', 'nombre')
                ->orderBy('nombre')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'franquicia_id' => 'required|exists:franquicias,id',
            'nombre' => 'required|string|max:50',
            'direccion' => 'required|string|max:100',
            'ciudad' => 'required|string|max:50',
            'telefono' => 'nullable|string|max:10',
        ]);

        Sucursal::create([
            'franquicia_id' => $validated['franquicia_id'],
            'nombre' => $validated['nombre'],
            'direccion' => $validated['direccion'],
            'ciudad' => $validated['ciudad'],
            'telefono' => $validated['telefono'] ?? null,
            'activa' => true,
        ]);

        return redirect()->route('sucursales.index');
    }
}