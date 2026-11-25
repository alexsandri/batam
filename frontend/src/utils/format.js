// Format angka menjadi Rupiah, contoh: 75000 -> Rp 75.000
export const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value || 0);
};
