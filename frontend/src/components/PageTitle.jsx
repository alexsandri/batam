// Judul halaman + tombol aksi utama (misal: Tambah Barang)
export default function PageTitle({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-lg leading-none">+</span> {actionLabel}
        </button>
      )}
    </div>
  );
}
