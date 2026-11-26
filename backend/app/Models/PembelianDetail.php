<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembelianDetail extends Model
{
    protected $fillable = [
        'pembelian_id',
        'barang_id',
        'jumlah',
        'harga_beli',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'harga_beli' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class);
    }
}
