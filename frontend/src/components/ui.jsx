// Komponen UI kecil yang dipakai ulang di semua halaman

export const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600';

export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatTanggal = (value) =>
  value
    ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '-';

export const today = () => new Date().toLocaleDateString('sv-SE');

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>}
      {children}
    </div>
  );
}

export function Alert({ type = 'success', children }) {
  if (!children) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  return <div className={`mb-5 rounded-lg border p-4 ${styles[type]}`}>{children}</div>;
}

export function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error[0] ?? error}</p>}
    </div>
  );
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  };

  return (
    <button
      className={`px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export function Badge({ color = 'gray', children }) {
  const styles = {
    green: 'bg-emerald-100 text-emerald-800',
    yellow: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-sky-100 text-sky-800',
    gray: 'bg-gray-100 text-gray-700',
  };

  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[color]}`}>{children}</span>;
}

export function StatCard({ label, value, note }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-emerald-800 mt-1">{value}</p>
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  );
}

export function Table({ columns, rows, empty = 'Data belum tersedia', loading }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`p-3 font-semibold ${column.className ?? ''}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-5 text-center text-gray-500">
                {loading ? 'Memuat data...' : empty}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id ?? index} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className={`p-3 ${column.className ?? ''}`}>
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, lastPage, onChange, loading }) {
  return (
    <div className="flex justify-between items-center mt-5">
      <Button variant="light" disabled={page <= 1 || loading} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Halaman {page} dari {lastPage}
      </span>
      <Button variant="light" disabled={page >= lastPage || loading} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
