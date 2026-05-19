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
// 🎯 RESTAURADO: Imports de tus controladores backend
use App\Http\Controllers\ClaseController;
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

    Route::post('miembros', [MiembroController::class, 'store'])
        ->name('miembros.store');

    Route::put('miembros/{miembro}', [MiembroController::class, 'update'])
        ->name('miembros.update');

    Route::delete('miembros/{miembro}', [MiembroController::class, 'destroy']) 
        ->name('miembros.destroy');

    Route::get('miembro/dashboard', [MiembroPerfilController::class, 'dashboard'])
        ->name('miembro.dashboard');

    Route::get('sucursales', [SucursalController::class, 'index'])
        ->name('sucursales.index');

    Route::post('sucursales', [SucursalController::class, 'store'])
        ->name('sucursales.store');

    Route::put('sucursales/{sucursal}', [SucursalController::class, 'update'])   
        ->name('sucursales.update');
        
    Route::delete('sucursales/{sucursal}', [SucursalController::class, 'destroy'])
        ->name('sucursales.destroy');

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

    Route::get('pagos', [PagoController::class, 'index'])
        ->name('pagos.index');

    Route::post('pagos', [PagoController::class, 'store'])
        ->name('pagos.store');

    Route::get('recepcionista/dashboard', [RecepcionistaController::class, 'dashboard'])
        ->name('recepcionista.dashboard');

    Route::get('entrenador/dashboard', [EntrenadorController::class, 'dashboard'])
        ->name('entrenador.dashboard');

    Route::get('clases', [ClaseController::class, 'index'])
        ->name('clases.index');

    Route::post('clases', [ClaseController::class, 'store'])
        ->name('clases.store');

    Route::put('clases/{clase}', [ClaseController::class, 'update'])
        ->name('clases.update');

    Route::delete('clases/{clase}', [ClaseController::class, 'destroy'])
        ->name('clases.destroy');

    Route::get('empleados', [EmpleadoController::class, 'index'])
        ->name('empleados.index');

    Route::post('empleados', [EmpleadoController::class, 'store'])
        ->name('empleados.store');

    Route::put('empleados/{empleado}', [EmpleadoController::class, 'update'])
        ->name('empleados.update');
        
    Route::delete('empleados/{empleado}', [EmpleadoController::class, 'destroy'])
        ->name('empleados.destroy');
});

require __DIR__.'/settings.php';