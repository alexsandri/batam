import { useEffect, useState } from 'react';
import BarangPicker from '../components/BarangPicker';
import { Alert, Button, Card, Field, formatRupiah, formatTanggal, inputClass, PageHeader, Pagination, Table } from '../components/ui';
import { penjualanService } from '../services/resourceServices';

export default function PenjualanPage() {
  const [cart, setCart] = useState([]);
  const [bayar, setBayar] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [struk, setStruk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [riwayat, setRiwayat] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const total = cart.reduce((sum, item) => sum + item.jumlah * Number(item.harga_jual), 0);
  const kembalian = Number(bayar || 0) - total;

  const fetchRiwayat = async (currentPage = page) => {
    const response = await penjualanService.getAll({ page: currentPage });
    setRiwayat(response.data.data);
    setPage(response.data.current_page);
    setLastPage(response.data.last_page);
  };

  useEffect(() => {
    fetchRiwayat(page).catch(() => setRiwayat([]));
  }, [page]);

  const addToCart = (barang) => {
    setStruk(null);
    setCart((prev) => {
      const found = prev.find((item) => item.barang_id === barang.id);

      if (found) {
        return prev.map((item) => (item.barang_id === barang.id ? { ...item, jumlah: item.jumlah + 1 } : item));
      }

      return [...prev, { barang_id: barang.id, nama_barang: barang.nama_barang, harga_jual: barang.harga_jual, stok: barang.stok, satuan: barang.satuan, jumlah: 1 }];
    });
  };

  const changeJumlah = (barangId, jumlah) => {
    setCart((prev) =>
      prev
        .map((item) => (item.barang_id === barangId ? { ...item, jumlah: Math.max(0, Number(jumlah) || 0) } : item))
        .filter((item) => item.jumlah > 0),
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});

      const response = await penjualanService.create({
        bayar: Number(bayar || 0),
        items: cart.map(({ barang_id, jumlah }) => ({ barang_id, jumlah })),
      });

      setStruk(response.data.data);
      setMessage({ type: 'success', text: `Penjualan ${response.data.data.no_faktur} berhasil disimpan` });
      setCart([]);
      setBayar('');
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

  const itemErrors = Object.entries(errors)
    .filter(([key]) => key.startsWith('items'))
    .map(([, value]) => value[0]);

  return (
    <div>
      <PageHeader title="Transaksi Penjualan" subtitle="Kasir: pilih barang, atur jumlah, masukkan pembayaran." />
      <Alert type={message.type}>{message.text}</Alert>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <Card title="Pilih Barang" className="lg:col-span-3">
          <BarangPicker onPick={addToCart} refreshKey={refreshKey} />
        </Card>

        <Card title="Keranjang" className="lg:col-span-2">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">Keranjang masih kosong.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.barang_id} className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.nama_barang}</p>
                    <p className="text-xs text-gray-500">
                      {formatRupiah(item.harga_jual)} · stok {item.stok}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      className="w-16 border border-gray-300 rounded-md px-2 py-1 text-right"
                      value={item.jumlah}
                      onChange={(e) => changeJumlah(item.barang_id, e.target.value)}
                    />
                    <span className="w-28 text-right font-semibold">{formatRupiah(item.jumlah * item.harga_jual)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {itemErrors.map((text) => (
            <p key={text} className="text-red-600 text-sm mb-2">
              {text}
            </p>
          ))}

          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span className="text-emerald-800">{formatRupiah(total)}</span>
          </div>

          <Field label="Bayar" error={errors.bayar} className="mb-3">
            <input type="number" min="0" className={inputClass} value={bayar} onChange={(e) => setBayar(e.target.value)} />
          </Field>

          <div className="flex justify-between mb-5">
            <span className="text-gray-600">Kembalian</span>
            <span className={`font-semibold ${kembalian < 0 ? 'text-red-600' : 'text-gray-900'}`}>{formatRupiah(Math.max(kembalian, 0))}</span>
          </div>

          <Button className="w-full py-3" disabled={loading || cart.length === 0} onClick={handleSubmit}>
            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </Button>
        </Card>
      </div>

      {struk && (
        <Card title={`Struk ${struk.no_faktur}`} className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            {formatTanggal(struk.tanggal)} · Kasir: {struk.user?.name}
          </p>
          <Table
            columns={[
              { key: 'barang', label: 'Barang', render: (row) => row.barang?.nama_barang },
              { key: 'jumlah', label: 'Jumlah', render: (row) => `${row.jumlah} ${row.barang?.satuan ?? ''}` },
              { key: 'harga_jual', label: 'Harga', render: (row) => formatRupiah(row.harga_jual) },
              { key: 'subtotal', label: 'Subtotal', render: (row) => formatRupiah(row.subtotal) },
            ]}
            rows={struk.details}
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <p>
              Total: <b>{formatRupiah(struk.total)}</b>
            </p>
            <p>
              Bayar: <b>{formatRupiah(struk.bayar)}</b>
            </p>
            <p>
              Kembalian: <b>{formatRupiah(struk.kembalian)}</b>
            </p>
          </div>
        </Card>
      )}

      <Card title="Riwayat Penjualan">
        <Table
          columns={[
            { key: 'no_faktur', label: 'No Faktur', className: 'font-medium' },
            { key: 'tanggal', label: 'Tanggal', render: (row) => formatTanggal(row.tanggal) },
            { key: 'kasir', label: 'Kasir', render: (row) => row.user?.name },
            { key: 'details_count', label: 'Jenis Barang' },
            { key: 'total', label: 'Total', render: (row) => formatRupiah(row.total) },
          ]}
          rows={riwayat}
        />
        <Pagination page={page} lastPage={lastPage} onChange={setPage} />
      </Card>
    </div>
  );
}
