<?php

namespace App\Http\Controllers;

use App\Models\Franquicia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FranquiciaController extends Controller
{
    public function index()
    {
        return Inertia::render('franquicias/index', [
            'franquicias' => Franquicia::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50',
            'razon_social' => 'required|string|max:50',
            'rfc' => 'required|string|max:12|unique:franquicias,rfc',
        ]);

        Franquicia::create($validated);

        return redirect()->route('franquicias.index');
    }
}