<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pemasok extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pemasok',
        'telepon',
        'email',
        'alamat',
    ];

    public function pembelians(): HasMany
    {
        return $this->hasMany(Pembelian::class);
    }
}
