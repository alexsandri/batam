import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  LogOut,
  Boxes,
} from "lucide-react";

const menus = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Barang", icon: Package, path: "/barang" },
  { label: "Kategori", icon: Tags, path: "/kategori" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2">
            <Boxes size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Inventory App</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-3 px-3 text-xs uppercase tracking-wider text-slate-500">
          Menu Utama
        </p>

        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = location.pathname === menu.path;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-red-500/10 hover:text-red-400">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}