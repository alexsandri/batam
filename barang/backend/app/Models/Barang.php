<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori',
        'deskripsi',
        'harga_beli',
        'harga_jual',
        'stok',
        'satuan',
        'gambar'
    ];
}
