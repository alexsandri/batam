
import { useEffect, useState } from 'react';
import barangService from '../services/barangService';
import kategoriService from '../services/kategoriService';
import Layout from '../components/Layout';

const initialForm = {
    kode_barang: '',
    nama_barang: '',
    kategori_id : '',
    deskripsi: '',
    harga_beli: '',
    harga_jual: '',
    stok: 0,
    satuan: 'pcs',
    gambar: null
};

export default function Barang() {

    const [barangs, setBarangs] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const [preview, setPreview] = useState(null);
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [kategoris, setKategoris] = useState([]);

    useEffect(() => {
        let isMounted = true;

        kategoriService.getAll()
            .then(response => {
                if (isMounted) {
                    setKategoris(response.data.data);
                }
            })
            .catch(error => {
                console.error(error);
                if (isMounted) {
                    setMessage('Gagal mengambil data kategori');
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Mengambil data barang
    const fetchBarangs = async (currentPage = page) => {
        try {
            setLoading(true);

            const response = await barangService.getAll({
                search,
                page: currentPage
            });

            setBarangs(response.data.data);
            setPage(response.data.current_page);
            setLastPage(response.data.last_page);

        } catch (error) {
            console.error(error);
            setMessage('Gagal mengambil data barang');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBarangs(page);
    }, [search, page]);

    // Mengubah input form
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Upload dan preview gambar
    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setForm(prev => ({
            ...prev,
            gambar: file
        }));

        setPreview(URL.createObjectURL(file));
    };

    // Reset form
    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setPreview(null);
        setErrors({});

        const input = document.getElementById('gambar');

        if (input) input.value = '';
    };

    // Submit tambah atau edit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setErrors({});
            setMessage('');

            const formData = new FormData();

            Object.keys(form).forEach(key => {
                if (form[key] !== null) {
                    formData.append(key, form[key]);
                }
            });

            if (editingId) {
                formData.append('_method', 'PUT');

                await barangService.update(editingId, formData);

                setMessage('Barang berhasil diperbarui');
            } else {
                await barangService.create(formData);

                setMessage('Barang berhasil ditambahkan');
            }

            resetForm();
            setPage(1);
            await fetchBarangs(1);

        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setMessage(
                    error.response?.data?.message ||
                    'Terjadi kesalahan pada server'
                );
            }
        } finally {
            setLoading(false);
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
                kategori_id: String(barang.kategori_id ?? ''),
                deskripsi: barang.deskripsi || '',
                harga_beli: barang.harga_beli,
                harga_jual: barang.harga_jual,
                stok: barang.stok,
                satuan: barang.satuan,
                gambar: null
            });

            setPreview(barang.gambar_url);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {
            setMessage('Gagal mengambil detail barang');
        }
    };

    // Menghapus barang
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Apakah Anda yakin ingin menghapus barang ini?'
        );

        if (!confirmDelete) return;

        try {
            await barangService.delete(id);

            setMessage('Barang berhasil dihapus');

            await fetchBarangs();

        } catch (error) {
            setMessage('Gagal menghapus barang');
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Barang
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola data barang inventaris
                    </p>
                </div>

                {/* NOTIFIKASI */}
                {message && (
                    <div className="mb-5 rounded-lg bg-green-100
                        text-green-700 p-4">
                        {message}
                    </div>
                )}

                {/* FORM BARANG */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-xl font-bold mb-5">
                        {editingId ? 'Edit Barang' : 'Tambah Barang'}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2
                            gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Kode Barang
                                </label>

                                <input
                                    name="kode_barang"
                                    value={form.kode_barang}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    placeholder="BRG001"
                                    required
                                />

                                {errors.kode_barang && (
                                    <p className="text-red-500 text-sm">
                                        {errors.kode_barang[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nama Barang
                                </label>

                                <input
                                    name="nama_barang"
                                    value={form.nama_barang}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    placeholder="Nama barang"
                                    required
                                />

                                {errors.nama_barang && (
                                    <p className="text-red-500 text-sm">
                                        {errors.nama_barang[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Kategori
                                </label>

                                <select
                                    name="kategori_id"
                                    value={form.kategori_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg p-3"
                                >
                                    <option value="">-- Pilih Kategori --</option>

                                    {kategoris.map((kategori) => (
                                        <option
                                            key={kategori.id}
                                            value={kategori.id}
                                        >
                                            {kategori.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Satuan
                                </label>

                                <select
                                    name="satuan"
                                    value={form.satuan}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                >
                                    <option value="pcs">Pcs</option>
                                    <option value="unit">Unit</option>
                                    <option value="box">Box</option>
                                    <option value="kg">Kg</option>
                                    <option value="liter">Liter</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Harga Beli
                                </label>

                                <input
                                    type="number"
                                    name="harga_beli"
                                    value={form.harga_beli}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Harga Jual
                                </label>

                                <input
                                    type="number"
                                    name="harga_jual"
                                    value={form.harga_jual}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Stok
                                </label>

                                <input
                                    type="number"
                                    name="stok"
                                    value={form.stok}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Gambar Barang
                                </label>

                                <input
                                    id="gambar"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImage}
                                    className="w-full border rounded-lg p-3"
                                />

                                {errors.gambar && (
                                    <p className="text-red-500 text-sm">
                                        {errors.gambar[0]}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Deskripsi
                                </label>

                                <textarea
                                    name="deskripsi"
                                    value={form.deskripsi}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>

                            {/* PREVIEW GAMBAR */}
                            {preview && (
                                <div className="md:col-span-2">
                                    <p className="font-medium mb-2">
                                        Preview Gambar
                                    </p>

                                    <img
                                        src={preview}
                                        alt="Preview barang"
                                        className="w-40 h-40 object-cover
                                            rounded-lg border"
                                    />
                                </div>
                            )}

                        </div>

                        <div className="flex gap-3 mt-6">

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700
                                    text-white px-6 py-3 rounded-lg
                                    disabled:opacity-50"
                            >
                                {loading
                                    ? 'Menyimpan...'
                                    : editingId
                                        ? 'Update Barang'
                                        : 'Simpan Barang'
                                }
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 hover:bg-gray-600
                                    text-white px-6 py-3 rounded-lg"
                            >
                                Reset
                            </button>

                        </div>

                    </form>
                </div>

                {/* DAFTAR BARANG */}
                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex flex-col md:flex-row
                        justify-between gap-4 mb-6">

                        <h2 className="text-xl font-bold">
                            Daftar Barang
                        </h2>

                        <input
                            type="text"
                            placeholder="Cari kode atau nama barang..."
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            className="border rounded-lg px-4 py-2
                                w-full md:w-80"
                        />

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm text-left">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3">Gambar</th>
                                    <th className="p-3">Kode</th>
                                    <th className="p-3">Nama Barang</th>
                                    <th className="p-3">Harga Jual</th>
                                    <th className="p-3">Stok</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading && barangs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-5 text-center">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : barangs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-5 text-center">
                                            Data barang belum tersedia
                                        </td>
                                    </tr>
                                ) : (
                                    barangs.map((barang) => (

                                        <tr
                                            key={barang.id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="p-3">
                                                {barang.gambar_url ? (
                                                    <img
                                                        src={barang.gambar_url}
                                                        alt={barang.nama_barang}
                                                        className="w-14 h-14 object-cover
                                                            rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14
                                                        bg-gray-200 rounded-lg
                                                        flex items-center
                                                        justify-center">
                                                        <span className="text-xs">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-3">
                                                {barang.kode_barang}
                                            </td>

                                            <td className="p-3 font-medium">
                                                {barang.nama_barang}
                                            </td>

                                            <td className="p-3">
                                                {formatRupiah(barang.harga_jual)}
                                            </td>

                                            <td className="p-3">
                                                {barang.stok} {barang.satuan}
                                            </td>

                                            <td className="p-3">
                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(barang.id)
                                                        }
                                                        className="bg-yellow-500
                                                            text-white px-3 py-2
                                                            rounded-lg"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(barang.id)
                                                        }
                                                        className="bg-red-600
                                                            text-white px-3 py-2
                                                            rounded-lg"
                                                    >
                                                        Hapus
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-between items-center mt-6">

                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => setPage(page - 1)}
                            className="bg-gray-200 px-4 py-2 rounded-lg
                                disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm">
                            Halaman {page} dari {lastPage}
                        </span>

                        <button
                            disabled={page >= lastPage || loading}
                            onClick={() => setPage(page + 1)}
                            className="bg-gray-200 px-4 py-2 rounded-lg
                                disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>
        </Layout>
    );
}
