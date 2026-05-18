<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    /**
     * Mostrar la lista de empleados y las sucursales disponibles.
     */
    public function index()
    {
        // Consulta limpia a PostgreSQL cruzando empleados con usuarios y sucursales
        $empleados = DB::table('empleados')
            ->join('users', 'empleados.user_id', '=', 'users.id')
            ->join('sucursales', 'empleados.sucursal_id', '=', 'sucursales.id')
            ->select(
                'empleados.id',
                'empleados.nombre',
                'empleados.email',
                'empleados.salario',
                'empleados.sucursal_id',
                'sucursales.nombre as sucursal_nombre',
                'users.rol',
                'users.id as user_id'
            )
            ->orderBy('empleados.nombre', 'asc')
            ->get();

        // Cargamos las sucursales para los selectores de los modales
        $sucursales = DB::table('sucursales')
            ->select('id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get();

        // 🎯 APUNTANDO CORRECTAMENTE A: resources/js/pages/empleado/index.tsx
        return Inertia::render('empleado/index', [
            'empleados' => $empleados,
            'sucursales' => $sucursales,
        ]);
    }

    /**
     * Registrar un nuevo empleado en el staff.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'rol' => 'required|in:gerente,entrenador,recepcionista',
            'sucursal_id' => 'required|exists:sucursales,id',
        ]);

        // Asignación de salario base automático según el puesto contratado
        $salario = match ($request->rol) {
            'recepcionista' => 6000.00,
            'entrenador'    => 8000.00,
            'gerente'       => 15000.00,
            default         => 0.00,
        };

        // Transacción para asegurar la consistencia de datos en ambas tablas
        DB::transaction(function () use ($request, $salario) {
            // 1. Insertar el registro de acceso en la tabla users
            $userId = DB::table('users')->insertGetId([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'rol' => $request->rol,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Insertar el perfil laboral en la tabla empleados vinculado al user_id
            DB::table('empleados')->insert([
                'user_id' => $userId,
                'sucursal_id' => $request->sucursal_id,
                'nombre' => $request->name,
                'email' => $request->email,
                'salario' => $salario,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return redirect()->back();
    }

    /**
     * Actualizar los datos de un empleado existente (Puesto, Sucursal, Nombre, Salario o Contraseña).
     */
    public function update(Request $request, $id)
    {
        $empleado = DB::table('empleados')->where('id', $id)->first();
        
        if (!$empleado) {
            return redirect()->back()->withErrors(['error' => 'Empleado no encontrado']);
        }

        // La regla del password ahora es opcional ('nullable') pero si se escribe, debe tener mínimo 8 caracteres
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $empleado->user_id,
            'rol' => 'required|in:gerente,entrenador,recepcionista',
            'sucursal_id' => 'required|exists:sucursales,id',
            'salario' => 'required|numeric|min:0',
            'password' => 'nullable|string|min:8', 
        ]);

        DB::transaction(function () use ($request, $empleado, $id) {
            // 1. Preparar los datos básicos del usuario
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'rol' => $request->rol,
                'updated_at' => now(),
            ];

            // 🔑 Si el administrador escribió algo en el campo password, lo agregamos encriptado
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            // Actualizar datos en la tabla users
            DB::table('users')
                ->where('id', $empleado->user_id)
                ->update($userData);

            // 2. Actualizar datos laborales en la tabla empleados
            DB::table('empleados')
                ->where('id', $id)
                ->update([
                    'sucursal_id' => $request->sucursal_id,
                    'nombre' => $request->name,
                    'email' => $request->email,
                    'salario' => $request->salario,
                    'updated_at' => now(),
                ]);
        });

        return redirect()->back();
    }

    /**
     * Dar de baja a un empleado (Remueve perfil del staff y credenciales de acceso).
     */
    public function destroy($id)
    {
        $empleado = DB::table('empleados')->where('id', $id)->first();

        if ($empleado) {
            DB::transaction(function () use ($empleado, $id) {
                // Borramos primero el perfil de empleado
                DB::table('empleados')->where('id', $id)->delete();
                // Borramos las credenciales para liberar el correo electrónico único
                DB::table('users')->where('id', $empleado->user_id)->delete();
            });
        }

        return redirect()->back();
    }
}