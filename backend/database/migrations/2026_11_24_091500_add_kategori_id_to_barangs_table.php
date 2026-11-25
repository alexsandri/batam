<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tambah kolom relasi ke tabel kategoris
        Schema::table('barangs', function (Blueprint $table) {
            $table->foreignId('kategori_id')
                ->nullable()
                ->after('nama_barang')
                ->constrained('kategoris')
                ->restrictOnDelete();
        });

        // 2. Pindahkan isi kolom teks "kategori" lama ke tabel kategoris
        $namaKategori = DB::table('barangs')
            ->whereNotNull('kategori')
            ->where('kategori', '!=', '')
            ->distinct()
            ->pluck('kategori');

        foreach ($namaKategori as $nama) {
            $id = DB::table('kategoris')->insertGetId([
                'nama_kategori' => $nama,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('barangs')
                ->where('kategori', $nama)
                ->update(['kategori_id' => $id]);
        }

        // 3. Hapus kolom teks lama
        Schema::table('barangs', function (Blueprint $table) {
            $table->dropColumn('kategori');
        });
    }

    public function down(): void
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->string('kategori', 100)->nullable()->after('nama_barang');
        });

        DB::table('barangs')
            ->join('kategoris', 'kategoris.id', '=', 'barangs.kategori_id')
            ->update(['barangs.kategori' => DB::raw('kategoris.nama_kategori')]);

        Schema::table('barangs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kategori_id');
        });
    }
};
