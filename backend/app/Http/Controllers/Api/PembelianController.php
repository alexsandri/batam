<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Pemasok;
use App\Models\Pembelian;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembelianController extends Controller
{
    /**
     * Menampilkan riwayat pembelian, dapat difilter tanggal dan nomor faktur.
     */
    public function index(Request $request): JsonResponse
    {
        $pembelians = Pembelian::query()
            ->with(['pemasok:id,nama_pemasok', 'user:id,name'])
            ->withCount('details')
            ->when($request->search, fn ($q, string $search) => $q->where('no_faktur', 'like', '%'.$search.'%'))
            ->when($request->dari, fn ($q, string $dari) => $q->whereDate('tanggal', '>=', $dari))
            ->when($request->sampai, fn ($q, string $sampai) => $q->whereDate('tanggal', '<=', $sampai))
            ->latest('tanggal')
            ->latest('id')
            ->paginate(10);

        return response()->json($pembelians);
    }

    /**
     * Mencatat pembelian dari pemasok dan menambah stok barang.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pemasok_id' => 'required|integer|exists:pemasoks,id',
            'tanggal' => 'required|date',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|integer|distinct|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|numeric|min:0',
        ]);

        $pembelian = DB::transaction(function () use ($validated, $request) {
            $barangs = Barang::whereIn('id', array_column($validated['items'], 'barang_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $pemasok = Pemasok::findOrFail($validated['pemasok_id']);

            $pembelian = Pembelian::create([
                'no_faktur' => $this->nomorFaktur('PB', Pembelian::class, $validated['tanggal']),
                'pemasok_id' => $pemasok->id,
                'user_id' => $request->user()->id,
                'tanggal' => $validated['tanggal'],
                'catatan' => $validated['catatan'] ?? null,
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $barang = $barangs[$item['barang_id']];
                $subtotal = $item['jumlah'] * $item['harga_beli'];
                $total += $subtotal;

                $pembelian->details()->create([
                    'barang_id' => $barang->id,
                    'jumlah' => $item['jumlah'],
                    'harga_beli' => $item['harga_beli'],
                    'subtotal' => $subtotal,
                ]);

                $barang->harga_beli = $item['harga_beli'];
                $barang->ubahStok($item['jumlah'], 'masuk', $request->user()->id, $pembelian->no_faktur, 'Pembelian dari '.$pemasok->nama_pemasok);
            }

            $pembelian->update(['total' => $total]);

            return $pembelian;
        });

        return response()->json([
            'message' => 'Pembelian berhasil disimpan',
            'data' => $pembelian->load(['pemasok', 'user:id,name', 'details.barang:id,kode_barang,nama_barang,satuan']),
        ], 201);
    }

    /**
     * Menampilkan detail pembelian.
     */
    public function show(Pembelian $pembelian): JsonResponse
    {
        return response()->json([
            'data' => $pembelian->load(['pemasok', 'user:id,name', 'details.barang:id,kode_barang,nama_barang,satuan']),
        ]);
    }
}
