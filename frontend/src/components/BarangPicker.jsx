import { useEffect, useState } from 'react';
import barangService from '../services/barangService';
import { formatRupiah, inputClass } from './ui';

// Pencarian barang untuk transaksi; klik barang untuk menambahkannya
export default function BarangPicker({ onPick, priceField = 'harga_jual', refreshKey }) {
  const [search, setSearch] = useState('');
  const [barangs, setBarangs] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      barangService
        .getAll({ search })
        .then((response) => setBarangs(response.data.data))
        .catch(() => setBarangs([]));
    }, 250);

    return () => clearTimeout(timer);
  }, [search, refreshKey]);

  return (
    <div>
      <input
        type="text"
        className={`${inputClass} mb-3`}
        placeholder="Cari kode atau nama barang..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {barangs.map((barang) => (
          <button
            key={barang.id}
            type="button"
            onClick={() => onPick(barang)}
            className="flex items-center gap-3 text-left border border-gray-200 rounded-lg p-3 hover:border-emerald-600 hover:bg-emerald-50"
          >
            {barang.gambar_url ? (
              <img src={barang.gambar_url} alt={barang.nama_barang} className="w-12 h-12 rounded-md object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">No Image</div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{barang.nama_barang}</p>
              <p className="text-xs text-gray-500">{barang.kode_barang}</p>
              <p className="text-sm text-emerald-800">
                {formatRupiah(barang[priceField])} · stok {barang.stok} {barang.satuan}
              </p>
            </div>
          </button>
        ))}
        {barangs.length === 0 && <p className="text-sm text-gray-500">Barang tidak ditemukan.</p>}
      </div>
    </div>
  );
}
