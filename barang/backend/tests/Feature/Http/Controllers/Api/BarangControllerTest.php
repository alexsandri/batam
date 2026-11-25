<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class BarangControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_create_barang_returns_its_category_name(): void
    {
        $kategori = Kategori::create(['name' => 'Minuman']);

        $response = $this->postJson('/api/barangs', [
            'kode_barang' => 'MIN-001',
            'nama_barang' => 'Teh',
            'kategori_id' => $kategori->id,
            'harga_beli' => 1000,
            'harga_jual' => 2000,
            'stok' => 10,
            'satuan' => 'pcs',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.kategori_id', $kategori->id)
            ->assertJsonPath('data.kategori', 'Minuman');

        $this->getJson('/api/barangs')
            ->assertOk()
            ->assertJsonPath('data.0.kategori', 'Minuman');

        $this->assertDatabaseHas('barangs', [
            'kode_barang' => 'MIN-001',
            'kategori_id' => $kategori->id,
        ]);
    }

    public function test_legacy_category_name_is_preserved_in_the_category_relation(): void
    {
        Schema::table('barangs', function ($table): void {
            $table->string('kategori', 100)->nullable();
        });

        $barang = Barang::create([
            'kode_barang' => 'MAK-001',
            'nama_barang' => 'Roti',
            'harga_beli' => 1000,
            'harga_jual' => 2000,
            'stok' => 5,
            'satuan' => 'pcs',
        ]);

        DB::table('barangs')
            ->where('id', $barang->id)
            ->update(['kategori' => 'Makanan']);

        $migration = require base_path('database/migrations/2026_11_24_214000_remove_legacy_kategori_column_from_barangs_table.php');
        $migration->up();

        $kategoriId = DB::table('kategoris')
            ->where('name', 'Makanan')
            ->value('id');

        $this->assertDatabaseHas('kategoris', ['name' => 'Makanan']);
        $this->assertDatabaseHas('barangs', [
            'id' => $barang->id,
            'kategori_id' => $kategoriId,
        ]);
        $this->assertSame(
            'Makanan',
            Barang::with('kategori')->findOrFail($barang->id)->kategori->name
        );
    }
}
