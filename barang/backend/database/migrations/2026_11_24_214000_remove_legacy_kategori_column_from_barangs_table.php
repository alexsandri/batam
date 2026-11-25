<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('barangs')
            ->whereNotNull('kategori')
            ->where('kategori', '<>', '')
            ->orderBy('id')
            ->chunkById(100, function ($barangs): void {
                foreach ($barangs as $barang) {
                    if ($barang->kategori_id !== null) {
                        continue;
                    }

                    $name = trim($barang->kategori);

                    if ($name === '') {
                        continue;
                    }

                    $kategoriId = DB::table('kategoris')
                        ->where('name', $name)
                        ->value('id');

                    if ($kategoriId === null) {
                        $kategoriId = DB::table('kategoris')->insertGetId([
                            'name' => $name,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    DB::table('barangs')
                        ->where('id', $barang->id)
                        ->update(['kategori_id' => $kategoriId]);
                }
            });

        Schema::table('barangs', function (Blueprint $table): void {
            $table->dropColumn('kategori');
        });
    }

    public function down(): void
    {
        Schema::table('barangs', function (Blueprint $table): void {
            $table->string('kategori', 150)->nullable();
        });

        DB::table('barangs')
            ->whereNotNull('kategori_id')
            ->orderBy('id')
            ->chunkById(100, function ($barangs): void {
                foreach ($barangs as $barang) {
                    $name = DB::table('kategoris')
                        ->where('id', $barang->kategori_id)
                        ->value('name');

                    if ($name !== null) {
                        DB::table('barangs')
                            ->where('id', $barang->id)
                            ->update(['kategori' => $name]);
                    }
                }
            });
    }
};
