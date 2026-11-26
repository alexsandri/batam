<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenjualanDetail extends Model
{
    protected $fillable = [
        'penjualan_id',
        'barang_id',
        'jumlah',
        'harga_jual',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'harga_jual' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class);
    }
}
