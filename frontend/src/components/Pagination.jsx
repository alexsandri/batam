// Membuat daftar nomor halaman, contoh: 1 … 4 5 6 … 11
function getPages(page, lastPage) {
  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return pages;
}

// Info jumlah data + tombol halaman
export default function Pagination({ page, lastPage, from, to, total, loading, onPageChange }) {
  const btn = 'min-w-9 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row">
      <p className="text-sm text-gray-500">
        {total > 0
          ? <>Menampilkan <span className="font-medium text-gray-700">{from}–{to}</span> dari <span className="font-medium text-gray-700">{total}</span> barang</>
          : 'Tidak ada data'}
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className={`${btn} text-gray-600 hover:bg-gray-100`}
        >
          ‹ Prev
        </button>

        {getPages(page, lastPage).map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={p}
              disabled={loading}
              onClick={() => onPageChange(p)}
              className={`${btn} ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= lastPage || loading}
          onClick={() => onPageChange(page + 1)}
          className={`${btn} text-gray-600 hover:bg-gray-100`}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
