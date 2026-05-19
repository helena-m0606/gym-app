<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RutinaController extends Controller
{
    public function index()
    {
        $rutinasBase = DB::table('rutinas')
            ->leftJoin('empleados', 'rutinas.entrenador_id', '=', 'empleados.id')
            ->select('rutinas.id', 'rutinas.nombre', 'rutinas.entrenador_id', 'empleados.nombre as entrenador_nombre')
            ->orderBy('rutinas.id', 'desc')
            ->get();

        $ejerciciosMapeados = DB::table('rutina_ejercicio')
            ->join('ejercicios', 'rutina_ejercicio.ejercicio_id', '=', 'ejercicios.id')
            ->select(
                'rutina_ejercicio.rutina_id',
                'ejercicios.id',
                'ejercicios.nombre',
                'rutina_ejercicio.series',
                'rutina_ejercicio.repeticiones'
            )
            ->get()
            ->groupBy('rutina_id');

        $rutinasFinales = $rutinasBase->map(function ($rutina) use ($ejerciciosMapeados) {
            $ejercicios = collect($ejerciciosMapeados->get($rutina->id) ?? [])->map(function ($ej) {
                return [
                    'id' => $ej->id,
                    'nombre' => $ej->nombre,
                    'pivot' => [
                        'series' => $ej->series,
                        'repeticiones' => $ej->repeticiones,
                    ]
                ];
            });

            return [
                'id' => $rutina->id,
                'nombre' => $rutina->nombre,
                'entrenador_id' => $rutina->entrenador_id,
                'entrenador_nombre' => $rutina->entrenador_nombre ?? 'Sin entrenador',
                'ejercicios' => $ejercicios
            ];
        });

        return Inertia::render('Rutina/Index', [
            'rutinas' => $rutinasFinales,
            'catalogoEjercicios' => DB::table('ejercicios')->select('id', 'nombre')->orderBy('nombre')->get(),
            'entrenadores' => DB::table('empleados')->select('id', 'nombre')->orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entrenador_id' => 'required|exists:empleados,id',
            'ejercicios' => 'required|array|min:1',
            'ejercicios.*.ejercicio_id' => 'required|exists:ejercicios,id',
            'ejercicios.*.series' => 'required|integer|min:1',
            'ejercicios.*.repeticiones' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $miembroId = DB::table('miembros')->value('id') ?? 1;

            $rutinaId = DB::table('rutinas')->insertGetId([
                'nombre' => $request->nombre,
                'entrenador_id' => $request->entrenador_id,
                'miembro_id' => $miembroId,
            ]);

            $pivoteData = [];
            foreach ($request->ejercicios as $ej) {
                $pivoteData[] = [
                    'rutina_id' => $rutinaId,
                    'ejercicio_id' => $ej['ejercicio_id'],
                    'series' => $ej['series'],
                    'repeticiones' => $ej['repeticiones'],
                ];
            }

            DB::table('rutina_ejercicio')->insert($pivoteData);
        });

        return redirect()->route('rutinas.index');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entrenador_id' => 'required|exists:empleados,id',
            'ejercicios' => 'required|array|min:1',
            'ejercicios.*.ejercicio_id' => 'required|exists:ejercicios,id',
            'ejercicios.*.series' => 'required|integer|min:1',
            'ejercicios.*.repeticiones' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $id) {
            DB::table('rutinas')->where('id', $id)->update([
                'nombre' => $request->nombre,
                'entrenador_id' => $request->entrenador_id,
            ]);

            DB::table('rutina_ejercicio')->where('rutina_id', $id)->delete();

            $pivoteData = [];
            foreach ($request->ejercicios as $ej) {
                $pivoteData[] = [
                    'rutina_id' => $id,
                    'ejercicio_id' => $ej['ejercicio_id'],
                    'series' => $ej['series'],
                    'repeticiones' => $ej['repeticiones'],
                ];
            }

            DB::table('rutina_ejercicio')->insert($pivoteData);
        });

        return redirect()->route('rutinas.index');
    }

    public function destroy($id)
    {
        DB::table('rutina_ejercicio')->where('rutina_id', $id)->delete();
        DB::table('rutinas')->where('id', $id)->delete();

        return redirect()->route('rutinas.index');
    }
}