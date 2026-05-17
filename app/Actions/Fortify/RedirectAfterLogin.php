<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse;

class RedirectAfterLogin implements LoginResponse
{
    public function toResponse($request)
    {
        $user = $request->user();

        $url = match($user->rol) {
            'admin' => '/dashboard',
            'entrenador' => '/entrenador/dashboard',
            'recepcionista' => '/recepcionista/dashboard',
            'miembro' => '/miembro/dashboard',
            default => '/dashboard',
        };

        return redirect($url);
    }
}