<?php

use App\Http\Controllers\MiembroController;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\FranquiciaController;

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

    Route::get('franquicias', [FranquiciaController::class, 'index'])
    ->name('franquicias.index');

    Route::post('franquicias', [FranquiciaController::class, 'store'])
    ->name('franquicias.store');
});
require __DIR__.'/settings.php';