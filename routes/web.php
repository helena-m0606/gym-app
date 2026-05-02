<?php

use App\Http\Controllers\MembresiaController;
use App\Http\Controllers\MiembroController;
use App\Http\Controllers\PagoController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Rutas CRUD
Route::resource('miembros', MiembroController::class);
Route::resource('pagos', PagoController::class);
Route::resource('membresias', MembresiaController::class);


require __DIR__.'/settings.php';
