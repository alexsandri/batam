<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Penjualan;
use App\Models\PenjualanDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    /**
     * Laporan penjualan per periode: ringkasan, rekap harian, barang terlaris, dan daftar transaksi.
     */
    public function penjualan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'dari' => 'nullable|date',
            'sampai' => 'nullable|date|after_or_equal:dari',
        ]);

        $dari = $validated['dari'] ?? now()->startOfMonth()->toDateString();
        $sampai = $validated['sampai'] ?? now()->toDateString();

        $penjualans = Penjualan::query()
            ->with('user:id,name')
            ->withSum('details as jumlah_item', 'jumlah')
            ->whereDate('tanggal', '>=', $dari)
            ->whereDate('tanggal', '<=', $sampai)
            ->orderBy('tanggal')
            ->orderBy('id')
            ->get();

        $perHari = $penjualans
            ->groupBy(fn (Penjualan $penjualan) => $penjualan->tanggal->toDateString())
            ->map(fn ($items, string $tanggal) => [
                'tanggal' => $tanggal,
                'jumlah_transaksi' => $items->count(),
                'total' => (float) $items->sum('total'),
            ])
            ->values();

        $terlaris = PenjualanDetail::query()
            ->selectRaw('barang_id, SUM(jumlah) as jumlah, SUM(subtotal) as total')
            ->whereIn('penjualan_id', $penjualans->pluck('id'))
            ->groupBy('barang_id')
            ->orderByDesc('jumlah')
            ->limit(10)
            ->with('barang:id,kode_barang,nama_barang,satuan')
            ->get();

        return response()->json([
            'periode' => ['dari' => $dari, 'sampai' => $sampai],
            'ringkasan' => [
                'jumlah_transaksi' => $penjualans->count(),
                'jumlah_item' => (int) $penjualans->sum('jumlah_item'),
                'total_penjualan' => (float) $penjualans->sum('total'),
            ],
            'per_hari' => $perHari,
            'barang_terlaris' => $terlaris,
            'transaksi' => $penjualans,
        ]);
    }

    /**
     * Laporan persediaan: stok, nilai persediaan (stok x harga beli), dan status stok.
     */
    public function persediaan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batas' => 'nullable|integer|min:0',
            'kategori' => 'nullable|string',
        ]);

        $batas = $validated['batas'] ?? 10;

        $barangs = Barang::query()
            ->when($validated['kategori'] ?? null, fn ($q, string $kategori) => $q->where('kategori', $kategori))
            ->orderBy('nama_barang')
            ->get(['id', 'kode_barang', 'nama_barang', 'kategori', 'satuan', 'stok', 'harga_beli', 'harga_jual'])
            ->map(function (Barang $barang) use ($batas) {
                $barang->nilai_persediaan = $barang->stok * (float) $barang->harga_beli;
                $barang->status = match (true) {
                    $barang->stok <= 0 => 'Habis',
                    $barang->stok <= $batas => 'Menipis',
                    default => 'Aman',
                };

                return $barang;
            });

        return response()->json([
            'batas_menipis' => $batas,
            'ringkasan' => [
                'jumlah_barang' => $barangs->count(),
                'total_stok' => (int) $barangs->sum('stok'),
                'total_nilai' => (float) $barangs->sum('nilai_persediaan'),
                'stok_menipis' => $barangs->where('status', 'Menipis')->count(),
                'stok_habis' => $barangs->where('status', 'Habis')->count(),
            ],
            'data' => $barangs->values(),
        ]);
    }
}
