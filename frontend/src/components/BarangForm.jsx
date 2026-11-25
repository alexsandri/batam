import FieldError from './FieldError';


// Isi form tambah / edit barang.
// Tombol simpan ada di footer Drawer dan terhubung lewat id "barang-form".
export default function BarangForm({
  form,
  errors,
  preview,
  kategoris,
  onChange,
  onImageChange,
  onSubmit
}) {
  return (
    <form id="barang-form" onSubmit={onSubmit} className="space-y-6">
      {/* INFORMASI UTAMA */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Informasi Barang
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="kode_barang">Kode Barang</label>
            <input
              id="kode_barang"
              name="kode_barang"
              value={form.kode_barang}
              onChange={onChange}
              className="input font-mono"
              placeholder="BRG001"
              required
            />
            <FieldError errors={errors.kode_barang} />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="nama_barang">Nama Barang</label>
            <input
              id="nama_barang"
              name="nama_barang"
              value={form.nama_barang}
              onChange={onChange}
              className="input"
              placeholder="Kopi Arabica Gayo"
              required
            />
            <FieldError errors={errors.nama_barang} />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="kategori_id">Kategori</label>
            <select
              id="kategori_id"
              name="kategori_id"
              value={form.kategori_id}
              onChange={onChange}
              className="input"
            >
              <option value="">— Tanpa kategori —</option>
              {kategoris.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kategori}
                </option>
              ))}
            </select>
            <FieldError errors={errors.kategori_id} />
          </div>

          <div>
            <label className="label" htmlFor="satuan">Satuan</label>
            <select
              id="satuan"
              name="satuan"
              value={form.satuan}
              onChange={onChange}
              className="input"
            >
              <option value="pcs">Pcs</option>
              <option value="unit">Unit</option>
              <option value="box">Box</option>
              <option value="kg">Kg</option>
              <option value="liter">Liter</option>
            </select>
            <FieldError errors={errors.satuan} />
          </div>
        </div>
      </section>

      {/* HARGA & STOK */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Harga &amp; Stok
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="harga_beli">Harga Beli</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">Rp</span>
              <input
                id="harga_beli"
                type="number"
                name="harga_beli"
                value={form.harga_beli}
                onChange={onChange}
                className="input pl-9 tabular-nums"
                min="0"
                required
              />
            </div>
            <FieldError errors={errors.harga_beli} />
          </div>

          <div>
            <label className="label" htmlFor="harga_jual">Harga Jual</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">Rp</span>
              <input
                id="harga_jual"
                type="number"
                name="harga_jual"
                value={form.harga_jual}
                onChange={onChange}
                className="input pl-9 tabular-nums"
                min="0"
                required
              />
            </div>
            <FieldError errors={errors.harga_jual} />
          </div>

          <div>
            <label className="label" htmlFor="stok">Stok</label>
            <input
              id="stok"
              type="number"
              name="stok"
              value={form.stok}
              onChange={onChange}
              className="input tabular-nums"
              min="0"
              required
            />
            <FieldError errors={errors.stok} />
          </div>
        </div>
      </section>

      {/* GAMBAR */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Gambar
        </h3>

        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="Preview barang"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">No Image</span>
            )}
          </div>

          <div className="flex-1">
            <input
              id="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onImageChange}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              JPG, PNG, atau WEBP. Maksimal 2 MB.
            </p>
            <FieldError errors={errors.gambar} />
          </div>
        </div>
      </section>

      {/* DESKRIPSI */}
      <section>
        <label className="label" htmlFor="deskripsi">Deskripsi</label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          value={form.deskripsi}
          onChange={onChange}
          rows="3"
          className="input"
          placeholder="Keterangan singkat (opsional)"
        />
        <FieldError errors={errors.deskripsi} />
      </section>
    </form>
  );
}
