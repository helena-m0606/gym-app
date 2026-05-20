<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MiembroPerfilController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        $miembro = DB::table('miembros')
            ->where('user_id', $user->id)
            ->first();

        $checkinsMes = DB::table('checkins')
            ->where('miembro_id', $miembro->id)
            ->whereMonth('fecha', now()->month)
            ->count();

        $membresia = DB::table('membresias')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->select('membresias.*', 'tipos_membresia.nombre as tipo')
            ->where('membresias.miembro_id', $miembro->id)
            ->where('membresias.activa', true)
            ->first();

        $clasesReservadas = DB::table('reservas_clase')
            ->join('clases', 'reservas_clase.clase_id', '=', 'clases.id')
            ->select('clases.nombre', 'clases.fecha', 'reservas_clase.estado')
            ->where('reservas_clase.miembro_id', $miembro->id)
            ->orderBy('clases.fecha', 'asc')
            ->limit(5)
            ->get();

        $rutina = DB::table('rutinas')
            ->join('rutina_ejercicio', 'rutinas.id', '=', 'rutina_ejercicio.rutina_id')
            ->join('ejercicios', 'rutina_ejercicio.ejercicio_id', '=', 'ejercicios.id')
            ->select('ejercicios.nombre', 'rutina_ejercicio.series', 'rutina_ejercicio.repeticiones')
            ->where('rutinas.miembro_id', $miembro->id)
            ->limit(5)
            ->get();

        $progreso = DB::table('progreso_miembro')
            ->where('miembro_id', $miembro->id)
            ->orderBy('fecha', 'desc')
            ->limit(2)
            ->get();

        $diasRestantes = $membresia
        ? max(0, (int) now()->diffInDays($membresia->fecha_fin, false))
        : 0;

        return Inertia::render('Miembro-Perfil/dashboard', [
            'miembro' => $miembro,
            'checkinsMes' => $checkinsMes,
            'membresia' => $membresia,
            'diasRestantes' => max(0, $diasRestantes),
            'clasesReservadas' => $clasesReservadas,
            'rutina' => $rutina,
            'progreso' => $progreso,
        ]);
    }

    public function clases()
    {
        $user = Auth::user();
        $miembro = DB::table('miembros')->where('user_id', $user->id)->first();

        $misClases = DB::table('reservas_clase')
            ->join('clases', 'reservas_clase.clase_id', '=', 'clases.id')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->select(
                'reservas_clase.id',
                'reservas_clase.estado',
                'clases.nombre',
                'clases.fecha',
                'clases.capacidad',
                'empleados.nombre as entrenador',
                'sucursales.nombre as sucursal'
            )
            ->where('reservas_clase.miembro_id', $miembro->id)
            ->orderBy('clases.fecha', 'asc')
            ->get();

        $clasesDisponibles = DB::table('clases')
            ->join('empleados', 'clases.entrenador_id', '=', 'empleados.id')
            ->join('sucursales', 'clases.sucursal_id', '=', 'sucursales.id')
            ->select(
                'clases.id',
                'clases.nombre',
                'clases.fecha',
                'clases.capacidad',
                'empleados.nombre as entrenador',
                'sucursales.nombre as sucursal'
            )
            ->whereNotIn('clases.id', 
                DB::table('reservas_clase')
                    ->where('miembro_id', $miembro->id)
                    ->pluck('clase_id')
            )
            ->get();

        return Inertia::render('Miembro-Perfil/clases', [
            'misClases' => $misClases,
            'clasesDisponibles' => $clasesDisponibles,
        ]);
    }

    public function membresia()
    {
        $user = Auth::user();
        $miembro = DB::table('miembros')->where('user_id', $user->id)->first();

        $membresia = DB::table('membresias')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->select('membresias.*', 'tipos_membresia.nombre as tipo', 'tipos_membresia.precio')
            ->where('membresias.miembro_id', $miembro->id)
            ->orderBy('membresias.fecha_fin', 'desc')
            ->first();

        $historial = DB::table('membresias')
            ->join('tipos_membresia', 'membresias.tipo_membresia_id', '=', 'tipos_membresia.id')
            ->join('pagos', 'pagos.membresia_id', '=', 'membresias.id')
            ->select(
                'tipos_membresia.nombre as tipo',
                'membresias.fecha_inicio',
                'membresias.fecha_fin',
                'membresias.activa',
                'pagos.monto',
                'pagos.metodo_pago',
                'pagos.fecha_pago'
            )
            ->where('membresias.miembro_id', $miembro->id)
            ->orderBy('membresias.fecha_fin', 'desc')
            ->get();

        $diasRestantes = $membresia
        ? max(0, (int) now()->diffInDays($membresia->fecha_fin, false))
        : 0;

        return Inertia::render('Miembro-Perfil/membresia', [
            'membresia' => $membresia,
            'historial' => $historial,
            'diasRestantes' => $diasRestantes,
        ]);
    }


    public function notificaciones()
    {
        $user = Auth::user();
        $miembro = DB::table('miembros')->where('user_id', $user->id)->first();

        $notificaciones = DB::table('notificaciones')
            ->where('miembro_id', $miembro->id)
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('Miembro-Perfil/notificaciones', [
            'notificaciones' => $notificaciones,
        ]);
    }
}