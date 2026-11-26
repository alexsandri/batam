import api from './api';

// Membuat service CRUD standar untuk satu endpoint REST
const createResource = (path) => ({
  getAll: (params = {}) => api.get(path, { params }),
  all: () => api.get(path, { params: { all: 1 } }),
  getById: (id) => api.get(`${path}/${id}`),
  create: (data) => api.post(path, data),
  update: (id, data) => api.put(`${path}/${id}`, data),
  delete: (id) => api.delete(`${path}/${id}`),
});

export const authService = {
  login: (data) => api.post('/login', data),
  me: () => api.get('/me'),
  logout: () => api.post('/logout'),
};

export const kategoriService = createResource('/kategoris');
export const pemasokService = createResource('/pemasoks');
export const userService = createResource('/users');
export const pembelianService = createResource('/pembelians');
export const penjualanService = createResource('/penjualans');

export const stokService = {
  mutasi: (params = {}) => api.get('/stok', { params }),
  penyesuaian: (data) => api.post('/stok/penyesuaian', data),
};

export const laporanService = {
  penjualan: (params = {}) => api.get('/laporan/penjualan', { params }),
  persediaan: (params = {}) => api.get('/laporan/persediaan', { params }),
};
