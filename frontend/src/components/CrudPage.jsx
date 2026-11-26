import { useEffect, useState } from 'react';
import { Alert, Button, Card, Field, inputClass, PageHeader, Pagination, Table } from './ui';

// Halaman CRUD generik: form di atas, tabel + pencarian + pagination di bawah
export default function CrudPage({ title, subtitle, itemName, service, fields, columns, toForm }) {
  const initialForm = Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? '']));

  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: 'success', text: '' });

  const fetchRows = async (currentPage = page) => {
    try {
      setLoading(true);
      const response = await service.getAll({ search, page: currentPage });
      setRows(response.data.data);
      setPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      setMessage({ type: 'error', text: `Gagal mengambil data ${itemName}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows(page);
  }, [search, page]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});

      if (editingId) {
        await service.update(editingId, form);
        setMessage({ type: 'success', text: `${itemName} berhasil diperbarui` });
      } else {
        await service.create(form);
        setMessage({ type: 'success', text: `${itemName} berhasil ditambahkan` });
      }

      resetForm();
      await fetchRows(1);
    } catch (error) {
      if (error.response?.status === 422 && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan pada server' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm(toForm ? toForm(row) : Object.fromEntries(fields.map((field) => [field.name, row[field.name] ?? ''])));
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${itemName.toLowerCase()} ini?`)) return;

    try {
      await service.delete(row.id);
      setMessage({ type: 'success', text: `${itemName} berhasil dihapus` });

      if (rows.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchRows();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || `Gagal menghapus ${itemName.toLowerCase()}` });
    }
  };

  const tableColumns = [
    ...columns,
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="warning" className="px-3 py-1.5 text-sm" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button variant="danger" className="px-3 py-1.5 text-sm" onClick={() => handleDelete(row)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Alert type={message.type}>{message.text}</Alert>

      <Card title={editingId ? `Edit ${itemName}` : `Tambah ${itemName}`} className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <Field
                key={field.name}
                label={field.label}
                error={errors[field.name]}
                className={field.wide ? 'md:col-span-2' : ''}
              >
                {field.options ? (
                  <select
                    className={inputClass}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    rows="2"
                    className={inputClass}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  />
                ) : (
                  <input
                    type={field.type ?? 'text'}
                    className={inputClass}
                    placeholder={editingId && field.editPlaceholder ? field.editPlaceholder : field.placeholder}
                    required={field.required && !(editingId && field.optionalOnEdit)}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  />
                )}
              </Field>
            ))}
          </div>

          <div className="flex gap-3 mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : editingId ? `Update ${itemName}` : `Simpan ${itemName}`}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Daftar {itemName}</h2>
          <input
            type="text"
            placeholder={`Cari ${itemName.toLowerCase()}...`}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className={`${inputClass} md:w-80`}
          />
        </div>

        <Table columns={tableColumns} rows={rows} loading={loading} />
        <Pagination page={page} lastPage={lastPage} onChange={setPage} loading={loading} />
      </Card>
    </div>
  );
}
