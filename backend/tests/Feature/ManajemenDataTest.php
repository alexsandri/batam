<?php

namespace Tests\Feature;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Pemasok;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ManajemenDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_kasir_tidak_dapat_mengakses_fitur_admin(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/users')->assertForbidden();
        $this->getJson('/api/pemasoks')->assertForbidden();
        $this->getJson('/api/pembelians')->assertForbidden();
        $this->getJson('/api/laporan/penjualan')->assertForbidden();
        $this->postJson('/api/barangs', [])->assertForbidden();
        $this->postJson('/api/kategoris', ['nama_kategori' => 'Minuman'])->assertForbidden();
    }

    public function test_kasir_dapat_melihat_barang_dan_kategori(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Barang::factory()->create();

        $this->getJson('/api/barangs')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/kategoris?all=1')->assertOk();
    }

    public function test_admin_mengelola_pengguna(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $id = $this->postJson('/api/users', [
            'name' => 'Kasir Satu',
            'email' => 'kasir1@pos.test',
            'role' => 'kasir',
            'password' => 'password123',
        ])->assertCreated()->json('data.id');

        $this->putJson("/api/users/$id", [
            'name' => 'Kasir Utama',
            'email' => 'kasir1@pos.test',
            'role' => 'kasir',
        ])->assertOk();

        $this->assertDatabaseHas('users', ['id' => $id, 'name' => 'Kasir Utama']);
        $this->deleteJson("/api/users/{$admin->id}")->assertStatus(422);
        $this->deleteJson("/api/users/$id")->assertOk();
    }

    public function test_admin_mengelola_kategori_dan_nama_baru_ikut_ke_barang(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $id = $this->postJson('/api/kategoris', ['nama_kategori' => 'Minuman'])->assertCreated()->json('data.id');
        $this->postJson('/api/kategoris', ['nama_kategori' => 'Minuman'])->assertStatus(422);

        $barang = Barang::factory()->create(['kategori' => 'Minuman']);
        $this->putJson("/api/kategoris/$id", ['nama_kategori' => 'Minuman Dingin'])->assertOk();

        $this->assertSame('Minuman Dingin', $barang->fresh()->kategori);
        $this->deleteJson("/api/kategoris/$id")->assertStatus(422);

        $barang->update(['kategori' => 'Lain']);
        $this->deleteJson("/api/kategoris/$id")->assertOk();
    }

    public function test_admin_mengelola_pemasok(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $id = $this->postJson('/api/pemasoks', [
            'nama_pemasok' => 'CV Sumber Kopi',
            'telepon' => '081234567890',
        ])->assertCreated()->json('data.id');

        $this->postJson('/api/pemasoks', ['nama_pemasok' => '', 'email' => 'bukan-email'])
            ->assertJsonValidationErrors([
                'nama_pemasok' => 'Nama pemasok wajib diisi.',
                'email' => 'Email harus berupa alamat email yang valid.',
            ]);
        $this->putJson("/api/pemasoks/$id", ['nama_pemasok' => 'CV Sumber Kopi Nusantara'])->assertOk();
        $this->getJson('/api/pemasoks?search=Nusantara')->assertJsonCount(1, 'data');
        $this->deleteJson("/api/pemasoks/$id")->assertOk();
    }

    public function test_stok_awal_barang_tercatat_di_kartu_stok(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $id = $this->postJson('/api/barangs', [
            'kode_barang' => 'BRG001',
            'nama_barang' => 'Kopi Arabica',
            'kategori' => 'Bahan Baku',
            'harga_beli' => 50000,
            'harga_jual' => 75000,
            'stok' => 20,
            'satuan' => 'pcs',
        ])->assertCreated()->json('data.id');

        $this->assertDatabaseHas('barangs', ['id' => $id, 'stok' => 20]);
        $this->assertDatabaseHas('stok_mutasis', ['barang_id' => $id, 'tipe' => 'masuk', 'jumlah' => 20, 'stok_sesudah' => 20]);
    }

    public function test_pemasok_dengan_pembelian_tidak_dapat_dihapus(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $pemasok = Pemasok::factory()->create();
        $barang = Barang::factory()->create();

        $this->postJson('/api/pembelians', [
            'pemasok_id' => $pemasok->id,
            'tanggal' => '2026-11-26',
            'items' => [['barang_id' => $barang->id, 'jumlah' => 1, 'harga_beli' => 10000]],
        ])->assertCreated();

        $this->deleteJson("/api/pemasoks/{$pemasok->id}")->assertStatus(422);
        $this->deleteJson("/api/barangs/{$barang->id}")->assertStatus(422);
        $this->assertModelExists(Kategori::factory()->create());
    }
}
