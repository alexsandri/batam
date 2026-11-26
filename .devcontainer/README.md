# Menjalankan Aplikasi di GitHub Codespaces

Codespace ini menyiapkan aplikasi secara otomatis, yaitu memasang dependensi, membuat basis data SQLite, mengisi data demo, serta menjalankan *backend* dan *frontend*. Proses penyiapan pertama memerlukan waktu sekitar tiga sampai lima menit.

## Membuka Aplikasi

1. Buka tab **Ports** di bagian bawah editor.
2. Klik ikon globe pada port **5173 (Aplikasi POS)**.
3. Masuk dengan akun demo yang tercantum pada berkas `backend/storage/app/demo-akun.txt`.

Akun demo terdiri atas satu admin (`admin@pos.test`) dan dua kasir (`kasir@pos.test` dan `sari@pos.test`). Kata sandinya dibuat acak untuk setiap Codespace.

## Membagikan Tautan kepada Orang Lain

Secara bawaan, port hanya dapat dibuka oleh pemilik Codespace. Agar dapat dibuka oleh peserta presentasi, klik kanan port **5173** pada tab **Ports**, kemudian pilih **Port Visibility** lalu **Public**. Kembalikan ke **Private** setelah presentasi selesai.

## Catatan

- Codespace berhenti secara otomatis apabila tidak digunakan selama sekitar 30 menit. Saat dinyalakan kembali, aplikasi dijalankan ulang secara otomatis dan data demo tetap tersimpan.
- Apabila aplikasi tidak terbuka, periksa log pada `/tmp/backend.log` dan `/tmp/frontend.log`, atau jalankan ulang dengan perintah `bash .devcontainer/start.sh`.
- Data demo dapat diatur ulang dengan menghapus `backend/database/database.sqlite` dan `backend/storage/app/demo-akun.txt`, kemudian menjalankan `bash .devcontainer/setup.sh`.
