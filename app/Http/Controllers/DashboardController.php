<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $miembrosActivos = DB::table('miembros')
            ->where('estado', true)
            ->count();

        $checkinsHoy = DB::table('checkins')
            ->whereDate('fecha', today())
            ->count();

        $membresiasVencidas = DB::table('membresias')
            ->where('fecha_fin', '<', today())
            ->count();

        $membresiasPorVencer = DB::table('membresias')
            ->where('activa', true)
            ->whereBetween('fecha_fin', [today(), today()->addDays(7)])
            ->count();

        $nuevosMiembrosMes = DB::table('miembros')
            ->whereYear('created_at', today()->year)
            ->whereMonth('created_at', today()->month)
            ->count();

        $ingresosMes = DB::table('pagos')
            ->whereYear('fecha_pago', today()->year)
            ->whereMonth('fecha_pago', today()->month)
            ->where('estado', 'pagado')
            ->sum('monto');

        $fechaLocal = Carbon::now('America/Mexico_City');
        $diasIngles = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $diasEspanol = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        $diaDeHoy = str_replace($diasIngles, $diasEspanol, $fechaLocal->format('l'));

        $clasesRaw = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->select(
                'clases.id',
                'clases.nombre',
                'clases.fecha as horario_completo',
                'clases.capacidad',
                'clases.capacidad as cupo_maximo',
                'empleados.nombre as entrenador_nombre',
                'sucursales.nombre as sucursal_nombre'
            )
            ->whereRaw('clases.fecha ILIKE ?', ["%{$diaDeHoy}%"])
            ->get();

        $clasesHoy = $clasesRaw->map(function($clase) use ($fechaLocal) {
            $horaLimpia = '10:00';
            if (str_contains($clase->horario_completo, '—')) {
                $partes = explode('—', $clase->horario_completo);
                $horaLimpia = trim($partes[1]);
            }
            $fechaSimulada = $fechaLocal->toDateString() . ' ' . $horaLimpia . ':00';
            $clase->horario = $fechaSimulada;
            $clase->fecha = $fechaSimulada;
            return $clase;
        });

        $pagosRecientes = DB::table('pagos')
            ->join('membresias', 'pagos.membresia_id', '=', 'membresias.id')
            ->join('miembros', 'membresias.miembro_id', '=', 'miembros.id')
            ->select('miembros.nombre', 'pagos.monto', 'pagos.estado')
            ->orderBy('pagos.fecha_pago', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'miembrosActivos' => $miembrosActivos,
            'checkinsHoy' => $checkinsHoy,
            'membresiasVencidas' => $membresiasVencidas,
            'membresiasPorVencer' => $membresiasPorVencer,
            'nuevosMiembrosMes' => $nuevosMiembrosMes,
            'ingresosMes' => $ingresosMes,
            'clasesHoy' => $clasesHoy,
            'pagosRecientes' => $pagosRecientes,
        ]);
    }
}