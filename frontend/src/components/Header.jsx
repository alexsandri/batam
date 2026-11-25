const MENU = [
  { key: 'barang', label: 'Barang' },
  { key: 'kategori', label: 'Kategori' }
];

// Header biru dengan menu navigasi antar halaman
export default function Header({ activePage, onNavigate }) {
  return (
    <header className="sticky top-0 z-30 bg-blue-700 text-white shadow">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-xl font-bold">
            Aplikasi Manajemen Barang
          </h1>
          <p className="text-sm text-blue-100">
            Laravel 13 + React + Tailwind CSS
          </p>
        </div>

        <nav className="flex gap-1 rounded-lg bg-blue-800/60 p-1">
          {MENU.map(item => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activePage === item.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
