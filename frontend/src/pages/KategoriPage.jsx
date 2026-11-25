import { useCallback, useEffect, useState } from 'react';
import kategoriService from '../services/kategoriService';
import KategoriForm from '../components/KategoriForm';
import KategoriTable from '../components/KategoriTable';
import SearchBar from '../components/SearchBar';
import Drawer from '../components/Drawer';
import PageTitle from '../components/PageTitle';
import { getErrorMessage } from '../utils/error';

const initialForm = {
  nama_kategori: '',
  deskripsi: ''
};

export default function KategoriPage({ notify }) {
  const [kategoris, setKategoris] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Mengambil data kategori
  const fetchKategoris = async () => {
    try {
      setLoading(true);
      const response = await kategoriService.getAll();
      setKategoris(response.data.data);
    } catch (error) {
      console.error(error);
      notify('Gagal mengambil data kategori', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategoris();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pencarian dilakukan di sisi browser karena jumlah kategori sedikit
  const filtered = kategoris.filter(k =>
    k.nama_kategori.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // Submit tambah atau edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrors({});

      if (editingId) {
        await kategoriService.update(editingId, form);
        notify('Kategori berhasil diperbarui');
      } else {
        await kategoriService.create(form);
        notify('Kategori berhasil ditambahkan');
      }

      setDrawerOpen(false);
      await fetchKategoris();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      }
      notify(getErrorMessage(error), true);
    } finally {
      setSaving(false);
    }
  };

  // Isi form dengan data kategori yang dipilih
  const handleEdit = (kategori) => {
    setEditingId(kategori.id);
    setForm({
      nama_kategori: kategori.nama_kategori,
      deskripsi: kategori.deskripsi || ''
    });
    setErrors({});
    setDrawerOpen(true);
  };

  // Menghapus kategori
  const handleDelete = async (kategori) => {
    if (kategori.barangs_count > 0) {
      notify(
        `Kategori "${kategori.nama_kategori}" masih dipakai oleh ${kategori.barangs_count} barang. Pindahkan barangnya ke kategori lain terlebih dahulu.`,
        true
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Hapus kategori "${kategori.nama_kategori}"?`
    );
    if (!confirmDelete) return;

    try {
      await kategoriService.delete(kategori.id);
      notify(`Kategori "${kategori.nama_kategori}" berhasil dihapus`);
      await fetchKategoris();
    } catch (error) {
      console.error(error);
      notify(getErrorMessage(error), true);
    }
  };

  return (
    <>
      <PageTitle
        title="Daftar Kategori"
        subtitle={`${kategoris.length} kategori terdaftar`}
        actionLabel="Tambah Kategori"
        onAction={openCreate}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari nama kategori..."
          />
        </div>

        <KategoriTable
          kategoris={filtered}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Drawer
        open={drawerOpen}
        title={editingId ? 'Edit Kategori' : 'Tambah Kategori'}
        onClose={closeDrawer}
        formId="kategori-form"
        saving={saving}
        submitLabel={editingId ? 'Simpan Perubahan' : 'Simpan Kategori'}
      >
        <KategoriForm
          form={form}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </>
  );
}
