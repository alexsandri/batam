<?php

namespace Tests\Feature;

use App\Models\Barang;
use App\Models\Pemasok;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransaksiTest extends TestCase
{
    use RefreshDatabase;

    public function test_pembelian_menambah_stok_dan_memperbarui_harga_beli(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $pemasok = Pemasok::factory()->create();
        $barang = Barang::factory()->create(['stok' => 5, 'harga_beli' => 10000]);

        $response = $this->postJson('/api/pembelians', [
            'pemasok_id' => $pemasok->id,
            'tanggal' => '2026-11-26',
            'items' => [['barang_id' => $barang->id, 'jumlah' => 10, 'harga_beli' => 12000]],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.no_faktur', 'PB-20261126-0001')
            ->assertJsonPath('data.total', '120000.00');

        $this->assertSame(15, $barang->fresh()->stok);
        $this->assertSame('12000.00', $barang->fresh()->harga_beli);
        $this->assertDatabaseHas('stok_mutasis', [
            'barang_id' => $barang->id,
            'tipe' => 'masuk',
            'jumlah' => 10,
            'stok_sebelum' => 5,
            'stok_sesudah' => 15,
            'referensi' => 'PB-20261126-0001',
        ]);
    }

    public function test_kasir_menjual_barang_stok_berkurang_dan_kembalian_dihitung(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $kopi = Barang::factory()->create(['stok' => 10, 'harga_jual' => 25000]);
        $teh = Barang::factory()->create(['stok' => 3, 'harga_jual' => 15000]);

        $response = $this->postJson('/api/penjualans', [
            'tanggal' => '2026-11-26',
            'bayar' => 100000,
            'items' => [
                ['barang_id' => $kopi->id, 'jumlah' => 2],
                ['barang_id' => $teh->id, 'jumlah' => 1],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.no_faktur', 'PJ-20261126-0001')
            ->assertJsonPath('data.total', '65000.00')
            ->assertJsonPath('data.kembalian', '35000.00');

        $this->assertSame(8, $kopi->fresh()->stok);
        $this->assertSame(2, $teh->fresh()->stok);
        $this->assertDatabaseHas('stok_mutasis', ['barang_id' => $kopi->id, 'tipe' => 'keluar', 'jumlah' => -2]);
    }

    public function test_harga_jual_diambil_dari_server_bukan_dari_request(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $barang = Barang::factory()->create(['stok' => 10, 'harga_jual' => 25000]);

        $this->postJson('/api/penjualans', [
            'bayar' => 25000,
            'items' => [['barang_id' => $barang->id, 'jumlah' => 1, 'harga_jual' => 1]],
        ])->assertCreated()->assertJsonPath('data.total', '25000.00');
    }

    public function test_penjualan_ditolak_bila_stok_tidak_cukup_dan_stok_tidak_berubah(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $barang = Barang::factory()->create(['stok' => 2, 'harga_jual' => 10000]);

        $this->postJson('/api/penjualans', [
            'bayar' => 100000,
            'items' => [['barang_id' => $barang->id, 'jumlah' => 5]],
        ])->assertStatus(422)->assertJsonValidationErrors('items.0.jumlah');

        $this->assertSame(2, $barang->fresh()->stok);
        $this->assertDatabaseCount('penjualans', 0);
    }

    public function test_penjualan_ditolak_bila_bayar_kurang(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $barang = Barang::factory()->create(['stok' => 5, 'harga_jual' => 10000]);

        $this->postJson('/api/penjualans', [
            'bayar' => 5000,
            'items' => [['barang_id' => $barang->id, 'jumlah' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors('bayar');
    }

    public function test_nomor_faktur_berurutan_dalam_satu_hari(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $barang = Barang::factory()->create(['stok' => 10, 'harga_jual' => 1000]);
        $data = ['tanggal' => '2026-11-26', 'bayar' => 1000, 'items' => [['barang_id' => $barang->id, 'jumlah' => 1]]];

        $this->postJson('/api/penjualans', $data)->assertJsonPath('data.no_faktur', 'PJ-20261126-0001');
        $this->postJson('/api/penjualans', $data)->assertJsonPath('data.no_faktur', 'PJ-20261126-0002');
    }

    public function test_kasir_hanya_melihat_penjualannya_sendiri(): void
    {
        $barang = Barang::factory()->create(['stok' => 10, 'harga_jual' => 1000]);
        $data = ['bayar' => 1000, 'items' => [['barang_id' => $barang->id, 'jumlah' => 1]]];

        Sanctum::actingAs(User::factory()->create());
        $idLain = $this->postJson('/api/penjualans', $data)->json('data.id');

        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/penjualans', $data)->assertCreated();

        $this->getJson('/api/penjualans')->assertJsonCount(1, 'data');
        $this->getJson("/api/penjualans/$idLain")->assertForbidden();
    }

    public function test_admin_menyesuaikan_stok_hasil_opname(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $barang = Barang::factory()->create(['stok' => 10]);

        $this->postJson('/api/stok/penyesuaian', [
            'barang_id' => $barang->id,
            'stok_baru' => 7,
            'keterangan' => 'Stock opname November',
        ])->assertCreated()->assertJsonPath('data.jumlah', -3);

        $this->assertSame(7, $barang->fresh()->stok);

        $this->postJson('/api/stok/penyesuaian', [
            'barang_id' => $barang->id,
            'stok_baru' => 7,
            'keterangan' => 'Tidak berubah',
        ])->assertStatus(422);

        $this->getJson("/api/stok?barang_id={$barang->id}")->assertJsonCount(1, 'data');
    }
}
