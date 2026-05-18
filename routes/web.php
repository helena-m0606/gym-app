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

    Route::get('sucursales', [SucursalController::class, 'index'])
        ->name('sucursales.index');

    Route::post('sucursales', [SucursalController::class, 'store'])
        ->name('sucursales.store');

    Route::get('franquicias', [FranquiciaController::class, 'index'])
        ->name('franquicias.index');

    Route::post('franquicias', [FranquiciaController::class, 'store'])
        ->name('franquicias.store');

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

    Route::get('miembro/dashboard', [MiembroPerfilController::class, 'dashboard'])
        ->name('miembro.dashboard');

    Route::get('gerente/dashboard', [GerenteController::class, 'dashboard'])
        ->name('gerente.dashboard');
});

require __DIR__.'/settings.php';