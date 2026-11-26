<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KategoriController extends Controller
{
    /**
     * Menampilkan kategori. Parameter all=1 mengembalikan semua data (untuk pilihan dropdown).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Kategori::query()
            ->when($request->search, fn ($q, string $search) => $q->where('nama_kategori', 'like', '%'.$search.'%'))
            ->orderBy('nama_kategori');

        if ($request->boolean('all')) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate(10));
    }

    /**
     * Menambah kategori.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:150|unique:kategoris,nama_kategori',
        ]);

        $kategori = Kategori::create($validated);

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $kategori,
        ], 201);
    }

    /**
     * Mengubah kategori. Barang yang memakai nama lama ikut diperbarui.
     */
    public function update(Request $request, Kategori $kategori): JsonResponse
    {
        $validated = $request->validate([
            'nama_kategori' => ['required', 'string', 'max:150', Rule::unique('kategoris', 'nama_kategori')->ignore($kategori->id)],
        ]);

        Barang::where('kategori', $kategori->nama_kategori)->update(['kategori' => $validated['nama_kategori']]);
        $kategori->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => $kategori,
        ]);
    }

    /**
     * Menghapus kategori yang tidak dipakai barang.
     */
    public function destroy(Kategori $kategori): JsonResponse
    {
        if (Barang::where('kategori', $kategori->nama_kategori)->exists()) {
            return response()->json([
                'message' => 'Kategori masih dipakai oleh barang dan tidak dapat dihapus',
            ], 422);
        }

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
