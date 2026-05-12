<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Franquicia extends Model
{
    protected $table = 'franquicias';

    protected $fillable = [
        'nombre',
        'razon_social',
        'rfc',
    ];
}