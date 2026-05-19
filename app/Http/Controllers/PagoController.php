<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function index()
    {
        $pagos = DB::table('pagos')
            ->join('membresias', 'pagos.membresia_id', '=', 'membresias.id')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->select(
                'pagos.id',
                'miembros.nombre as miembro',
                'tipos_membresia.nombre as tipo_membresia',
                'pagos.monto',
                'pagos.fecha_pago',
                'pagos.metodo_pago',
                'pagos.estado'
            )
            ->orderBy('pagos.fecha_pago', 'desc')
            ->get();

        $miembros = DB::table('miembros')->select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        $tiposMembresia = DB::table('tipos_membresia')->select('id', 'nombre', 'precio', 'duracion_dias')->get();
        
        $hoy = date('Y-m-d');
        $promociones = DB::table('promociones')
            ->select('id', 'nombre', 'descuento_porcentaje')
            ->where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->get();

        return Inertia::render('Pago/index', [
            'pagos' => $pagos,
            'miembros' => $miembros,
            'tiposMembresia' => $tiposMembresia,
            'promociones' => $promociones,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'tipo_membresia_id' => 'required|exists:tipos_membresia,id',
            'promocion_id' => 'nullable|exists:promociones,id',
            'monto' => 'required|numeric|min:0',
            'fecha_pago' => 'required|date',
            'metodo_pago' => 'required|in:efectivo,tarjeta,transferencia',
        ]);

        $tipo = DB::table('tipos_membresia')->where('id', $request->tipo_membresia_id)->first();
        $fechaInicio = $request->fecha_pago;
        $fechaFin = date('Y-m-d', strtotime($fechaInicio . ' + ' . $tipo->duracion_dias . ' days'));

        DB::transaction(function () use ($request, $fechaInicio, $fechaFin) {
            $membresiaExistente = DB::table('membresias')->where('miembro_id', $request->miembro_id)->first();

            if ($membresiaExistente) {
                DB::table('membresias')->where('id', $membresiaExistente->id)->update([
                    'tipo_membresia_id' => $request->tipo_membresia_id,
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'activa' => true,
                ]);
                $membresiaId = $membresiaExistente->id;
            } else {
                $membresiaId = DB::table('membresias')->insertGetId([
                    'miembro_id' => $request->miembro_id,
                    'tipo_membresia_id' => $request->tipo_membresia_id,
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'activa' => true,
                ]);
            }

            if ($request->promocion_id) {
                DB::table('membresia_promocion')->updateOrInsert(
                    ['membresia_id' => $membresiaId, 'promocion_id' => $request->promocion_id]
                );
            }

            DB::table('pagos')->insert([
                'membresia_id' => $membresiaId,
                'monto' => $request->monto,
                'fecha_pago' => $request->fecha_pago,
                'metodo_pago' => $request->metodo_pago,
                'estado' => 'pagado',
            ]);
        });

        return redirect()->back();
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'monto' => 'required|numeric|min:0',
            'fecha_pago' => 'required|date',
            'metodo_pago' => 'required|in:efectivo,tarjeta,transferencia',
            'estado' => 'required|in:pagado,pendiente',
        ]);

        DB::table('pagos')->where('id', $id)->update([
            'monto' => $request->monto,
            'fecha_pago' => $request->fecha_pago,
            'metodo_pago' => $request->metodo_pago,
            'estado' => $request->estado,
        ]);

        return redirect()->back();
    }

    public function destroy(string $id)
    {
        DB::table('pagos')->where('id', $id)->delete();
        return redirect()->back();
    }
}