import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Kategori from "./pages/Kategori";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman login */}
        <Route path="/login" element={<Login />} />

         {/* Halaman yang dilindungi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/barang" element={<Barang />} />
          <Route path="/kategori" element={<Kategori />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}