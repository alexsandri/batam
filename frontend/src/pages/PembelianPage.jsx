import { useEffect, useState } from 'react';
import BarangPicker from '../components/BarangPicker';
import { Alert, Button, Card, Field, formatRupiah, formatTanggal, inputClass, PageHeader, Pagination, Table, today } from '../components/ui';
import { pemasokService, pembelianService } from '../services/resourceServices';

export default function PembelianPage() {
  const [pemasoks, setPemasoks] = useState([]);
  const [form, setForm] = useState({ pemasok_id: '', tanggal: today(), catatan: '' });
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [riwayat, setRiwayat] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const total = items.reduce((sum, item) => sum + Number(item.jumlah || 0) * Number(item.harga_beli || 0), 0);

  const fetchRiwayat = async (currentPage = page) => {
    const response = await pembelianService.getAll({ page: currentPage });
    setRiwayat(response.data.data);
    setPage(response.data.current_page);
    setLastPage(response.data.last_page);
  };

  useEffect(() => {
    pemasokService
      .all()
      .then((response) => setPemasoks(response.data.data))
      .catch(() => setPemasoks([]));
  }, []);

  useEffect(() => {
    fetchRiwayat(page).catch(() => setRiwayat([]));
  }, [page]);

  const addItem = (barang) => {
    if (items.some((item) => item.barang_id === barang.id)) return;

    setItems([...items, { barang_id: barang.id, nama_barang: barang.nama_barang, satuan: barang.satuan, jumlah: 1, harga_beli: Number(barang.harga_beli) }]);
  };

  const changeItem = (barangId, field, value) => {
    setItems(items.map((item) => (item.barang_id === barangId ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});

      const response = await pembelianService.create({
        ...form,
        items: items.map(({ barang_id, jumlah, harga_beli }) => ({ barang_id, jumlah: Number(jumlah), harga_beli: Number(harga_beli) })),
      });

      setMessage({ type: 'success', text: `Pembelian ${response.data.data.no_faktur} berhasil disimpan, stok bertambah` });
      setItems([]);
      setForm({ pemasok_id: '', tanggal: today(), catatan: '' });
      setDetail(response.data.data);
      setRefreshKey((key) => key + 1);
      setPage(1);
      await fetchRiwayat(1);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan pada server' });
      }
    } finally {
      setLoading(false);
    }
  };

  const showDetail = async (row) => {
    const response = await pembelianService.getById(row.id);
    setDetail(response.data.data);
  };

  return (
    <div>
      <PageHeader title="Transaksi Pembelian" subtitle="Mencatat barang masuk dari pemasok. Stok dan harga beli diperbarui otomatis." />
      <Alert type={message.type}>{message.text}</Alert>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <Card title="Data Pembelian" className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <Field label="Pemasok" error={errors.pemasok_id}>
              <select className={inputClass} value={form.pemasok_id} onChange={(e) => setForm({ ...form, pemasok_id: e.target.value })} required>
                <option value="">- Pilih pemasok -</option>
                {pemasoks.map((pemasok) => (
                  <option key={pemasok.id} value={pemasok.id}>
                    {pemasok.nama_pemasok}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tanggal" error={errors.tanggal}>
              <input type="date" className={inputClass} value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
            </Field>
            <Field label="Catatan" className="md:col-span-2">
              <input className={inputClass} value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Opsional" />
            </Field>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-2">Tambah barang</p>
          <BarangPicker onPick={addItem} priceField="harga_beli" refreshKey={refreshKey} />
        </Card>

        <Card title="Barang Dibeli" className="lg:col-span-2">
          {items.length === 0 && <p className="text-gray-500 text-sm mb-4">Belum ada barang.</p>}
          <div className="space-y-3 mb-4">
            {items.map((item, index) => (
              <div key={item.barang_id} className="border-b border-gray-100 pb-3">
                <div className="flex justify-between mb-2">
                  <p className="font-medium text-gray-900">{item.nama_barang}</p>
                  <button type="button" className="text-red-600 text-sm" onClick={() => setItems(items.filter((x) => x.barang_id !== item.barang_id))}>
                    Hapus
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min="1" className={inputClass} value={item.jumlah} onChange={(e) => changeItem(item.barang_id, 'jumlah', e.target.value)} />
                  <input type="number" min="0" className={inputClass} value={item.harga_beli} onChange={(e) => changeItem(item.barang_id, 'harga_beli', e.target.value)} />
                </div>
                {(errors[`items.${index}.jumlah`] || errors[`items.${index}.harga_beli`]) && (
                  <p className="text-red-600 text-sm mt-1">{(errors[`items.${index}.jumlah`] || errors[`items.${index}.harga_beli`])[0]}</p>
                )}
              </div>
            ))}
          </div>
          {errors.items && <p className="text-red-600 text-sm mb-2">{errors.items[0]}</p>}

          <div className="flex justify-between text-lg font-bold mb-5">
            <span>Total</span>
            <span className="text-emerald-800">{formatRupiah(total)}</span>
          </div>

          <Button type="submit" className="w-full py-3" disabled={loading || items.length === 0}>
            {loading ? 'Menyimpan...' : 'Simpan Pembelian'}
          </Button>
        </Card>
      </form>

      {detail && (
        <Card title={`Detail ${detail.no_faktur}`} className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            {formatTanggal(detail.tanggal)} · Pemasok: {detail.pemasok?.nama_pemasok} · Dicatat oleh {detail.user?.name}
          </p>
          <Table
            columns={[
              { key: 'barang', label: 'Barang', render: (row) => row.barang?.nama_barang },
              { key: 'jumlah', label: 'Jumlah', render: (row) => `${row.jumlah} ${row.barang?.satuan ?? ''}` },
              { key: 'harga_beli', label: 'Harga Beli', render: (row) => formatRupiah(row.harga_beli) },
              { key: 'subtotal', label: 'Subtotal', render: (row) => formatRupiah(row.subtotal) },
            ]}
            rows={detail.details}
          />
          <p className="mt-4 font-semibold">Total: {formatRupiah(detail.total)}</p>
        </Card>
      )}

      <Card title="Riwayat Pembelian">
        <Table
          columns={[
            { key: 'no_faktur', label: 'No Faktur', className: 'font-medium' },
            { key: 'tanggal', label: 'Tanggal', render: (row) => formatTanggal(row.tanggal) },
            { key: 'pemasok', label: 'Pemasok', render: (row) => row.pemasok?.nama_pemasok },
            { key: 'details_count', label: 'Jenis Barang' },
            { key: 'total', label: 'Total', render: (row) => formatRupiah(row.total) },
            {
              key: 'aksi',
              label: 'Aksi',
              render: (row) => (
                <Button variant="light" className="px-3 py-1.5 text-sm" onClick={() => showDetail(row)}>
                  Detail
                </Button>
              ),
            },
          ]}
          rows={riwayat}
        />
        <Pagination page={page} lastPage={lastPage} onChange={setPage} />
      </Card>
    </div>
  );
}
