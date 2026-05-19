<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index()
    {
        return Inertia::render('Producto/index', [
            // Traemos solo lo que existe en la tabla
            'productos' => DB::table('productos')->orderBy('id', 'desc')->get(),
            'sucursales' => DB::table('sucursales')->select('id', 'nombre')->orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'precio' => 'required|numeric|min:0',
            'stock'  => 'required|integer|min:0',
        ]);

        // Insert explícito: SIN created_at ni updated_at
        DB::table('productos')->insert([
            'nombre' => $request->nombre,
            'precio' => $request->precio,
            'stock'  => $request->stock,
        ]);

        return redirect()->route('productos.index');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'precio' => 'required|numeric|min:0',
            'stock'  => 'required|integer|min:0',
        ]);

        // Update explícito
        DB::table('productos')->where('id', $id)->update([
            'nombre' => $request->nombre,
            'precio' => $request->precio,
            'stock'  => $request->stock,
        ]);

        return redirect()->route('productos.index');
    }

    public function destroy($id)
    {
        DB::table('productos')->where('id', $id)->delete();
        return redirect()->route('productos.index');
    }
}