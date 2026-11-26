<?php

namespace Tests\Feature;

use App\Models\Barang;
use App\Models\Penjualan;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_data_demo_terisi_lengkap_dan_stok_konsisten_dengan_kartu_stok(): void
    {
        Storage::fake('public');

        $this->seed(DatabaseSeeder::class);
        $this->seed(DemoSeeder::class);

        $this->assertSame(3, User::count());
        $this->assertSame(11, Barang::count());
        $this->assertSame(8, Penjualan::count());
        $this->assertSame(3, Penjualan::whereDate('tanggal', today())->count());
        Storage::disk('public')->assertExists('barangs/KP-001.jpg');

        // Stok akhir setiap barang harus sama dengan stok_sesudah pada mutasi terakhirnya
        Barang::all()->each(function (Barang $barang) {
            $this->assertSame($barang->stok, $barang->stokMutasis()->latest('id')->value('stok_sesudah'));
        });

        $this->assertSame(15, Barang::where('kode_barang', 'KP-001')->value('stok'));
    }

    public function test_seeder_demo_tidak_menggandakan_data_bila_dijalankan_ulang(): void
    {
        Storage::fake('public');

        $this->seed(DatabaseSeeder::class);
        $this->seed(DemoSeeder::class);
        $this->seed(DemoSeeder::class);

        $this->assertSame(11, Barang::count());
    }
}
