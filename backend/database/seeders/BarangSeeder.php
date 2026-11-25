<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Database\Seeder;

class BarangSeeder extends Seeder
{
    /**
     * Mengisi 100 data barang contoh untuk POS Cafe & Restoran.
     * Aman dijalankan berulang (berdasarkan kode_barang).
     */
    public function run(): void
    {
        // [nama, kategori, satuan, harga_beli, harga_jual]
        $menu = [
            ['Kopi Arabica Gayo', 'Bahan Baku', 'kg', 180000, 250000],
            ['Kopi Robusta Lampung', 'Bahan Baku', 'kg', 120000, 170000],
            ['Susu Full Cream', 'Bahan Baku', 'liter', 18000, 24000],
            ['Gula Aren Cair', 'Bahan Baku', 'liter', 35000, 48000],
            ['Gula Pasir', 'Bahan Baku', 'kg', 15000, 19000],
            ['Teh Melati', 'Bahan Baku', 'box', 22000, 30000],
            ['Bubuk Coklat', 'Bahan Baku', 'kg', 95000, 130000],
            ['Matcha Powder', 'Bahan Baku', 'kg', 280000, 360000],
            ['Sirup Vanilla', 'Bahan Baku', 'liter', 85000, 110000],
            ['Sirup Caramel', 'Bahan Baku', 'liter', 85000, 110000],
            ['Sirup Hazelnut', 'Bahan Baku', 'liter', 90000, 115000],
            ['Whipped Cream', 'Bahan Baku', 'liter', 60000, 80000],
            ['Es Batu Kristal', 'Bahan Baku', 'kg', 3000, 5000],
            ['Beras Premium', 'Bahan Baku', 'kg', 14000, 17000],
            ['Telur Ayam', 'Bahan Baku', 'kg', 27000, 32000],
            ['Daging Ayam Fillet', 'Bahan Baku', 'kg', 48000, 60000],
            ['Daging Sapi Has', 'Bahan Baku', 'kg', 135000, 165000],
            ['Minyak Goreng', 'Bahan Baku', 'liter', 16000, 20000],
            ['Tepung Terigu', 'Bahan Baku', 'kg', 11000, 14000],
            ['Mentega', 'Bahan Baku', 'kg', 70000, 90000],
            ['Keju Cheddar', 'Bahan Baku', 'kg', 110000, 140000],
            ['Saus Sambal', 'Bahan Baku', 'liter', 25000, 33000],
            ['Kecap Manis', 'Bahan Baku', 'liter', 28000, 36000],
            ['Mie Telur', 'Bahan Baku', 'kg', 20000, 26000],
            ['Kentang Beku', 'Bahan Baku', 'kg', 32000, 42000],

            ['Espresso', 'Minuman Kopi', 'pcs', 6000, 18000],
            ['Americano', 'Minuman Kopi', 'pcs', 7000, 22000],
            ['Cappuccino', 'Minuman Kopi', 'pcs', 9000, 28000],
            ['Cafe Latte', 'Minuman Kopi', 'pcs', 9000, 28000],
            ['Kopi Susu Gula Aren', 'Minuman Kopi', 'pcs', 8000, 25000],
            ['Caramel Macchiato', 'Minuman Kopi', 'pcs', 11000, 32000],
            ['Mocha Latte', 'Minuman Kopi', 'pcs', 11000, 32000],
            ['Vanilla Latte', 'Minuman Kopi', 'pcs', 10000, 30000],
            ['Hazelnut Latte', 'Minuman Kopi', 'pcs', 10000, 30000],
            ['Kopi Tubruk', 'Minuman Kopi', 'pcs', 4000, 15000],
            ['V60 Manual Brew', 'Minuman Kopi', 'pcs', 12000, 35000],
            ['Cold Brew', 'Minuman Kopi', 'pcs', 10000, 30000],
            ['Affogato', 'Minuman Kopi', 'pcs', 12000, 33000],
            ['Kopi Tarik', 'Minuman Kopi', 'pcs', 7000, 22000],
            ['Flat White', 'Minuman Kopi', 'pcs', 9000, 28000],

            ['Matcha Latte', 'Minuman Non Kopi', 'pcs', 11000, 30000],
            ['Chocolate Ice', 'Minuman Non Kopi', 'pcs', 9000, 27000],
            ['Red Velvet Latte', 'Minuman Non Kopi', 'pcs', 10000, 28000],
            ['Teh Tarik', 'Minuman Non Kopi', 'pcs', 5000, 18000],
            ['Es Teh Manis', 'Minuman Non Kopi', 'pcs', 2000, 8000],
            ['Lemon Tea', 'Minuman Non Kopi', 'pcs', 4000, 15000],
            ['Lychee Tea', 'Minuman Non Kopi', 'pcs', 6000, 20000],
            ['Thai Tea', 'Minuman Non Kopi', 'pcs', 6000, 20000],
            ['Jus Alpukat', 'Minuman Non Kopi', 'pcs', 8000, 22000],
            ['Jus Jeruk', 'Minuman Non Kopi', 'pcs', 6000, 18000],
            ['Jus Mangga', 'Minuman Non Kopi', 'pcs', 7000, 20000],
            ['Jus Semangka', 'Minuman Non Kopi', 'pcs', 5000, 16000],
            ['Air Mineral 600ml', 'Minuman Non Kopi', 'pcs', 2500, 6000],
            ['Soda Gembira', 'Minuman Non Kopi', 'pcs', 6000, 18000],
            ['Wedang Jahe', 'Minuman Non Kopi', 'pcs', 4000, 15000],

            ['Nasi Goreng Spesial', 'Makanan', 'pcs', 12000, 32000],
            ['Nasi Goreng Seafood', 'Makanan', 'pcs', 16000, 38000],
            ['Mie Goreng Jawa', 'Makanan', 'pcs', 10000, 28000],
            ['Mie Rebus', 'Makanan', 'pcs', 9000, 26000],
            ['Kwetiau Goreng', 'Makanan', 'pcs', 12000, 30000],
            ['Ayam Geprek', 'Makanan', 'pcs', 11000, 27000],
            ['Ayam Bakar Madu', 'Makanan', 'pcs', 16000, 38000],
            ['Ayam Penyet', 'Makanan', 'pcs', 13000, 30000],
            ['Sate Ayam', 'Makanan', 'pcs', 15000, 35000],
            ['Soto Ayam', 'Makanan', 'pcs', 10000, 25000],
            ['Rawon Daging', 'Makanan', 'pcs', 20000, 42000],
            ['Gulai Kambing', 'Makanan', 'pcs', 25000, 48000],
            ['Spaghetti Bolognese', 'Makanan', 'pcs', 18000, 42000],
            ['Spaghetti Carbonara', 'Makanan', 'pcs', 19000, 44000],
            ['Beef Burger', 'Makanan', 'pcs', 22000, 45000],
            ['Chicken Burger', 'Makanan', 'pcs', 16000, 38000],
            ['Chicken Katsu', 'Makanan', 'pcs', 15000, 36000],
            ['Chicken Teriyaki', 'Makanan', 'pcs', 16000, 38000],
            ['Beef Steak', 'Makanan', 'pcs', 45000, 95000],
            ['Nasi Lemak', 'Makanan', 'pcs', 12000, 30000],
            ['Gado-Gado', 'Makanan', 'pcs', 9000, 24000],
            ['Ikan Bakar Batam', 'Makanan', 'pcs', 30000, 65000],
            ['Gonggong Rebus', 'Makanan', 'pcs', 28000, 60000],
            ['Otak-Otak Ikan', 'Makanan', 'pcs', 12000, 28000],
            ['Mie Lendir', 'Makanan', 'pcs', 10000, 25000],

            ['Kentang Goreng', 'Snack', 'pcs', 7000, 20000],
            ['Pisang Goreng Keju', 'Snack', 'pcs', 6000, 18000],
            ['Roti Bakar Coklat', 'Snack', 'pcs', 6000, 18000],
            ['Cireng Rujak', 'Snack', 'pcs', 5000, 15000],
            ['Tahu Crispy', 'Snack', 'pcs', 5000, 15000],
            ['Dimsum Ayam', 'Snack', 'pcs', 9000, 24000],
            ['Onion Rings', 'Snack', 'pcs', 8000, 22000],
            ['Chicken Wings', 'Snack', 'pcs', 14000, 32000],
            ['Croissant Butter', 'Snack', 'pcs', 9000, 22000],
            ['Donat Gula', 'Snack', 'pcs', 3000, 9000],

            ['Brownies Coklat', 'Dessert', 'pcs', 8000, 22000],
            ['Cheesecake', 'Dessert', 'pcs', 14000, 35000],
            ['Tiramisu', 'Dessert', 'pcs', 15000, 36000],
            ['Pancake Madu', 'Dessert', 'pcs', 9000, 25000],
            ['Es Krim Vanilla', 'Dessert', 'pcs', 6000, 18000],
            ['Pudding Coklat', 'Dessert', 'pcs', 5000, 15000],

            ['Cup Plastik 16oz', 'Perlengkapan', 'box', 45000, 60000],
            ['Sedotan Kertas', 'Perlengkapan', 'box', 30000, 42000],
            ['Paper Bag Kecil', 'Perlengkapan', 'box', 55000, 72000],
            ['Tisu Makan', 'Perlengkapan', 'box', 25000, 35000],
        ];

        foreach ($menu as $i => [$nama, $kategori, $satuan, $beli, $jual]) {
            $kode = 'BRG' . str_pad($i + 1, 3, '0', STR_PAD_LEFT);

            // Buat kategori jika belum ada
            $kategoriModel = Kategori::firstOrCreate(['nama_kategori' => $kategori]);

            Barang::updateOrCreate(
                ['kode_barang' => $kode],
                [
                    'nama_barang' => $nama,
                    'kategori_id' => $kategoriModel->id,
                    'deskripsi' => "$nama untuk kebutuhan cafe dan restoran.",
                    'harga_beli' => $beli,
                    'harga_jual' => $jual,
                    'stok' => fake()->numberBetween(0, 150),
                    'satuan' => $satuan,
                ]
            );
        }
    }
}
