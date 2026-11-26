# Dokumentasi Aplikasi Manajemen Inventaris dan Penjualan Barang (POS Sederhana)

Pengembangan lanjutan dari modul praktikum CRUD Data Barang (Laravel 13 + React + Tailwind CSS).

## 1. Fitur

| No | Fitur | Halaman | Peran |
|---|---|---|---|
| 1 | Login dan manajemen pengguna | Login, Pengguna | Semua (login), Admin (pengguna) |
| 2 | Manajemen data barang | Data Barang | Admin (ubah), Kasir (lihat) |
| 3 | Manajemen kategori barang | Kategori | Admin |
| 4 | Manajemen pemasok | Pemasok | Admin |
| 5 | Transaksi pembelian barang | Pembelian | Admin |
| 6 | Transaksi penjualan barang | Penjualan (Kasir) | Admin, Kasir |
| 7 | Pengelolaan stok barang | Stok Barang | Admin (penyesuaian), Kasir (lihat) |
| 8 | Laporan penjualan | Laporan Penjualan | Admin |
| 9 | Laporan persediaan | Laporan Persediaan | Admin |
| 10 | Pengujian dan dokumentasi | Folder `backend/tests`, dokumen ini | - |

## 2. Peran dan hak akses

| Kemampuan | Admin | Kasir |
|---|---|---|
| Login, logout, melihat profil | Ya | Ya |
| Melihat barang, kategori, posisi stok, kartu stok | Ya | Ya |
| Transaksi penjualan | Ya | Ya (hanya melihat transaksinya sendiri) |
| Tambah, ubah, hapus barang dan kategori | Ya | Tidak |
| Pemasok dan transaksi pembelian | Ya | Tidak |
| Penyesuaian stok (stock opname) | Ya | Tidak |
| Laporan penjualan dan persediaan, dashboard | Ya | Tidak |
| Manajemen pengguna | Ya | Tidak |

Autentikasi memakai token Laravel Sanctum. Endpoint admin dilindungi middleware `admin` (`app/Http/Middleware/EnsureUserIsAdmin.php`), yang membalas `403` untuk peran lain.

## 3. Skema database

| Tabel | Fungsi | Kolom utama |
|---|---|---|
| `users` | Akun pengguna | `name`, `email`, `role` (admin/kasir), `password` |
| `barangs` | Data barang (dari modul) | `kode_barang`, `nama_barang`, `kategori`, `harga_beli`, `harga_jual`, `stok`, `satuan`, `gambar` |
| `kategoris` | Kategori barang | `nama_kategori` |
| `pemasoks` | Pemasok | `nama_pemasok`, `telepon`, `email`, `alamat` |
| `pembelians` | Header pembelian | `no_faktur` (PB-YYYYMMDD-NNNN), `pemasok_id`, `user_id`, `tanggal`, `total` |
| `pembelian_details` | Rincian pembelian | `pembelian_id`, `barang_id`, `jumlah`, `harga_beli`, `subtotal` |
| `penjualans` | Header penjualan | `no_faktur` (PJ-YYYYMMDD-NNNN), `user_id`, `tanggal`, `total`, `bayar`, `kembalian` |
| `penjualan_details` | Rincian penjualan | `penjualan_id`, `barang_id`, `jumlah`, `harga_jual`, `subtotal` |
| `stok_mutasis` | Kartu stok | `barang_id`, `tipe` (masuk/keluar/penyesuaian), `jumlah`, `stok_sebelum`, `stok_sesudah`, `referensi` |

Kolom `barangs.kategori` tetap berupa teks seperti di modul. Pilihannya diambil dari tabel `kategoris`, dan nama kategori yang diubah ikut diperbarui pada barang.

## 4. Aturan bisnis

- Setiap perubahan stok dicatat di `stok_mutasis` melalui `Barang::ubahStok()`: stok awal barang baru, pembelian (masuk), penjualan (keluar), penyesuaian stock opname, dan perubahan stok lewat form barang.
- Pembelian menambah stok dan memperbarui `harga_beli` barang ke harga pembelian terakhir.
- Penjualan memakai `harga_jual` dari database, bukan dari request. Penjualan ditolak (422) bila stok tidak cukup atau pembayaran kurang dari total, dan stok tidak berubah.
- Transaksi berjalan di dalam `DB::transaction` dengan penguncian baris barang (`lockForUpdate`).
- Barang, pemasok, dan pengguna yang sudah memiliki transaksi tidak dapat dihapus. Kategori yang masih dipakai barang juga tidak dapat dihapus.
- Laporan persediaan: nilai = stok × harga beli; status Habis (stok 0), Menipis (stok ≤ batas, bawaan 10), Aman.

## 5. Endpoint API

Semua endpoint di bawah `/api`, memakai header `Authorization: Bearer <token>` kecuali login.

| Method | Endpoint | Fungsi | Peran |
|---|---|---|---|
| POST | `/login` | Login, menerbitkan token (dibatasi 10 percobaan/menit) | Publik |
| GET | `/me` | Profil pengguna yang login | Semua |
| POST | `/logout` | Mencabut token | Semua |
| GET | `/barangs`, `/barangs/{id}` | Daftar dan detail barang | Semua |
| POST, PUT, DELETE | `/barangs`, `/barangs/{id}` | Kelola barang | Admin |
| GET | `/kategoris` (`?all=1` untuk semua) | Daftar kategori | Semua |
| POST, PUT, DELETE | `/kategoris`, `/kategoris/{id}` | Kelola kategori | Admin |
| GET, POST, PUT, DELETE | `/pemasoks`, `/pemasoks/{id}` | Kelola pemasok | Admin |
| GET, POST | `/pembelians`, `/pembelians/{id}` | Riwayat, simpan, detail pembelian | Admin |
| GET, POST | `/penjualans`, `/penjualans/{id}` | Riwayat, simpan, struk penjualan | Semua |
| GET | `/stok` | Kartu stok (`?barang_id=`, `?tipe=`) | Semua |
| POST | `/stok/penyesuaian` | Penyesuaian stok | Admin |
| GET | `/laporan/penjualan?dari=&sampai=` | Laporan penjualan | Admin |
| GET | `/laporan/persediaan?batas=&kategori=` | Laporan persediaan | Admin |
| GET, POST, PUT, DELETE | `/users`, `/users/{id}` | Kelola pengguna | Admin |

## 6. Instalasi dan menjalankan

```bash
# Backend
cd backend
composer install
php artisan migrate
# Admin pertama: atur ADMIN_EMAIL dan ADMIN_PASSWORD di .env, atau biarkan
# ADMIN_PASSWORD kosong agar password acak dibuat dan ditampilkan sekali.
php artisan db:seed
php artisan storage:link
php artisan serve            # http://127.0.0.1:8000

# Frontend (terminal kedua)
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

Setelah login sebagai admin, buat akun kasir lewat menu Pengguna.

Data contoh (11 barang bergambar, pemasok, pembelian, penjualan, dan dua akun kasir) dapat diisi dengan `php artisan db:seed --class=DemoSeeder`. Password akun kasir diambil dari `DEMO_PASSWORD` atau dibuat acak. Untuk mencoba aplikasi tanpa instalasi lokal, gunakan GitHub Codespaces (lihat `.devcontainer/README.md`).

## 7. Pengujian

Pengujian otomatis memakai PHPUnit dengan database SQLite in-memory (`phpunit.xml`), sehingga tidak menyentuh database MySQL.

```bash
cd backend
php artisan test --compact
```

| File | Cakupan | Jumlah tes |
|---|---|---|
| `tests/Feature/AuthTest.php` | Login, login gagal, endpoint tanpa token, logout | 4 |
| `tests/Feature/ManajemenDataTest.php` | Hak akses kasir, pengguna, kategori, pemasok, stok awal, proteksi hapus | 7 |
| `tests/Feature/TransaksiTest.php` | Pembelian, penjualan, harga dari server, stok tidak cukup, bayar kurang, nomor faktur, kasir hanya melihat transaksinya, penyesuaian stok | 8 |
| `tests/Feature/LaporanTest.php` | Total laporan penjualan per periode, validasi periode, nilai dan status persediaan | 3 |
| `tests/Feature/DemoSeederTest.php` | Data demo lengkap, stok konsisten dengan kartu stok, seeder tidak menggandakan data | 2 |
| `tests/Feature/ExampleTest.php`, `tests/Unit/*` | Bawaan Laravel | 2 |

Hasil terakhir: 26 tes, 119 asersi, semua lulus.

### Skenario uji manual (frontend)

| No | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Login dengan password salah | Pesan "Email atau password salah." |
| 2 | Login sebagai kasir | Menu hanya Penjualan, Data Barang, Stok Barang |
| 3 | Tambah kategori yang sudah ada | Validasi gagal (nama sudah dipakai) |
| 4 | Simpan pembelian 10 unit | Stok barang bertambah 10, tercatat di kartu stok |
| 5 | Jual barang melebihi stok | Pesan stok tidak cukup, transaksi tidak tersimpan |
| 6 | Bayar kurang dari total | Pesan jumlah bayar kurang |
| 7 | Penyesuaian stok | Stok berubah, tercatat tipe Penyesuaian |
| 8 | Hapus pemasok yang punya pembelian | Ditolak dengan pesan |
| 9 | Laporan penjualan periode tertentu | Total sesuai transaksi pada periode |
| 10 | Laporan persediaan batas 5 | Barang stok ≤ 5 berstatus Menipis |

## 8. Struktur kode yang ditambahkan

```
backend/
  app/Http/Controllers/Api/   AuthController, UserController, KategoriController,
                              PemasokController, PembelianController, PenjualanController,
                              StokController, LaporanController (BarangController diperbarui)
  app/Http/Middleware/        EnsureUserIsAdmin
  app/Models/                 Pemasok, Pembelian, PembelianDetail, Penjualan,
                              PenjualanDetail, StokMutasi (Barang, Kategori, User diperbarui)
  database/migrations/        2026_11_26_000001 ... 000005
  database/factories/         BarangFactory, KategoriFactory, PemasokFactory
  tests/Feature/              AuthTest, ManajemenDataTest, TransaksiTest, LaporanTest
frontend/src/
  App.jsx                     Kerangka aplikasi: login, menu per peran
  components/                 ui.jsx, CrudPage.jsx, BarangPicker.jsx
  pages/                      Login, Dashboard, Barang, Master (kategori, pemasok, pengguna),
                              Pembelian, Penjualan, Stok, Laporan
  services/                   api.js (token), resourceServices.js, barangService.js
```

## 9. Sumber gambar contoh barang

Gambar barang pada data contoh diambil dari Wikimedia Commons (lisensi bebas), kecuali KP-001 yang diberikan pengguna. Lisensi CC BY dan CC BY-SA mewajibkan pencantuman nama pembuat.

| Kode | Barang | Berkas | Pembuat | Lisensi |
|---|---|---|---|---|
| KP-001 | Kopi Arabica Gayo 250 g | Contoh dari pengguna | - | - |
| KP-002 | Kopi Robusta Lampung 250 g | [Coffee-660394.jpg](https://commons.wikimedia.org/wiki/File:Coffee-660394.jpg) | Bronisław Dróżka (uroburos) | CC0 |
| SU-001 | Susu UHT Full Cream 1 L | [22-07-2017 Carton of UHT Milk of Matinal brand.JPG](https://commons.wikimedia.org/wiki/File:22-07-2017_Carton_of_UHT_Milk_of_Matinal_brand.JPG) | Kolforn (Kolforn) | CC BY-SA 4.0 |
| GL-001 | Gula Aren Cair 500 ml | [Nolen gur, known as new jaggery or Palm sugar, from Kakdwip, West Bengal, India.jpg](https://commons.wikimedia.org/wiki/File:Nolen_gur,_known_as_new_jaggery_or_Palm_sugar,_from_Kakdwip,_West_Bengal,_India.jpg) | Billjones94 | CC0 |
| MN-001 | Es Kopi Susu Aren | [Segelas kopi susu di Pangkalpinang Oktober 2022.jpg](https://commons.wikimedia.org/wiki/File:Segelas_kopi_susu_di_Pangkalpinang_Oktober_2022.jpg) | Cun Cun | CC BY-SA 4.0 |
| MN-002 | Teh Tarik | [Teh tarik 3.jpg](https://commons.wikimedia.org/wiki/File:Teh_tarik_3.jpg) | Omniscia6 | CC BY-SA 3.0 |
| MN-003 | Matcha Latte | [Matcha tea latte with rosetta latte art.jpg](https://commons.wikimedia.org/wiki/File:Matcha_tea_latte_with_rosetta_latte_art.jpg) | Irvan Ary Maulana | CC BY-SA 4.0 |
| MK-001 | Croissant Butter | [Croissants au beurre (18953292873).jpg](https://commons.wikimedia.org/wiki/File:Croissants_au_beurre_(18953292873).jpg) | Herry Wibisono (herryway) | CC0 |
| MK-002 | Roti Bakar Cokelat | [Roti bakar rasa strawberry lan coklat.jpg](https://commons.wikimedia.org/wiki/File:Roti_bakar_rasa_strawberry_lan_coklat.jpg) | Silviaberlian | CC BY-SA 4.0 |
| MK-003 | Kentang Goreng | [Truffle oil french fries (33024792848).jpg](https://commons.wikimedia.org/wiki/File:Truffle_oil_french_fries_(33024792848).jpg) | Tony Webster from Minneapolis, Minnesota, United States | CC BY-SA 2.0 |
| PL-001 | Cup Plastik 16 oz | [Disposable plastic cup.jpg](https://commons.wikimedia.org/wiki/File:Disposable_plastic_cup.jpg) | George E. Koronaios | CC BY-SA 4.0 |

---

Tanggal pembuatan: 26 November 2026.
Sumber: `MODUL.docx` (modul praktikum CRUD Data Barang), kode di `backend/` dan `frontend/`, gambar barang dari Wikimedia Commons (lihat bagian 9).
