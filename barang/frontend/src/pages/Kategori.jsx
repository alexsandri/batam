
import { useEffect, useState } from 'react';
import kategoriService from '../services/kategoriService';
import Layout from '../components/Layout';

const initialForm = {
    name: ''
};
    

export default function Kategori() {

    const [kategoris, setKategoris] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const [preview, setPreview] = useState(null);
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Mengambil data kategori
    const fetchKategoris = async (currentPage = page) => {
        try {
            setLoading(true);

            const response = await kategoriService.getAll({
                search,
                page: currentPage
            });

            setKategoris(response.data.data);
            setPage(response.data.current_page);
            setLastPage(response.data.last_page);

        } catch (error) {
            console.error(error);
            setMessage('Gagal mengambil data kategori');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKategoris(page);
    }, [search, page]);

    // Mengubah input form
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // // Upload dan preview gambar
    // const handleImage = (e) => {
    //     const file = e.target.files[0];

    //     if (!file) return;

    //     setForm(prev => ({
    //         ...prev,
    //         gambar: file
    //     }));

    //     setPreview(URL.createObjectURL(file));
    // };

    // Reset form
    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setPreview(null);
        setErrors({});

        // const input = document.getElementById('gambar');

        //if (input) input.value = '';
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

                await kategoriService.update(editingId, formData);

                setMessage('Kategori berhasil diperbarui');
            } else {
                await kategoriService.create(formData);

                setMessage('Kategori berhasil ditambahkan');
            }

            resetForm();
            setPage(1);
            await fetchKategoris(1);

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
            const response = await kategoriService.getById(id);

            const kategori = response.data.data;

            setEditingId(kategori.id);

            setForm({
                name: kategori.name
            });

        

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {
            setMessage('Gagal mengambil detail kategori');
        }
    };

    // Menghapus kategori
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Apakah Anda yakin ingin menghapus kategori ini?'
        );

        if (!confirmDelete) return;

        try {
            await kategoriService.delete(id);

            setMessage('Kategori berhasil dihapus');

            await fetchKategoris();

        } catch (error) {
            setMessage('Gagal menghapus kategori');
        }
    };

    
    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Kategori
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola kategori barang inventaris
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
                        {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2
                            gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Kategori
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    placeholder="Kategori"
                                    required
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            
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
                                        ? 'Update Kategori'
                                        : 'Simpan Kategori'
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
                            Daftar Kategori
                        </h2>

                        <input
                            type="text"
                            placeholder="Cari kode atau nama kategori..."
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
                                    <th className="p-3">Kategori</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading && kategoris.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-5 text-center">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : kategoris.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-5 text-center">
                                            Data kategori belum tersedia
                                        </td>
                                    </tr>
                                ) : (
                                    kategoris.map((kategori) => (

                                        <tr
                                            key={kategori.id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3">
                                                {kategori.name}
                                            </td>

                                            

                                            <td className="p-3">
                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(kategori.id)
                                                        }
                                                        className="bg-yellow-500
                                                            text-white px-3 py-2
                                                            rounded-lg"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(kategori.id)
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
