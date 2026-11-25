// Mengubah error dari Axios menjadi pesan yang mudah dipahami
export const getErrorMessage = (error) => {
  const status = error.response?.status;

  if (!error.response) {
    return 'Tidak dapat terhubung ke server. Pastikan php artisan serve berjalan';
  }
  if (status === 422) {
    // Pesan khusus dari server (misal: kategori masih dipakai)
    if (!error.response.data.errors) return error.response.data.message;
    return 'Data belum valid, periksa isian yang bertanda merah';
  }
  if (status === 413) {
    return 'Ukuran file terlalu besar untuk server';
  }
  return `Error ${status}: ${error.response.data?.message || 'Terjadi kesalahan pada server'}`;
};
