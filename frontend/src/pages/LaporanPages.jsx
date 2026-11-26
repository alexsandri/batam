import { useEffect, useState } from 'react';
import { Badge, Button, Card, Field, formatRupiah, formatTanggal, inputClass, PageHeader, StatCard, Table, today } from '../components/ui';
import { kategoriService, laporanService } from '../services/resourceServices';

const awalBulan = () => today().slice(0, 8) + '01';

export function LaporanPenjualanPage() {
  const [filter, setFilter] = useState({ dari: awalBulan(), sampai: today() });
  const [laporan, setLaporan] = useState(null);
  const [error, setError] = useState('');

  const fetchLaporan = async () => {
    try {
      setError('');
      const response = await laporanService.penjualan(filter);
      setLaporan(response.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal memuat laporan');
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  return (
    <div>
      <PageHeader
        title="Laporan Penjualan"
        subtitle="Rekap penjualan per periode, rekap harian, dan barang terlaris."
        action={<Button variant="light" onClick={() => window.print()}>Cetak</Button>}
      />

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Field label="Dari tanggal">
            <input type="date" className={inputClass} value={filter.dari} onChange={(e) => setFilter({ ...filter, dari: e.target.value })} />
          </Field>
          <Field label="Sampai tanggal">
            <input type="date" className={inputClass} value={filter.sampai} onChange={(e) => setFilter({ ...filter, sampai: e.target.value })} />
          </Field>
          <Button onClick={fetchLaporan}>Tampilkan</Button>
        </div>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </Card>

      {laporan && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Jumlah transaksi" value={laporan.ringkasan.jumlah_transaksi} note={`${formatTanggal(laporan.periode.dari)} – ${formatTanggal(laporan.periode.sampai)}`} />
            <StatCard label="Barang terjual" value={`${laporan.ringkasan.jumlah_item} item`} />
            <StatCard label="Total penjualan" value={formatRupiah(laporan.ringkasan.total_penjualan)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="Rekap Harian">
              <Table
                columns={[
                  { key: 'tanggal', label: 'Tanggal', render: (row) => formatTanggal(row.tanggal) },
                  { key: 'jumlah_transaksi', label: 'Transaksi' },
                  { key: 'total', label: 'Total', render: (row) => formatRupiah(row.total) },
                ]}
                rows={laporan.per_hari}
                empty="Tidak ada penjualan pada periode ini"
              />
            </Card>
            <Card title="Barang Terlaris">
              <Table
                columns={[
                  { key: 'no', label: 'No', render: (_, index) => index + 1 },
                  { key: 'barang', label: 'Barang', render: (row) => row.barang?.nama_barang },
                  { key: 'jumlah', label: 'Terjual', render: (row) => `${row.jumlah} ${row.barang?.satuan ?? ''}` },
                  { key: 'total', label: 'Total', render: (row) => formatRupiah(row.total) },
                ]}
                rows={laporan.barang_terlaris}
                empty="Belum ada data"
              />
            </Card>
          </div>

          <Card title="Daftar Transaksi">
            <Table
              columns={[
                { key: 'no_faktur', label: 'No Faktur', className: 'font-medium' },
                { key: 'tanggal', label: 'Tanggal', render: (row) => formatTanggal(row.tanggal) },
                { key: 'kasir', label: 'Kasir', render: (row) => row.user?.name },
                { key: 'jumlah_item', label: 'Item' },
                { key: 'total', label: 'Total', render: (row) => formatRupiah(row.total) },
              ]}
              rows={laporan.transaksi}
              empty="Tidak ada transaksi pada periode ini"
            />
          </Card>
        </>
      )}
    </div>
  );
}

const statusBadge = {
  Aman: <Badge color="green">Aman</Badge>,
  Menipis: <Badge color="yellow">Menipis</Badge>,
  Habis: <Badge color="red">Habis</Badge>,
};

export function LaporanPersediaanPage() {
  const [filter, setFilter] = useState({ batas: 10, kategori: '' });
  const [kategoris, setKategoris] = useState([]);
  const [laporan, setLaporan] = useState(null);

  const fetchLaporan = async () => {
    const response = await laporanService.persediaan(filter);
    setLaporan(response.data);
  };

  useEffect(() => {
    fetchLaporan();
    kategoriService
      .all()
      .then((response) => setKategoris(response.data.data))
      .catch(() => setKategoris([]));
  }, []);

  return (
    <div>
      <PageHeader
        title="Laporan Persediaan"
        subtitle="Posisi stok dan nilai persediaan (stok × harga beli) per barang."
        action={<Button variant="light" onClick={() => window.print()}>Cetak</Button>}
      />

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Field label="Kategori">
            <select className={inputClass} value={filter.kategori} onChange={(e) => setFilter({ ...filter, kategori: e.target.value })}>
              <option value="">Semua kategori</option>
              {kategoris.map((kategori) => (
                <option key={kategori.id} value={kategori.nama_kategori}>
                  {kategori.nama_kategori}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Batas stok menipis">
            <input type="number" min="0" className={inputClass} value={filter.batas} onChange={(e) => setFilter({ ...filter, batas: e.target.value })} />
          </Field>
          <Button onClick={fetchLaporan}>Tampilkan</Button>
        </div>
      </Card>

      {laporan && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Jumlah barang" value={laporan.ringkasan.jumlah_barang} />
            <StatCard label="Total stok" value={laporan.ringkasan.total_stok} />
            <StatCard label="Nilai persediaan" value={formatRupiah(laporan.ringkasan.total_nilai)} />
            <StatCard label="Menipis / habis" value={`${laporan.ringkasan.stok_menipis} / ${laporan.ringkasan.stok_habis}`} note={`Batas menipis: ≤ ${laporan.batas_menipis}`} />
          </div>

          <Card title="Rincian Persediaan">
            <Table
              columns={[
                { key: 'kode_barang', label: 'Kode' },
                { key: 'nama_barang', label: 'Nama Barang', className: 'font-medium' },
                { key: 'kategori', label: 'Kategori', render: (row) => row.kategori || '-' },
                { key: 'stok', label: 'Stok', render: (row) => `${row.stok} ${row.satuan}` },
                { key: 'harga_beli', label: 'Harga Beli', render: (row) => formatRupiah(row.harga_beli) },
                { key: 'nilai_persediaan', label: 'Nilai', render: (row) => formatRupiah(row.nilai_persediaan) },
                { key: 'status', label: 'Status', render: (row) => statusBadge[row.status] },
              ]}
              rows={laporan.data}
            />
          </Card>
        </>
      )}
    </div>
  );
}
