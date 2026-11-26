<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\StokMutasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StokController extends Controller
{
    /**
     * Menampilkan kartu stok (riwayat mutasi), dapat difilter barang dan tipe.
     */
    public function index(Request $request): JsonResponse
    {
        $mutasis = StokMutasi::query()
            ->with(['barang:id,kode_barang,nama_barang,satuan', 'user:id,name'])
            ->when($request->barang_id, fn ($q, $barangId) => $q->where('barang_id', $barangId))
            ->when($request->tipe, fn ($q, string $tipe) => $q->where('tipe', $tipe))
            ->latest('id')
            ->paginate(15);

        return response()->json($mutasis);
    }

    /**
     * Penyesuaian stok hasil stock opname.
     */
    public function penyesuaian(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'barang_id' => 'required|integer|exists:barangs,id',
            'stok_baru' => 'required|integer|min:0',
            'keterangan' => 'required|string|max:255',
        ]);

        $mutasi = DB::transaction(function () use ($validated, $request) {
            $barang = Barang::lockForUpdate()->findOrFail($validated['barang_id']);
            $selisih = $validated['stok_baru'] - $barang->stok;

            if ($selisih === 0) {
                throw ValidationException::withMessages([
                    'stok_baru' => 'Stok baru sama dengan stok saat ini.',
                ]);
            }

            return $barang->ubahStok($selisih, 'penyesuaian', $request->user()->id, null, $validated['keterangan']);
        });

        return response()->json([
            'message' => 'Penyesuaian stok berhasil disimpan',
            'data' => $mutasi->load('barang:id,kode_barang,nama_barang,stok,satuan'),
        ], 201);
    }
}
