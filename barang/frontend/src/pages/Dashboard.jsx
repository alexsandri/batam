import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

import {
  Package,
  Tags,
  Boxes,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [barangs, setBarangs] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [barangResponse, kategoriResponse] = await Promise.all([
        api.get("/barangs"),
        api.get("/kategoris"),
      ]);

      setBarangs(barangResponse.data.data);
      setKategoris(kategoriResponse.data.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data dashboard.");
    } finally {
      setLoading(false);
    }
  }

  const totalBarang = barangs.length;
  const totalKategori = kategoris.length;

  const totalStok = barangs.reduce(
    (total, barang) => total + Number(barang.stok || 0),
    0
  );

  const barangStokMenipis = barangs.filter(
    (barang) => Number(barang.stok) <= 5
  );

  // Menghitung jumlah barang per kategori
  const dataKategori = kategoris.map((kategori) => ({
    id: kategori.id,
    name: kategori.name,
    value: barangs.filter(
      (barang) => Number(barang.kategori_id) === Number(kategori.id)
    ).length,
  })).filter((kategori) => kategori.value > 0);

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#F97316",
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="mt-1 text-slate-500">
              Ringkasan informasi inventaris barang
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>

        {loading && (
          <p className="text-slate-500">Memuat data dashboard...</p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistik */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Barang"
                value={totalBarang}
                description="Jumlah jenis barang terdaftar"
                icon={Package}
                color="blue"
              />

              <StatCard
                title="Total Kategori"
                value={totalKategori}
                description="Kategori barang tersedia"
                icon={Tags}
                color="purple"
              />

              <StatCard
                title="Total Stok"
                value={totalStok.toLocaleString("id-ID")}
                description="Jumlah seluruh stok barang"
                icon={Boxes}
                color="green"
              />

              <StatCard
                title="Stok Menipis"
                value={barangStokMenipis.length}
                description="Barang dengan stok ≤ 5"
                icon={AlertTriangle}
                color="orange"
              />
            </div>

            {/* Grafik dan Peringatan */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* Grafik */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                <h2 className="text-lg font-semibold text-slate-800">
                  Distribusi Barang per Kategori
                </h2>

                <p className="mb-4 mt-1 text-sm text-slate-500">
                  Perbandingan jumlah jenis barang
                </p>

                {dataKategori.length > 0 ? (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataKategori}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={60}
                          paddingAngle={3}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {dataKategori.map((item, index) => (
                            <Cell
                              key={item.id}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-80 items-center justify-center text-slate-400">
                    Belum ada data kategori barang
                  </div>
                )}
              </div>

              {/* Peringatan stok */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" size={22} />

                  <h2 className="text-lg font-semibold text-slate-800">
                    Peringatan Stok
                  </h2>
                </div>

                <div className="space-y-3">
                  {barangStokMenipis.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Tidak ada barang dengan stok menipis.
                    </p>
                  ) : (
                    barangStokMenipis.slice(0, 5).map((barang) => (
                      <div
                        key={barang.id}
                        className="flex items-center justify-between rounded-xl bg-orange-50 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-700">
                            {barang.nama_barang}
                          </p>

                          <p className="text-xs text-slate-500">
                            {barang.kode_barang}
                          </p>
                        </div>

                        <span className="ml-3 rounded-lg bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                          {barang.stok}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tabel barang terbaru */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Daftar Barang
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Data barang yang tersedia pada sistem
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Barang</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4">Stok</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {barangs.slice(0, 10).map((barang) => (
                      <tr key={barang.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">
                            {barang.nama_barang}
                          </div>

                          <div className="text-xs text-slate-400">
                            {barang.kode_barang}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {barang.kategori || "-"}
                        </td>

                        <td className="px-6 py-4">
                          Rp {Number(barang.harga || 0).toLocaleString("id-ID")}
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {barang.stok}
                        </td>

                        <td className="px-6 py-4">
                          {Number(barang.stok) <= 5 ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                              Stok Rendah
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                              Tersedia
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {barangs.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    Belum ada data barang
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}