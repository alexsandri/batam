<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Barang extends Model
{
    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori_id',
        'deskripsi',
        'harga_beli',
        'harga_jual',
        'stok',
        'satuan',
        'gambar',
    ];

    // Setiap barang dimiliki oleh satu kategori
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }
}
