import { Search, Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Selamat datang di Inventory Management System
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari data..."
            className="rounded-xl border bg-slate-50 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
          />
        </div>

        <button className="relative text-slate-600">
          <Bell size={22} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={36} className="text-slate-400" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700">
              Administrator
            </p>
            <p className="text-xs text-slate-500">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}