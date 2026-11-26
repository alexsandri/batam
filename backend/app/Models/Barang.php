<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barang extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi melalui mass assignment.
     *
     * @var list<string>
     */
    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori',
        'deskripsi',
        'harga_beli',
        'harga_jual',
        'stok',
        'satuan',
        'gambar',
    ];

    protected function casts(): array
    {
        return [
            'harga_beli' => 'decimal:2',
            'harga_jual' => 'decimal:2',
            'stok' => 'integer',
        ];
    }

    public function stokMutasis(): HasMany
    {
        return $this->hasMany(StokMutasi::class);
    }

    /**
     * Mengubah stok sekaligus mencatat riwayatnya di kartu stok.
     *
     * Dipanggil di dalam transaksi database setelah baris barang dikunci.
     */
    public function ubahStok(int $jumlah, string $tipe, ?int $userId, ?string $referensi = null, ?string $keterangan = null): StokMutasi
    {
        $stokSebelum = $this->stok;
        $this->stok = $stokSebelum + $jumlah;
        $this->save();

        return $this->stokMutasis()->create([
            'user_id' => $userId,
            'tipe' => $tipe,
            'jumlah' => $jumlah,
            'stok_sebelum' => $stokSebelum,
            'stok_sesudah' => $this->stok,
            'referensi' => $referensi,
            'keterangan' => $keterangan,
        ]);
    }
}
