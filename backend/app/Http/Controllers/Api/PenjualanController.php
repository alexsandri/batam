<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Penjualan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PenjualanController extends Controller
{
    /**
     * Menampilkan riwayat penjualan. Kasir hanya melihat transaksinya sendiri.
     */
    public function index(Request $request): JsonResponse
    {
        $penjualans = Penjualan::query()
            ->with('user:id,name')
            ->withCount('details')
            ->when(! $request->user()->isAdmin(), fn ($q) => $q->where('user_id', $request->user()->id))
            ->when($request->search, fn ($q, string $search) => $q->where('no_faktur', 'like', '%'.$search.'%'))
            ->when($request->dari, fn ($q, string $dari) => $q->whereDate('tanggal', '>=', $dari))
            ->when($request->sampai, fn ($q, string $sampai) => $q->whereDate('tanggal', '<=', $sampai))
            ->latest('tanggal')
            ->latest('id')
            ->paginate(10);

        return response()->json($penjualans);
    }

    /**
     * Mencatat penjualan (kasir) dan mengurangi stok barang.
     *
     * Harga diambil dari data barang di server, bukan dari request.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tanggal' => 'nullable|date',
            'bayar' => 'required|numeric|min:0',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|integer|distinct|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        $tanggal = $validated['tanggal'] ?? now()->toDateString();

        $penjualan = DB::transaction(function () use ($validated, $request, $tanggal) {
            $barangs = Barang::whereIn('id', array_column($validated['items'], 'barang_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $total = 0;
            $errors = [];

            foreach ($validated['items'] as $index => $item) {
                $barang = $barangs[$item['barang_id']];

                if ($barang->stok < $item['jumlah']) {
                    $errors["items.$index.jumlah"] = "Stok {$barang->nama_barang} tidak cukup (tersisa {$barang->stok}).";
                }

                $total += $item['jumlah'] * $barang->harga_jual;
            }

            if ($errors) {
                throw ValidationException::withMessages($errors);
            }

            if ($validated['bayar'] < $total) {
                throw ValidationException::withMessages([
                    'bayar' => 'Jumlah bayar kurang dari total belanja.',
                ]);
            }

            $penjualan = Penjualan::create([
                'no_faktur' => $this->nomorFaktur('PJ', Penjualan::class, $tanggal),
                'user_id' => $request->user()->id,
                'tanggal' => $tanggal,
                'total' => $total,
                'bayar' => $validated['bayar'],
                'kembalian' => $validated['bayar'] - $total,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $barang = $barangs[$item['barang_id']];

                $penjualan->details()->create([
                    'barang_id' => $barang->id,
                    'jumlah' => $item['jumlah'],
                    'harga_jual' => $barang->harga_jual,
                    'subtotal' => $item['jumlah'] * $barang->harga_jual,
                ]);

                $barang->ubahStok(-$item['jumlah'], 'keluar', $request->user()->id, $penjualan->no_faktur, 'Penjualan');
            }

            return $penjualan;
        });

        return response()->json([
            'message' => 'Penjualan berhasil disimpan',
            'data' => $penjualan->load(['user:id,name', 'details.barang:id,kode_barang,nama_barang,satuan']),
        ], 201);
    }

    /**
     * Menampilkan detail penjualan (struk).
     */
    public function show(Request $request, Penjualan $penjualan): JsonResponse
    {
        if (! $request->user()->isAdmin() && $penjualan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return response()->json([
            'data' => $penjualan->load(['user:id,name', 'details.barang:id,kode_barang,nama_barang,satuan']),
        ]);
    }
}
