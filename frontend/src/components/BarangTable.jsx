import { formatRupiah } from '../utils/format';

// Label stok berwarna: habis (merah), menipis (kuning), aman (abu-abu)
function StokBadge({ stok, satuan }) {
  const jumlah = Number(stok);
  const style =
    jumlah === 0
      ? 'bg-red-50 text-red-700 ring-red-200'
      : jumlah < 10
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-gray-50 text-gray-700 ring-gray-200';

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset tabular-nums ${style}`}>
      {jumlah === 0 ? 'Habis' : `${jumlah} ${satuan}`}
    </span>
  );
}

// Tabel daftar barang dengan tombol Edit dan Hapus
export default function BarangTable({ barangs, loading, onEdit, onDelete }) {
  if (loading && barangs.length === 0) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <div className="h-11 w-11 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/5 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (barangs.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-medium text-gray-700">Barang tidak ditemukan</p>
        <p className="mt-1 text-sm text-gray-500">
          Coba kata kunci lain atau tambahkan barang baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm transition-opacity ${loading ? 'opacity-50' : ''}`}>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Barang</th>
            <th className="hidden px-4 py-3 md:table-cell">Kategori</th>
            <th className="hidden px-4 py-3 text-right lg:table-cell">Harga Beli</th>
            <th className="px-4 py-3 text-right">Harga Jual</th>
            <th className="px-4 py-3">Stok</th>
            <th className="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {barangs.map((barang) => (
            <tr key={barang.id} className="hover:bg-gray-50/70">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  {barang.gambar_url ? (
                    <img
                      src={barang.gambar_url}
                      alt={barang.nama_barang}
                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-400">
                      {barang.nama_barang.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {barang.nama_barang}
                    </p>
                    <p className="font-mono text-xs text-gray-500">
                      {barang.kode_barang}
                    </p>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                {barang.kategori ? (
                  <span className="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {barang.kategori}
                  </span>
                ) : (
                  <span className="text-gray-400">–</span>
                )}
              </td>
              <td className="hidden px-4 py-3 text-right tabular-nums text-gray-500 lg:table-cell">
                {formatRupiah(barang.harga_beli)}
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums text-gray-900">
                {formatRupiah(barang.harga_jual)}
              </td>
              <td className="px-4 py-3">
                <StokBadge stok={barang.stok} satuan={barang.satuan} />
              </td>
              <td className="px-6 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(barang.id)}
                    className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(barang)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
