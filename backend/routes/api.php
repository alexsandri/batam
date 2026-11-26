<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\PemasokController;
use App\Http\Controllers\Api\PembelianController;
use App\Http\Controllers\Api\PenjualanController;
use App\Http\Controllers\Api\StokController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin dan kasir: lihat master data, transaksi penjualan, kartu stok
    Route::apiResource('barangs', BarangController::class)->only(['index', 'show']);
    Route::apiResource('kategoris', KategoriController::class)->only(['index']);
    Route::apiResource('penjualans', PenjualanController::class)->only(['index', 'store', 'show']);
    Route::get('/stok', [StokController::class, 'index']);

    // Khusus admin
    Route::middleware('admin')->group(function () {
        Route::apiResource('barangs', BarangController::class)->except(['index', 'show']);
        Route::apiResource('kategoris', KategoriController::class)->except(['index', 'show']);
        Route::apiResource('pemasoks', PemasokController::class)->except(['show']);
        Route::apiResource('pembelians', PembelianController::class)->only(['index', 'store', 'show']);
        Route::apiResource('users', UserController::class)->except(['show']);
        Route::post('/stok/penyesuaian', [StokController::class, 'penyesuaian']);
        Route::get('/laporan/penjualan', [LaporanController::class, 'penjualan']);
        Route::get('/laporan/persediaan', [LaporanController::class, 'persediaan']);
    });
});
