<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Riwayat setiap perubahan stok (kartu stok)
        Schema::create('stok_mutasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_id')->constrained('barangs')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tipe', 20); // masuk | keluar | penyesuaian
            $table->integer('jumlah'); // positif = tambah, negatif = kurang
            $table->integer('stok_sebelum');
            $table->integer('stok_sesudah');
            $table->string('referensi', 40)->nullable(); // no_faktur transaksi
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_mutasis');
    }
};
