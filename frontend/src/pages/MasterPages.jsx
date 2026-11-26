import CrudPage from '../components/CrudPage';
import { Badge, formatTanggal } from '../components/ui';
import { kategoriService, pemasokService, userService } from '../services/resourceServices';

export function KategoriPage() {
  return (
    <CrudPage
      title="Kategori Barang"
      subtitle="Kelompok barang yang dipakai pada data barang dan laporan persediaan."
      itemName="Kategori"
      service={kategoriService}
      fields={[{ name: 'nama_kategori', label: 'Nama Kategori', required: true, placeholder: 'Minuman' }]}
      columns={[
        { key: 'no', label: 'No', render: (_, index) => index + 1 },
        { key: 'nama_kategori', label: 'Nama Kategori' },
        { key: 'created_at', label: 'Dibuat', render: (row) => formatTanggal(row.created_at) },
      ]}
    />
  );
}

export function PemasokPage() {
  return (
    <CrudPage
      title="Pemasok"
      subtitle="Data pemasok yang dipakai pada transaksi pembelian barang."
      itemName="Pemasok"
      service={pemasokService}
      fields={[
        { name: 'nama_pemasok', label: 'Nama Pemasok', required: true, placeholder: 'CV Sumber Kopi' },
        { name: 'telepon', label: 'Telepon', placeholder: '08xxxxxxxxxx' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'pemasok@contoh.com' },
        { name: 'alamat', label: 'Alamat', type: 'textarea' },
      ]}
      columns={[
        { key: 'nama_pemasok', label: 'Nama Pemasok', className: 'font-medium' },
        { key: 'telepon', label: 'Telepon', render: (row) => row.telepon || '-' },
        { key: 'email', label: 'Email', render: (row) => row.email || '-' },
        { key: 'alamat', label: 'Alamat', render: (row) => row.alamat || '-' },
      ]}
    />
  );
}

export function PenggunaPage() {
  return (
    <CrudPage
      title="Manajemen Pengguna"
      subtitle="Akun admin dan kasir. Password diisi saat menambah; kosongkan saat edit bila tidak diganti."
      itemName="Pengguna"
      service={userService}
      fields={[
        { name: 'name', label: 'Nama', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        {
          name: 'role',
          label: 'Peran',
          defaultValue: 'kasir',
          options: [
            { value: 'kasir', label: 'Kasir' },
            { value: 'admin', label: 'Admin' },
          ],
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          optionalOnEdit: true,
          placeholder: 'Minimal 8 karakter',
          editPlaceholder: 'Kosongkan bila tidak diganti',
        },
      ]}
      toForm={(row) => ({ name: row.name, email: row.email, role: row.role, password: '' })}
      columns={[
        { key: 'name', label: 'Nama', className: 'font-medium' },
        { key: 'email', label: 'Email' },
        {
          key: 'role',
          label: 'Peran',
          render: (row) => <Badge color={row.role === 'admin' ? 'green' : 'blue'}>{row.role === 'admin' ? 'Admin' : 'Kasir'}</Badge>,
        },
        { key: 'created_at', label: 'Terdaftar', render: (row) => formatTanggal(row.created_at) },
      ]}
    />
  );
}
