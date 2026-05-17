<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginRedirectController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();

        return match($user->rol) {
            'admin' => redirect('/dashboard'),
            'entrenador' => redirect('/entrenador/dashboard'),
            'recepcionista' => redirect('/recepcionista/dashboard'),
            'miembro' => redirect('/miembro/dashboard'),
            default => redirect('/dashboard'),
        };
    }
}