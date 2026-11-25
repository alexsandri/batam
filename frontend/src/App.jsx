import { useCallback, useState } from 'react';
import Header from './components/Header';
import Notification from './components/Notification';
import BarangPage from './pages/BarangPage';
import KategoriPage from './pages/KategoriPage';

// App mengatur halaman yang aktif dan notifikasi yang dipakai bersama
export default function App() {
  const [activePage, setActivePage] = useState('barang');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Dipanggil dari halaman mana pun untuk menampilkan notifikasi
  const notify = useCallback((text, error = false) => {
    setMessage(text);
    setIsError(error);
  }, []);

  const closeMessage = useCallback(() => setMessage(''), []);

  return (
    <div className="min-h-screen">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <Notification message={message} isError={isError} onClose={closeMessage} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activePage === 'barang' && <BarangPage notify={notify} />}
        {activePage === 'kategori' && <KategoriPage notify={notify} />}
      </main>
    </div>
  );
}
