<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pemasok;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PemasokController extends Controller
{
    /**
     * Menampilkan pemasok. Parameter all=1 mengembalikan semua data (untuk pilihan dropdown).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pemasok::query()
            ->when($request->search, function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_pemasok', 'like', '%'.$search.'%')
                        ->orWhere('telepon', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('nama_pemasok');

        if ($request->boolean('all')) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate(10));
    }

    /**
     * Menambah pemasok.
     */
    public function store(Request $request): JsonResponse
    {
        $pemasok = Pemasok::create($this->validatePemasok($request));

        return response()->json([
            'message' => 'Pemasok berhasil ditambahkan',
            'data' => $pemasok,
        ], 201);
    }

    /**
     * Mengubah pemasok.
     */
    public function update(Request $request, Pemasok $pemasok): JsonResponse
    {
        $pemasok->update($this->validatePemasok($request));

        return response()->json([
            'message' => 'Pemasok berhasil diperbarui',
            'data' => $pemasok,
        ]);
    }

    /**
     * Menghapus pemasok yang belum memiliki transaksi pembelian.
     */
    public function destroy(Pemasok $pemasok): JsonResponse
    {
        if ($pemasok->pembelians()->exists()) {
            return response()->json([
                'message' => 'Pemasok sudah memiliki transaksi pembelian dan tidak dapat dihapus',
            ], 422);
        }

        $pemasok->delete();

        return response()->json([
            'message' => 'Pemasok berhasil dihapus',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePemasok(Request $request): array
    {
        return $request->validate([
            'nama_pemasok' => 'required|string|max:150',
            'telepon' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'alamat' => 'nullable|string',
        ]);
    }
}
