<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 🔄 Restaurando tus consultas originales en tiempo real
        $miembrosActivos = DB::table('miembros')
            ->where('estado', true)
            ->count();

        $checkinsHoy = DB::table('checkins')
            ->whereDate('fecha', today())
            ->count();

        $pagosPendientes = DB::table('membresias')
            ->where('activa', true)
            ->where('fecha_fin', '<', today())
            ->count();

        // 🎯 MAPEO INTELIGENTE DEL DÍA DE LA SEMANA EN ESPAÑOL (MÉXICO)
        $fechaLocal = Carbon::now('America/Mexico_City');
        $diasIngles = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $diasEspanol = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        $diaDeHoy = str_replace($diasIngles, $diasEspanol, $fechaLocal->format('l'));

        // 🎯 OBTENER LAS CLASES DEL DÍA
        $clasesRaw = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->select(
                'clases.id',
                'clases.nombre',
                'clases.fecha as horario_completo', // String libre con los días y horas
                'clases.capacidad',                 // Sincronizado para tu columna Capacidad
                'clases.capacidad as cupo_maximo',  
                'empleados.nombre as entrenador_nombre',
                'sucursales.nombre as sucursal_nombre'
            )
            ->whereRaw('clases.fecha ILIKE ?', ["%{$diaDeHoy}%"])
            ->get();

        // 🎯 FORMATEO DINÁMICO DE HORA PARA ENGAÑAR AL FORMATEADOR DE REACT
        $clasesHoy = $clasesRaw->map(function($clase) use ($fechaLocal) {
            $horaLimpia = '10:00'; // Hora por defecto por seguridad

            // Si el texto contiene el separador "—", extraemos el tramo de la hora (ej: "07:00")
            if (str_contains($clase->horario_completo, '—')) {
                $partes = explode('—', $clase->horario_completo);
                $horaLimpia = trim($partes[1]);
            }

            // 🎯 LA CLAVE: Construimos un string de fecha real simulando el día de hoy con esa hora
            // Resultado: "2026-05-18 07:00:00" -> Esto es 100% masticable para JavaScript
            $fechaSimulada = $fechaLocal->toDateString() . ' ' . $horaLimpia . ':00';

            // Inyectamos la fecha válida en todas las propiedades posibles que lea tu Front
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
            'pagosPendientes' => $pagosPendientes,
            'clasesHoy' => $clasesHoy,
            'pagosRecientes' => $pagosRecientes,
        ]);
    }
}