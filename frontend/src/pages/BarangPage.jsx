import { useCallback, useEffect, useState } from 'react';
import barangService from '../services/barangService';
import kategoriService from '../services/kategoriService';
import BarangForm from '../components/BarangForm';
import SearchBar from '../components/SearchBar';
import Drawer from '../components/Drawer';
import BarangTable from '../components/BarangTable';
import Pagination from '../components/Pagination';
import PageTitle from '../components/PageTitle';
import { getErrorMessage } from '../utils/error';

const initialForm = {
  kode_barang: '',
  nama_barang: '',
  kategori_id: '',
  deskripsi: '',
  harga_beli: '',
  harga_jual: '',
  stok: 0,
  satuan: 'pcs',
  gambar: null
};

export default function BarangPage({ notify }) {
  const [barangs, setBarangs] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState({ from: 0, to: 0, total: 0 });

  // Mengambil data barang
  const fetchBarangs = async (currentPage = page) => {
    try {
      setLoading(true);
      const response = await barangService.getAll({
        search,
        kategori_id: kategoriFilter || undefined,
        page: currentPage
      });
      setBarangs(response.data.data);
      setPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setMeta({
        from: response.data.from || 0,
        to: response.data.to || 0,
        total: response.data.total
      });
    } catch (error) {
      console.error(error);
      notify('Gagal mengambil data barang', true);
    } finally {
      setLoading(false);
    }
  };

  // Mengambil daftar kategori untuk dropdown
  const fetchKategoris = async () => {
    try {
      const response = await kategoriService.getAll();
      setKategoris(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKategoris();
  }, []);

  useEffect(() => {
    fetchBarangs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, kategoriFilter, page]);

  // Pencarian dengan jeda 400 ms agar API tidak dipanggil di setiap ketikan
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setPage(1);
        setSearch(searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const handleFilterKategori = (value) => {
    setPage(1);
    setKategoriFilter(value);
  };

  // Mengubah input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Upload dan preview gambar
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Cek ukuran maksimal 2 MB sebelum dikirim ke server
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, gambar: ['Ukuran gambar maksimal 2 MB'] }));
      e.target.value = '';
      return;
    }

    setErrors(prev => ({ ...prev, gambar: undefined }));
    setForm(prev => ({ ...prev, gambar: file }));
    setPreview(URL.createObjectURL(file));
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPreview(null);
    setErrors({});
  };

  // Buka panel form untuk tambah barang
  const openCreate = () => {
    resetForm();
    setDrawerOpen(true);
  };

  // Tutup panel form
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // Submit tambah atau edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrors({});

      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (editingId) {
        formData.append('_method', 'PUT');
        await barangService.update(editingId, formData);
        notify('Barang berhasil diperbarui');
        setDrawerOpen(false);
        resetForm();
        await fetchBarangs(page);
      } else {
        await barangService.create(formData);
        notify('Barang berhasil ditambahkan');
        setDrawerOpen(false);
        resetForm();
        setPage(1);
        await fetchBarangs(1);
      }
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

  // Mengambil data untuk edit
  const handleEdit = async (id) => {
    try {
      const response = await barangService.getById(id);
      const barang = response.data.data;
      setEditingId(barang.id);
      setForm({
        kode_barang: barang.kode_barang,
        nama_barang: barang.nama_barang,
        kategori_id: barang.kategori_id || '',
        deskripsi: barang.deskripsi || '',
        harga_beli: barang.harga_beli,
        harga_jual: barang.harga_jual,
        stok: barang.stok,
        satuan: barang.satuan,
        gambar: null
      });
      setPreview(barang.gambar_url);
      setErrors({});
      setDrawerOpen(true);
    } catch (error) {
      console.error(error);
      notify('Gagal mengambil detail barang', true);
    }
  };

  // Menghapus barang
  const handleDelete = async (barang) => {
    const confirmDelete = window.confirm(
      `Hapus "${barang.nama_barang}" (${barang.kode_barang})? Data dan gambarnya akan dihapus permanen.`
    );
    if (!confirmDelete) return;

    try {
      await barangService.delete(barang.id);
      notify(`"${barang.nama_barang}" berhasil dihapus`);
      // Jika barang terakhir di halaman ini dihapus, mundur satu halaman
      const targetPage = barangs.length === 1 && page > 1 ? page - 1 : page;
      if (targetPage !== page) {
        setPage(targetPage);
      } else {
        await fetchBarangs(page);
      }
    } catch (error) {
      console.error(error);
      notify('Gagal menghapus barang', true);
    }
  };

  const namaFilter = kategoris.find(k => String(k.id) === String(kategoriFilter))?.nama_kategori;

  return (
    <>
      <PageTitle
        title="Daftar Barang"
        subtitle={
          <>
            {meta.total} barang
            {namaFilter && <> di kategori &ldquo;{namaFilter}&rdquo;</>}
            {search ? <> ditemukan untuk &ldquo;{search}&rdquo;</> : !namaFilter && ' terdaftar'}
          </>
        }
        actionLabel="Tambah Barang"
        onAction={openCreate}
      />

      {/* KARTU TABEL */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Cari kode atau nama barang..."
          />
          <select
            value={kategoriFilter}
            onChange={(e) => handleFilterKategori(e.target.value)}
            className="input sm:w-56"
            aria-label="Filter kategori"
          >
            <option value="">Semua kategori</option>
            {kategoris.map(k => (
              <option key={k.id} value={k.id}>
                {k.nama_kategori} ({k.barangs_count})
              </option>
            ))}
          </select>
        </div>

        <BarangTable
          barangs={barangs}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Pagination
          page={page}
          lastPage={lastPage}
          from={meta.from}
          to={meta.to}
          total={meta.total}
          loading={loading}
          onPageChange={setPage}
        />
      </div>

      {/* PANEL FORM TAMBAH / EDIT */}
      <Drawer
        open={drawerOpen}
        title={editingId ? 'Edit Barang' : 'Tambah Barang'}
        onClose={closeDrawer}
        formId="barang-form"
        saving={saving}
        submitLabel={editingId ? 'Simpan Perubahan' : 'Simpan Barang'}
      >
        <BarangForm
          form={form}
          errors={errors}
          preview={preview}
          kategoris={kategoris}
          onChange={handleChange}
          onImageChange={handleImage}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </>
  );
}
