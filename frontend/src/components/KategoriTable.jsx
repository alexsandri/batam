// Tabel daftar kategori dengan jumlah barang di tiap kategori
export default function KategoriTable({ kategoris, loading, onEdit, onDelete }) {
  if (loading && kategoris.length === 0) {
    return <p className="px-6 py-16 text-center text-sm text-gray-500">Memuat data...</p>;
  }

  if (kategoris.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-medium text-gray-700">Kategori tidak ditemukan</p>
        <p className="mt-1 text-sm text-gray-500">
          Coba kata kunci lain atau tambahkan kategori baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm transition-opacity ${loading ? 'opacity-50' : ''}`}>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Nama Kategori</th>
            <th className="hidden px-4 py-3 md:table-cell">Deskripsi</th>
            <th className="px-4 py-3 text-right">Jumlah Barang</th>
            <th className="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {kategoris.map((kategori) => (
            <tr key={kategori.id} className="hover:bg-gray-50/70">
              <td className="px-6 py-3 font-medium text-gray-900">
                {kategori.nama_kategori}
              </td>
              <td className="hidden max-w-md truncate px-4 py-3 text-gray-500 md:table-cell">
                {kategori.deskripsi || <span className="text-gray-400">–</span>}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium tabular-nums text-blue-700">
                  {kategori.barangs_count} barang
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(kategori)}
                    className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(kategori)}
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
