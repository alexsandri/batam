<?php

namespace Tests\Feature;

use App\Models\Barang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LaporanTest extends TestCase
{
    use RefreshDatabase;

    public function test_laporan_penjualan_menghitung_total_dalam_periode(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $kopi = Barang::factory()->create(['stok' => 50, 'harga_jual' => 20000]);
        $teh = Barang::factory()->create(['stok' => 50, 'harga_jual' => 10000]);

        $this->postJson('/api/penjualans', ['tanggal' => '2026-11-01', 'bayar' => 50000, 'items' => [['barang_id' => $kopi->id, 'jumlah' => 2]]]);
        $this->postJson('/api/penjualans', ['tanggal' => '2026-11-02', 'bayar' => 50000, 'items' => [['barang_id' => $kopi->id, 'jumlah' => 1], ['barang_id' => $teh->id, 'jumlah' => 1]]]);
        $this->postJson('/api/penjualans', ['tanggal' => '2026-12-01', 'bayar' => 50000, 'items' => [['barang_id' => $teh->id, 'jumlah' => 1]]]);

        $response = $this->getJson('/api/laporan/penjualan?dari=2026-11-01&sampai=2026-11-30');

        $response->assertOk()
            ->assertJsonPath('ringkasan.jumlah_transaksi', 2)
            ->assertJsonPath('ringkasan.jumlah_item', 4)
            ->assertJsonPath('ringkasan.total_penjualan', 70000)
            ->assertJsonCount(2, 'per_hari')
            ->assertJsonPath('barang_terlaris.0.barang_id', $kopi->id);
    }

    public function test_laporan_penjualan_menolak_periode_terbalik(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson('/api/laporan/penjualan?dari=2026-11-30&sampai=2026-11-01')
            ->assertStatus(422)->assertJsonValidationErrors('sampai');
    }

    public function test_laporan_persediaan_menghitung_nilai_dan_status_stok(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        Barang::factory()->create(['nama_barang' => 'A Kopi', 'stok' => 20, 'harga_beli' => 5000]);
        Barang::factory()->create(['nama_barang' => 'B Teh', 'stok' => 3, 'harga_beli' => 2000]);
        Barang::factory()->create(['nama_barang' => 'C Gula', 'stok' => 0, 'harga_beli' => 1000]);

        $response = $this->getJson('/api/laporan/persediaan?batas=5');

        $response->assertOk()
            ->assertJsonPath('ringkasan.jumlah_barang', 3)
            ->assertJsonPath('ringkasan.total_nilai', 106000)
            ->assertJsonPath('ringkasan.stok_menipis', 1)
            ->assertJsonPath('ringkasan.stok_habis', 1)
            ->assertJsonPath('data.0.status', 'Aman')
            ->assertJsonPath('data.1.status', 'Menipis')
            ->assertJsonPath('data.2.status', 'Habis');
    }
}
