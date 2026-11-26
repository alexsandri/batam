<?php

namespace Database\Factories;

use App\Models\Barang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Barang>
 */
class BarangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_barang' => fake()->unique()->bothify('BRG-####'),
            'nama_barang' => fake()->words(2, true),
            'kategori' => 'Umum',
            'deskripsi' => fake()->sentence(),
            'harga_beli' => 10000,
            'harga_jual' => 15000,
            'stok' => 20,
            'satuan' => 'pcs',
        ];
    }
}
