<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    protected $table = 'sucursales';

    protected $fillable = [
        'franquicia_id',
        'nombre',
        'direccion',
        'ciudad',
        'telefono',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function franquicia()
    {
        return $this->belongsTo(Franquicia::class);
    }
}