<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KategoriController extends Controller
{
    // Menampilkan semua kategori beserta jumlah barangnya
    public function index(Request $request)
    {
        $kategoris = Kategori::query()
            ->withCount('barangs')
            ->when($request->search, function ($query, $search) {
                $query->where('nama_kategori', 'like', '%' . $search . '%');
            })
            ->orderBy('nama_kategori')
            ->get();

        return response()->json(['data' => $kategoris]);
    }

    // Menyimpan kategori baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategoris,nama_kategori',
            'deskripsi' => 'nullable|string',
        ]);

        $kategori = Kategori::create($validated);

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $kategori->loadCount('barangs'),
        ], 201);
    }

    // Menampilkan detail kategori
    public function show($id)
    {
        $kategori = Kategori::withCount('barangs')->findOrFail($id);

        return response()->json(['data' => $kategori]);
    }

    // Mengubah kategori
    public function update(Request $request, $id)
    {
        $kategori = Kategori::findOrFail($id);

        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:100',
                Rule::unique('kategoris', 'nama_kategori')->ignore($kategori->id),
            ],
            'deskripsi' => 'nullable|string',
        ]);

        $kategori->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => $kategori->fresh()->loadCount('barangs'),
        ]);
    }

    // Menghapus kategori (ditolak jika masih dipakai barang)
    public function destroy($id)
    {
        $kategori = Kategori::withCount('barangs')->findOrFail($id);

        if ($kategori->barangs_count > 0) {
            return response()->json([
                'message' => "Kategori \"{$kategori->nama_kategori}\" masih dipakai oleh {$kategori->barangs_count} barang. Pindahkan barangnya ke kategori lain terlebih dahulu.",
            ], 422);
        }

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
