<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    public function index()
    {
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

        $sucursales = DB::table('sucursales')
            ->select('id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get();

        return Inertia::render('Empleado/index', [
            'empleados' => $empleados,
            'sucursales' => $sucursales,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'rol' => 'required|in:gerente,entrenador,recepcionista',
            'sucursal_id' => 'required|exists:sucursales,id',
        ]);

        $salario = match ($request->rol) {
            'recepcionista' => 6000.00,
            'entrenador'    => 8000.00,
            'gerente'       => 15000.00,
            default         => 0.00,
        };

        DB::transaction(function () use ($request, $salario) {
            $userId = DB::table('users')->insertGetId([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'rol' => $request->rol,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

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

    public function update(Request $request, $id)
    {
        $empleado = DB::table('empleados')->where('id', $id)->first();
        
        if (!$empleado) {
            return redirect()->back()->withErrors(['error' => 'Empleado no encontrado']);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $empleado->user_id,
            'rol' => 'required|in:gerente,entrenador,recepcionista',
            'sucursal_id' => 'required|exists:sucursales,id',
            'salario' => 'required|numeric|min:0',
            'password' => 'nullable|string|min:8', 
        ]);

        DB::transaction(function () use ($request, $empleado, $id) {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'rol' => $request->rol,
                'updated_at' => now(),
            ];

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            DB::table('users')
                ->where('id', $empleado->user_id)
                ->update($userData);

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

    public function destroy($id)
    {
        $empleado = DB::table('empleados')->where('id', $id)->first();

        if ($empleado) {
            DB::transaction(function () use ($empleado, $id) {
                DB::table('empleados')->where('id', $id)->delete();
                DB::table('users')->where('id', $empleado->user_id)->delete();
            });
        }

        return redirect()->back();
    }
}