<?php

use App\Http\Controllers\MembresiaController;
use App\Http\Controllers\MiembroController;
use App\Http\Controllers\PagoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
});

Route::get('/miembros-page', function () {
    return Inertia::render('miembros/index');
});

// CRUD
Route::resource('miembros', MiembroController::class);
Route::resource('pagos', PagoController::class);
Route::resource('membresias', MembresiaController::class);

require __DIR__.'/settings.php';