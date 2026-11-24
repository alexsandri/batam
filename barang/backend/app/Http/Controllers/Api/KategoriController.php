<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use App\Models\Kategori;

class KategoriController extends Controller
{
    // Menampilkan semua kategori
    public function index(Request $request)
    {
        $query = Kategori::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where(
                    'name',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        $kategoris = $query
            ->latest()
            ->paginate(10);

        $kategoris->through(function ($kategori) {
            return $this->formatKategori($kategori);
        });

        return response()->json($kategoris);
    }

    // Menyimpan barang
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150'
        ]);

       

        $kategori = Kategori::create($validated);

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $this->formatKategori($kategori)
        ], 201);
    }

    // Format data response
    private function formatKategori($kategori)
    {
        return [
            'id' => $kategori->id,
            'name' => $kategori->name,
            'created_at' => $kategori->created_at,
            'updated_at' => $kategori->updated_at
        ];
    }

    // Menampilkan detail kategori
    public function show($id)
    {
        $kategori = Kategori::findOrFail($id);

        return response()->json([
            'data' => $this->formatKategori($kategori)
        ]);
    }

    // Mengubah kategori
    public function update(Request $request, $id)
    {
        $kategori = Kategori::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:150'
        ]);

        $kategori->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => $this->formatKategori($kategori)
        ]);
    }

    // Menghapus kategori
    public function destroy($id)
    {
        $kategori = Kategori::findOrFail($id);

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus'
        ]);
    }


}