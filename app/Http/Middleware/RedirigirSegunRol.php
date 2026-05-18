<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirigirSegunRol
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $rol = auth()->user()->rol;

            $rutasPermitidas = [
                'admin' => '/dashboard',
                'entrenador' => '/entrenador/dashboard',
                'recepcionista' => '/recepcionista/dashboard',
                'miembro' => '/miembro/dashboard',
            ];

            $rutaActual = $request->path();
            $rutaPermitida = ltrim($rutasPermitidas[$rol] ?? '/dashboard', '/');

            if ($rutaActual !== $rutaPermitida) {
                return redirect($rutasPermitidas[$rol] ?? '/dashboard');
            }
        }

        return $next($request);
    }
}