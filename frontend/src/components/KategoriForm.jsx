import FieldError from './FieldError';

// Form tambah / edit kategori
export default function KategoriForm({ form, errors, onChange, onSubmit }) {
  return (
    <form id="kategori-form" onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label" htmlFor="nama_kategori">Nama Kategori</label>
        <input
          id="nama_kategori"
          name="nama_kategori"
          value={form.nama_kategori}
          onChange={onChange}
          className="input"
          placeholder="Minuman Kopi"
          required
          autoFocus
        />
        <FieldError errors={errors.nama_kategori} />
      </div>

      <div>
        <label className="label" htmlFor="deskripsi_kategori">Deskripsi</label>
        <textarea
          id="deskripsi_kategori"
          name="deskripsi"
          value={form.deskripsi}
          onChange={onChange}
          rows="4"
          className="input"
          placeholder="Keterangan singkat (opsional)"
        />
        <FieldError errors={errors.deskripsi} />
      </div>
    </form>
  );
}
