import { useEffect, useState } from 'react';
import { Badge, Card, formatRupiah, PageHeader, StatCard, Table, today } from '../components/ui';
import { laporanService } from '../services/resourceServices';

export default function DashboardPage({ user }) {
  const [penjualan, setPenjualan] = useState(null);
  const [persediaan, setPersediaan] = useState(null);

  useEffect(() => {
    laporanService.penjualan({ dari: today(), sampai: today() }).then((response) => setPenjualan(response.data));
    laporanService.persediaan({ batas: 10 }).then((response) => setPersediaan(response.data));
  }, []);

  const perluPerhatian = persediaan?.data.filter((barang) => barang.status !== 'Aman') ?? [];

  return (
    <div>
      <PageHeader title={`Selamat datang, ${user.name}`} subtitle="Ringkasan penjualan hari ini dan kondisi persediaan." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Penjualan hari ini" value={formatRupiah(penjualan?.ringkasan.total_penjualan)} />
        <StatCard label="Transaksi hari ini" value={penjualan?.ringkasan.jumlah_transaksi ?? 0} />
        <StatCard label="Nilai persediaan" value={formatRupiah(persediaan?.ringkasan.total_nilai)} />
        <StatCard label="Stok menipis / habis" value={`${persediaan?.ringkasan.stok_menipis ?? 0} / ${persediaan?.ringkasan.stok_habis ?? 0}`} />
      </div>

      <Card title="Barang yang perlu diisi ulang">
        <Table
          columns={[
            { key: 'kode_barang', label: 'Kode' },
            { key: 'nama_barang', label: 'Nama Barang', className: 'font-medium' },
            { key: 'stok', label: 'Stok', render: (row) => `${row.stok} ${row.satuan}` },
            { key: 'status', label: 'Status', render: (row) => <Badge color={row.status === 'Habis' ? 'red' : 'yellow'}>{row.status}</Badge> },
          ]}
          rows={perluPerhatian}
          empty="Semua stok aman"
        />
      </Card>
    </div>
  );
}
