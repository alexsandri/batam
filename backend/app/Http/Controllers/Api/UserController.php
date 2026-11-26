<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Menampilkan daftar pengguna.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->search, function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('name')
            ->paginate(10, ['id', 'name', 'email', 'role', 'created_at']);

        return response()->json($users);
    }

    /**
     * Menambah pengguna.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:users,email',
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_KASIR])],
            'password' => 'required|string|min:8',
        ]);

        $user = User::create($validated);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan',
            'data' => $user->only(['id', 'name', 'email', 'role']),
        ], 201);
    }

    /**
     * Mengubah pengguna. Password hanya diganti bila diisi.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_KASIR])],
            'password' => 'nullable|string|min:8',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Pengguna berhasil diperbarui',
            'data' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    /**
     * Menghapus pengguna. Akun sendiri tidak boleh dihapus.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->is($user)) {
            return response()->json([
                'message' => 'Akun yang sedang dipakai tidak dapat dihapus',
            ], 422);
        }

        if ($user->penjualans()->exists() || $user->pembelians()->exists()) {
            return response()->json([
                'message' => 'Pengguna sudah memiliki transaksi dan tidak dapat dihapus',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus',
        ]);
    }
}
