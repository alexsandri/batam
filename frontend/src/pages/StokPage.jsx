import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Field, formatTanggal, inputClass, PageHeader, Pagination, Table } from '../components/ui';
import barangService from '../services/barangService';
import { stokService } from '../services/resourceServices';

const tipeBadge = {
  masuk: <Badge color="green">Masuk</Badge>,
  keluar: <Badge color="red">Keluar</Badge>,
  penyesuaian: <Badge color="yellow">Penyesuaian</Badge>,
};

export default function StokPage({ isAdmin }) {
  const [barangs, setBarangs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [mutasis, setMutasis] = useState([]);
  const [tipe, setTipe] = useState('');
  const [mutasiPage, setMutasiPage] = useState(1);
  const [mutasiLastPage, setMutasiLastPage] = useState(1);

  const [adjust, setAdjust] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: 'success', text: '' });

  const fetchBarangs = async () => {
    const response = await barangService.getAll({ search, page });
    setBarangs(response.data.data);
    setLastPage(response.data.last_page);
  };

  const fetchMutasis = async () => {
    const response = await stokService.mutasi({ tipe, page: mutasiPage });
    setMutasis(response.data.data);
    setMutasiLastPage(response.data.last_page);
  };

  useEffect(() => {
    fetchBarangs().catch(() => setBarangs([]));
  }, [search, page]);

  useEffect(() => {
    fetchMutasis().catch(() => setMutasis([]));
  }, [tipe, mutasiPage]);

  const handleAdjust = async (e) => {
    e.preventDefault();

    try {
      setErrors({});
      await stokService.penyesuaian({ barang_id: adjust.barang.id, stok_baru: Number(adjust.stok_baru), keterangan: adjust.keterangan });
      setMessage({ type: 'success', text: `Stok ${adjust.barang.nama_barang} berhasil disesuaikan` });
      setAdjust(null);
      await Promise.all([fetchBarangs(), fetchMutasis()]);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan pada server' });
      }
    }
  };

  const status = (stok) => {
    if (stok <= 0) return <Badge color="red">Habis</Badge>;
    if (stok <= 10) return <Badge color="yellow">Menipis</Badge>;
    return <Badge color="green">Aman</Badge>;
  };

  return (
    <div>
      <PageHeader title="Pengelolaan Stok" subtitle="Posisi stok terkini, penyesuaian hasil stock opname, dan kartu stok." />
      <Alert type={message.type}>{message.text}</Alert>

      {adjust && (
        <Card title={`Penyesuaian Stok: ${adjust.barang.nama_barang}`} className="mb-6">
          <form onSubmit={handleAdjust} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Field label="Stok saat ini">
              <input className={`${inputClass} bg-gray-100`} value={`${adjust.barang.stok} ${adjust.barang.satuan}`} disabled />
            </Field>
            <Field label="Stok fisik (baru)" error={errors.stok_baru}>
              <input type="number" min="0" className={inputClass} value={adjust.stok_baru} onChange={(e) => setAdjust({ ...adjust, stok_baru: e.target.value })} required />
            </Field>
            <Field label="Keterangan" error={errors.keterangan}>
              <input className={inputClass} value={adjust.keterangan} onChange={(e) => setAdjust({ ...adjust, keterangan: e.target.value })} placeholder="Stock opname" required />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" variant="secondary" onClick={() => setAdjust(null)}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Posisi Stok</h2>
          <input
            className={`${inputClass} md:w-80`}
            placeholder="Cari kode atau nama barang..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <Table
          columns={[
            { key: 'kode_barang', label: 'Kode' },
            { key: 'nama_barang', label: 'Nama Barang', className: 'font-medium' },
            { key: 'kategori', label: 'Kategori', render: (row) => row.kategori || '-' },
            { key: 'stok', label: 'Stok', render: (row) => `${row.stok} ${row.satuan}` },
            { key: 'status', label: 'Status', render: (row) => status(row.stok) },
            ...(isAdmin
              ? [
                  {
                    key: 'aksi',
                    label: 'Aksi',
                    render: (row) => (
                      <Button variant="warning" className="px-3 py-1.5 text-sm" onClick={() => setAdjust({ barang: row, stok_baru: row.stok, keterangan: '' })}>
                        Sesuaikan
                      </Button>
                    ),
                  },
                ]
              : []),
          ]}
          rows={barangs}
        />
        <Pagination page={page} lastPage={lastPage} onChange={setPage} />
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Kartu Stok (Riwayat Mutasi)</h2>
          <select
            className={`${inputClass} md:w-56`}
            value={tipe}
            onChange={(e) => {
              setMutasiPage(1);
              setTipe(e.target.value);
            }}
          >
            <option value="">Semua tipe</option>
            <option value="masuk">Masuk</option>
            <option value="keluar">Keluar</option>
            <option value="penyesuaian">Penyesuaian</option>
          </select>
        </div>
        <Table
          columns={[
            { key: 'created_at', label: 'Tanggal', render: (row) => formatTanggal(row.created_at) },
            { key: 'barang', label: 'Barang', render: (row) => row.barang?.nama_barang },
            { key: 'tipe', label: 'Tipe', render: (row) => tipeBadge[row.tipe] },
            { key: 'jumlah', label: 'Jumlah', render: (row) => (row.jumlah > 0 ? `+${row.jumlah}` : row.jumlah) },
            { key: 'stok', label: 'Stok', render: (row) => `${row.stok_sebelum} → ${row.stok_sesudah}` },
            { key: 'referensi', label: 'Referensi', render: (row) => row.referensi || '-' },
            { key: 'keterangan', label: 'Keterangan', render: (row) => row.keterangan || '-' },
            { key: 'user', label: 'Oleh', render: (row) => row.user?.name || '-' },
          ]}
          rows={mutasis}
        />
        <Pagination page={mutasiPage} lastPage={mutasiLastPage} onChange={setMutasiPage} />
      </Card>
    </div>
  );
}
