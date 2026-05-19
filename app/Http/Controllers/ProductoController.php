<?php
namespace App\Http\Controllers;
use App\Models\Producto;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index()
    {
        return Inertia::render('productos/index', [
            'productos' => Producto::with('sucursal')->orderBy('id', 'desc')->get(),
            'sucursales' => Sucursal::select('id', 'nombre')->orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sucursal_id' => 'required|exists:sucursales,id',
            'nombre'      => 'required|string|max:150',
            'precio'      => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'categoria'   => 'required|string|max:50',
            'descripcion' => 'nullable|string',
        ]);

        Producto::create($validated);

        return redirect()->route('productos.index');
    }

    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'sucursal_id' => 'required|exists:sucursales,id',
            'nombre'      => 'required|string|max:150',
            'precio'      => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'categoria'   => 'required|string|max:50',
            'descripcion' => 'nullable|string'
        ]);

        $producto->update($validated);

        return redirect()->route('productos.index');
    }

    public function destroy(Producto $producto)
    {
        $producto->delete();

        return redirect()->route('productos.index');
    }
}