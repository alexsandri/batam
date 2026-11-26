import { useEffect, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import BarangPage from './pages/BarangPage';
import LoginPage from './pages/LoginPage';
import { KategoriPage, PemasokPage, PenggunaPage } from './pages/MasterPages';
import PembelianPage from './pages/PembelianPage';
import PenjualanPage from './pages/PenjualanPage';
import StokPage from './pages/StokPage';
import { LaporanPenjualanPage, LaporanPersediaanPage } from './pages/LaporanPages';
import { TOKEN_KEY } from './services/api';
import { authService } from './services/resourceServices';

// Menu aplikasi; adminOnly = hanya tampil untuk peran admin
const MENU = [
  { group: 'Utama', key: 'dashboard', label: 'Dashboard', adminOnly: true },
  { group: 'Transaksi', key: 'penjualan', label: 'Penjualan (Kasir)' },
  { group: 'Transaksi', key: 'pembelian', label: 'Pembelian', adminOnly: true },
  { group: 'Inventaris', key: 'barang', label: 'Data Barang' },
  { group: 'Inventaris', key: 'kategori', label: 'Kategori', adminOnly: true },
  { group: 'Inventaris', key: 'pemasok', label: 'Pemasok', adminOnly: true },
  { group: 'Inventaris', key: 'stok', label: 'Stok Barang' },
  { group: 'Laporan', key: 'laporan-penjualan', label: 'Laporan Penjualan', adminOnly: true },
  { group: 'Laporan', key: 'laporan-persediaan', label: 'Laporan Persediaan', adminOnly: true },
  { group: 'Pengaturan', key: 'pengguna', label: 'Pengguna', adminOnly: true },
];

const pageFromHash = () => window.location.hash.replace('#/', '');

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [page, setPage] = useState(pageFromHash());

  const isAdmin = user?.role === 'admin';
  const menu = MENU.filter((item) => isAdmin || !item.adminOnly);
  const activePage = menu.some((item) => item.key === page) ? page : menu[0]?.key;

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    authService
      .me()
      .then((response) => setUser(response.data.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (key) => {
    window.location.hash = `/${key}`;
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const pages = {
    dashboard: <DashboardPage user={user} />,
    penjualan: <PenjualanPage />,
    pembelian: <PembelianPage />,
    barang: <BarangPage isAdmin={isAdmin} />,
    kategori: <KategoriPage />,
    pemasok: <PemasokPage />,
    stok: <StokPage isAdmin={isAdmin} />,
    'laporan-penjualan': <LaporanPenjualanPage />,
    'laporan-persediaan': <LaporanPersediaanPage />,
    pengguna: <PenggunaPage />,
  };

  const groups = [...new Set(menu.map((item) => item.group))];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 shrink-0 bg-emerald-900 text-emerald-50 flex flex-col print:hidden">
        <div className="px-6 py-5 border-b border-emerald-800">
          <p className="text-lg font-bold leading-tight">POS Inventaris</p>
          <p className="text-xs text-emerald-200 mt-1">Manajemen Inventaris dan Penjualan</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 mb-1 text-[11px] uppercase tracking-wider text-emerald-300">{group}</p>
              {menu
                .filter((item) => item.group === group)
                .map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      activePage === item.key ? 'bg-emerald-700 text-white font-semibold' : 'hover:bg-emerald-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-emerald-800">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-emerald-200 mb-3">{isAdmin ? 'Admin' : 'Kasir'}</p>
          <button onClick={handleLogout} className="text-sm text-emerald-100 underline hover:text-white">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-8">{pages[activePage]}</main>
    </div>
  );
}
