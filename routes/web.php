<?php

use App\Http\Controllers\MiembroController;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\FranquiciaController;
use App\Http\Controllers\MembresiaController;
use App\Http\Controllers\PagoController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('miembros', [MiembroController::class, 'index'])
        ->name('miembros.index');

    Route::post('miembros', [MiembroController::class, 'store'])
        ->name('miembros.store');

    Route::get('sucursales', [SucursalController::class, 'index'])
        ->name('sucursales.index');

    Route::post('sucursales', [SucursalController::class, 'store'])
        ->name('sucursales.store');

    Route::get('membresias', [MembresiaController::class, 'index'])
        ->name('membresias.index');

    Route::post('membresias', [MembresiaController::class, 'store'])
        ->name('membresias.store');

    Route::get('pagos', [PagoController::class, 'index'])
        ->name('pagos.index');

    Route::post('pagos', [PagoController::class, 'store'])
        ->name('pagos.store');
});
require __DIR__.'/settings.php';