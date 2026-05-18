<?php

use App\Http\Controllers\MiembroController;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\FranquiciaController;
use App\Http\Controllers\RecepcionistaController;
use App\Http\Controllers\EntrenadorController;
use App\Http\Controllers\MiembroPerfilController;
use App\Http\Controllers\MembresiaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GerenteController;
use App\Http\Controllers\EmpleadoController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/redirect', \App\Http\Controllers\Auth\LoginRedirectController::class)
        ->name('redirect');

    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('miembros', [MiembroController::class, 'index'])
        ->name('miembros.index');

    Route::get('empleados', [EmpleadoController::class, 'index'])
        ->name('empleados.index');

    Route::post('empleados', [EmpleadoController::class, 'store'])
        ->name('empleados.store');

    Route::put('empleados/{id}', [EmpleadoController::class, 'update']) // 👈 RUTA PARA EDITAR
        ->name('empleados.update');

    Route::delete('empleados/{id}', [EmpleadoController::class, 'destroy']) // 👈 RUTA PARA ELIMINAR
        ->name('empleados.destroy');

    Route::post('empleados', [EmpleadoController::class, 'store'])
        ->name('empleados.store');

    Route::get('sucursales', [SucursalController::class, 'index'])
        ->name('sucursales.index');

    Route::post('sucursales', [SucursalController::class, 'store'])
        ->name('sucursales.store');

    Route::get('franquicias', [FranquiciaController::class, 'index'])
        ->name('franquicias.index');

    Route::post('franquicias', [FranquiciaController::class, 'store'])
        ->name('franquicias.store');

    Route::put('franquicias/{franquicia}', [FranquiciaController::class, 'update'])
        ->name('franquicias.update');
        
    Route::delete('franquicias/{franquicia}', [FranquiciaController::class, 'destroy'])
        ->name('franquicias.destroy');

    Route::get('membresias', [MembresiaController::class, 'index'])
        ->name('membresias.index');

    Route::post('membresias', [MembresiaController::class, 'store'])
        ->name('membresias.store');

    Route::delete('membresias/{id}', [MembresiaController::class, 'destroy'])
        ->name('membresias.destroy');

    Route::put('membresias/{id}', [MembresiaController::class, 'update'])
        ->name('membresias.update');

    Route::post('tipos-membresia', [MembresiaController::class, 'storeTipo'])
        ->name('tipos_membresia.store');

    Route::put('tipos-membresia/{id}', [MembresiaController::class, 'updateTipo'])
        ->name('tipos_membresia.update');

    Route::delete('tipos-membresia/{id}', [MembresiaController::class, 'destroyTipo'])
        ->name('tipos_membresia.destroy');

    Route::get('pagos', [PagoController::class, 'index'])
        ->name('pagos.index');

    Route::post('pagos', [PagoController::class, 'store'])
        ->name('pagos.store');

    Route::put('pagos/{id}', [PagoController::class, 'update'])
        ->name('pagos.update');

    Route::delete('pagos/{id}', [PagoController::class, 'destroy'])
        ->name('pagos.destroy');

    Route::get('recepcionista/dashboard', [RecepcionistaController::class, 'dashboard'])
        ->name('recepcionista.dashboard');

    Route::get('entrenador/dashboard', [EntrenadorController::class, 'dashboard'])
        ->name('entrenador.dashboard');

    Route::get('miembro/dashboard', [MiembroPerfilController::class, 'dashboard'])
        ->name('miembro.dashboard');

    Route::get('gerente/dashboard', [GerenteController::class, 'dashboard'])
        ->name('gerente.dashboard');
});

require __DIR__.'/settings.php';