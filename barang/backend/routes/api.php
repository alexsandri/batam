<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route tanpa autentikasi
Route::post('/login', [AuthController::class, 'login']);

// Route yang membutuhkan autentikasi
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    // Tambahkan route barang dan kategori di dalam
    // group ini jika ingin membatasi akses hanya untuk user login.
    Route::apiResource('barangs', BarangController::class);
    Route::apiResource('kategoris', KategoriController::class);

});