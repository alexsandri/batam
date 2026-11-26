<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Pemasok;
use App\Models\Pembelian;
use App\Models\Penjualan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    /**
     * Mengisi data contoh untuk demo (mis. GitHub Codespaces).
     *
     * Jalankan setelah DatabaseSeeder: php artisan db:seed --class=DemoSeeder
     * Password akun kasir diambil dari DEMO_PASSWORD, atau dibuat acak bila kosong.
     */
    public function run(): void
    {
        if (Barang::where('kode_barang', 'KP-001')->exists()) {
            $this->command->info('Data demo sudah ada, dilewati.');

            return;
        }

        $admin = User::where('role', User::ROLE_ADMIN)->firstOrFail();
        $password = env('DEMO_PASSWORD') ?: Str::password(12, symbols: false);

        $kasir = User::create(['name' => 'Budi Kasir', 'email' => 'kasir@pos.test', 'role' => User::ROLE_KASIR, 'password' => $password]);
        User::create(['name' => 'Sari Kasir', 'email' => 'sari@pos.test', 'role' => User::ROLE_KASIR, 'password' => $password]);

        foreach (['Bahan Baku', 'Minuman', 'Makanan', 'Perlengkapan'] as $nama) {
            Kategori::create(['nama_kategori' => $nama]);
        }

        $pemasoks = collect([
            ['nama_pemasok' => 'CV Sumber Kopi Nusantara', 'telepon' => '081234500011', 'email' => 'order@sumberkopi.test', 'alamat' => 'Jl. Merdeka No. 10, Bandung'],
            ['nama_pemasok' => 'PT Susu Segar Abadi', 'telepon' => '082233400022', 'email' => 'sales@sususegar.test', 'alamat' => 'Kawasan Industri Pulogadung, Jakarta'],
            ['nama_pemasok' => 'UD Roti Makmur', 'telepon' => '085677800033', 'email' => 'rotimakmur@contoh.test', 'alamat' => 'Jl. Pasar Baru No. 5, Bogor'],
        ])->map(fn (array $data) => Pemasok::create($data));

        $barangs = [];

        foreach ([
            ['KP-001', 'Kopi Arabica Gayo 250 g', 'Bahan Baku', 65000, 85000, 6, 'pcs'],
            ['KP-002', 'Kopi Robusta Lampung 250 g', 'Bahan Baku', 45000, 60000, 10, 'pcs'],
            ['SU-001', 'Susu UHT Full Cream 1 L', 'Bahan Baku', 17000, 21000, 6, 'liter'],
            ['GL-001', 'Gula Aren Cair 500 ml', 'Bahan Baku', 22000, 30000, 2, 'pcs'],
            ['MN-001', 'Es Kopi Susu Aren', 'Minuman', 9000, 22000, 40, 'pcs'],
            ['MN-002', 'Teh Tarik', 'Minuman', 6000, 18000, 35, 'pcs'],
            ['MN-003', 'Matcha Latte', 'Minuman', 11000, 28000, 25, 'pcs'],
            ['MK-001', 'Croissant Butter', 'Makanan', 12000, 25000, 4, 'pcs'],
            ['MK-002', 'Roti Bakar Cokelat', 'Makanan', 8000, 20000, 20, 'pcs'],
            ['MK-003', 'Kentang Goreng', 'Makanan', 7000, 18000, 12, 'pcs'],
            ['PL-001', 'Cup Plastik 16 oz', 'Perlengkapan', 700, 1000, 300, 'pcs'],
        ] as [$kode, $nama, $kategori, $hargaBeli, $hargaJual, $stok, $satuan]) {
            $gambar = database_path("seeders/demo-images/{$kode}.jpg");

            $barang = Barang::create([
                'kode_barang' => $kode,
                'nama_barang' => $nama,
                'kategori' => $kategori,
                'deskripsi' => $nama,
                'harga_beli' => $hargaBeli,
                'harga_jual' => $hargaJual,
                'stok' => 0,
                'satuan' => $satuan,
                'gambar' => file_exists($gambar) ? Storage::disk('public')->putFileAs('barangs', $gambar, "{$kode}.jpg") : null,
            ]);

            $barang->ubahStok($stok, 'masuk', $admin->id, null, 'Stok awal');
            $barangs[$kode] = $barang;
        }

        $this->pembelian($admin, $pemasoks[0], 6, 'Restok kopi mingguan', ['KP-001' => [10, 64000], 'KP-002' => [12, 45000]], $barangs);
        $this->pembelian($admin, $pemasoks[1], 3, null, ['SU-001' => [24, 17500]], $barangs);
        $this->pembelian($admin, $pemasoks[2], 1, 'Pesanan roti untuk akhir pekan', ['MK-001' => [20, 12000], 'MK-002' => [15, 8000]], $barangs);

        $this->penjualan($kasir, 5, ['MN-001' => 3, 'MK-002' => 2], 110000, $barangs);
        $this->penjualan($kasir, 4, ['MN-002' => 2, 'MK-003' => 2], 80000, $barangs);
        $this->penjualan($admin, 3, ['MN-003' => 2, 'MK-001' => 2], 110000, $barangs);
        $this->penjualan($kasir, 2, ['MN-001' => 4, 'MN-002' => 1], 110000, $barangs);
        $this->penjualan($kasir, 1, ['KP-001' => 1, 'MN-001' => 2], 130000, $barangs);
        $this->penjualan($kasir, 0, ['MN-001' => 5, 'MK-001' => 3, 'MK-003' => 4], 300000, $barangs);
        $this->penjualan($kasir, 0, ['MN-003' => 3, 'MK-002' => 2], 125000, $barangs);
        $this->penjualan($admin, 0, ['MN-002' => 2, 'MK-003' => 3], 100000, $barangs);

        $barangs['PL-001']->ubahStok(-15, 'penyesuaian', $admin->id, null, 'Stock opname: 15 cup rusak');

        $this->command->info('Data demo dibuat. Akun kasir: kasir@pos.test dan sari@pos.test');

        if (! env('DEMO_PASSWORD')) {
            $this->command->warn("Password akun kasir: {$password}");
        }
    }

    /**
     * @param  array<string, array{int, int}>  $items  kode barang => [jumlah, harga beli]
     * @param  array<string, Barang>  $barangs
     */
    private function pembelian(User $user, Pemasok $pemasok, int $hariLalu, ?string $catatan, array $items, array $barangs): void
    {
        DB::transaction(function () use ($user, $pemasok, $hariLalu, $catatan, $items, $barangs) {
            $tanggal = Carbon::today()->subDays($hariLalu);

            $pembelian = Pembelian::create([
                'no_faktur' => $this->nomorFaktur('PB', Pembelian::class, $tanggal),
                'pemasok_id' => $pemasok->id,
                'user_id' => $user->id,
                'tanggal' => $tanggal,
                'catatan' => $catatan,
            ]);

            $total = 0;

            foreach ($items as $kode => [$jumlah, $hargaBeli]) {
                $barang = $barangs[$kode];
                $total += $jumlah * $hargaBeli;

                $pembelian->details()->create(['barang_id' => $barang->id, 'jumlah' => $jumlah, 'harga_beli' => $hargaBeli, 'subtotal' => $jumlah * $hargaBeli]);

                $barang->harga_beli = $hargaBeli;
                $barang->ubahStok($jumlah, 'masuk', $user->id, $pembelian->no_faktur, 'Pembelian dari '.$pemasok->nama_pemasok);
            }

            $pembelian->update(['total' => $total]);
        });
    }

    /**
     * @param  array<string, int>  $items  kode barang => jumlah
     * @param  array<string, Barang>  $barangs
     */
    private function penjualan(User $user, int $hariLalu, array $items, int $bayar, array $barangs): void
    {
        DB::transaction(function () use ($user, $hariLalu, $items, $bayar, $barangs) {
            $tanggal = Carbon::today()->subDays($hariLalu);
            $total = collect($items)->sum(fn (int $jumlah, string $kode) => $jumlah * $barangs[$kode]->harga_jual);

            $penjualan = Penjualan::create([
                'no_faktur' => $this->nomorFaktur('PJ', Penjualan::class, $tanggal),
                'user_id' => $user->id,
                'tanggal' => $tanggal,
                'total' => $total,
                'bayar' => $bayar,
                'kembalian' => $bayar - $total,
            ]);

            foreach ($items as $kode => $jumlah) {
                $barang = $barangs[$kode];

                $penjualan->details()->create(['barang_id' => $barang->id, 'jumlah' => $jumlah, 'harga_jual' => $barang->harga_jual, 'subtotal' => $jumlah * $barang->harga_jual]);

                $barang->ubahStok(-$jumlah, 'keluar', $user->id, $penjualan->no_faktur, 'Penjualan');
            }
        });
    }

    /**
     * Nomor faktur berurutan per tanggal, sama dengan format di controller.
     *
     * @param  class-string<Pembelian|Penjualan>  $modelClass
     */
    private function nomorFaktur(string $prefix, string $modelClass, Carbon $tanggal): string
    {
        $awalan = $prefix.'-'.$tanggal->format('Ymd').'-';
        $urutan = $modelClass::where('no_faktur', 'like', $awalan.'%')->count() + 1;

        return $awalan.str_pad((string) $urutan, 4, '0', STR_PAD_LEFT);
    }
}
