import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Kategori from "./pages/Kategori";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/barang" element={<Barang />} />
        <Route path="/kategori" element={<Kategori />} />
      </Routes>
    </BrowserRouter>
  );
}