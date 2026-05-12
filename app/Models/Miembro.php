<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Miembro extends Model
{
    protected $table = 'miembros';

    protected $fillable = [
        'sucursal_id',
        'nombre',
        'email',
        'telefono',
        'fecha_nacimiento',
        'genero',
        'estado',
        'datos_adicionales',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'datos_adicionales' => 'array',
    ];

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class);
    }
}

