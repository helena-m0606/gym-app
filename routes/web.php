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
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\RutinaController;
use App\Http\Controllers\ProductoController;

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
        ->name('Miembro.index');

    Route::post('miembros', [MiembroController::class, 'store'])
        ->name('Miembro.store');

    Route::put('miembros/{miembro}', [MiembroController::class, 'update'])
        ->name('Miembro.update');

    Route::delete('miembros/{miembro}', [MiembroController::class, 'destroy']) 
        ->name('Miembro.destroy');

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

    Route::put('membresias/{membresia}', [MembresiaController::class, 'update'])
        ->name('membresias.update');

    Route::delete('membresias/{membresia}', [MembresiaController::class, 'destroy'])
        ->name('membresias.destroy');

    Route::post('tipos-membresia', [MembresiaController::class, 'storeTipo'])
        ->name('tipos-membresia.store');

    Route::put('tipos-membresia/{tipo}', [MembresiaController::class, 'updateTipo'])
        ->name('tipos-membresia.update');

    Route::delete('tipos-membresia/{tipo}', [MembresiaController::class, 'destroyTipo'])
        ->name('tipos-membresia.destroy');

    Route::get('pagos', [PagoController::class, 'index'])
        ->name('pagos.index');

    Route::post('pagos', [PagoController::class, 'store'])
        ->name('pagos.store');

    Route::put('pagos/{pago}', [PagoController::class, 'update'])
        ->name('pagos.update');

    Route::delete('pagos/{pago}', [PagoController::class, 'destroy'])
        ->name('pagos.destroy');

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

    Route::get('rutinas', [RutinaController::class, 'index'])
        ->name('rutinas.index');
    
    Route::post('rutinas', [RutinaController::class, 'store'])
        ->name('rutinas.store');
    
    Route::put('rutinas/{rutina}', [RutinaController::class, 'update'])
        ->name('rutinas.update');
    
    Route::delete('rutinas/{rutina}', [RutinaController::class, 'destroy'])
        ->name('rutinas.destroy');

    Route::get('productos', [ProductoController::class, 'index'])
        ->name('productos.index');

    Route::post('productos', [ProductoController::class, 'store'])
        ->name('productos.store');

    Route::put('productos/{producto}', [ProductoController::class, 'update'])
        ->name('productos.update');

    Route::delete('productos/{producto}', [ProductoController::class, 'destroy'])
        ->name('productos.destroy');

    Route::get('equipos', [App\Http\Controllers\EquipoController::class, 'index'])
        ->name('equipos.index');
    
    Route::post('equipos', [App\Http\Controllers\EquipoController::class, 'store'])
        ->name('equipos.store');
    
    Route::put('equipos/{equipo}', [App\Http\Controllers\EquipoController::class, 'update'])
        ->name('equipos.update');
    
    Route::delete('equipos/{equipo}', [App\Http\Controllers\EquipoController::class, 'destroy'])
        ->name('equipos.destroy');

    Route::get('recepcionista/dashboard', [RecepcionistaController::class, 'dashboard'])
        ->name('recepcionista.dashboard');

    Route::get('recepcionista/miembros', [RecepcionistaController::class, 'miembros'])
        ->name('recepcionista.miembros');

    Route::get('recepcionista/clases', [RecepcionistaController::class, 'clases'])
        ->name('recepcionista.clases');

    Route::get('recepcionista/pagos', [RecepcionistaController::class, 'pagos'])
        ->name('recepcionista.pagos');
});

require __DIR__.'/settings.php';