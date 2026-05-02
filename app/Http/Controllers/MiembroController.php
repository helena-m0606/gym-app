<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MiembroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $miembros = DB::table('miembros')->get();

        return response()->json($miembros);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Formulario no implementado']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
            $data = $request->only([
            'sucursal_id',
            'nombre',
            'email',
            'telefono',
            'fecha_nacimiento',
            'genero'
        ]);

        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table('miembros')->insert($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
            $data = $request->only([
            'sucursal_id',
            'nombre',
            'email',
            'telefono',
            'fecha_nacimiento',
            'genero'
        ]);

        $data['updated_at'] = now();

        DB::table('miembros')
            ->where('id', $id)
            ->update($data);

        return response()->json(['message' => 'Miembro actualizado']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        DB::table('miembros')->where('id', $id)->delete();

        return response()->json(['message' => 'Miembro eliminado']);
    }
}
