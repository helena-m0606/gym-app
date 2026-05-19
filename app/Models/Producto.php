<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Producto extends Model
{
    protected $table = 'productos';
    protected $fillable = [
        'sucursal_id',
        'nombre',
        'precio',
        'stock',
        'categoria',
        'descripcion',
        'activo',
    ];
    protected $casts = [
        'precio' => 'decimal:2',
    ];
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class);
    }
}