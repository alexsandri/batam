import api from './api';

const barangService = {
  // Mengambil data barang
  getAll: (params = {}) => {
    return api.get('/barangs', { params });
  },

  // Menampilkan detail barang
  getById: (id) => {
    return api.get(`/barangs/${id}`);
  },

  // Menambah barang
  create: (data) => {
    return api.post('/barangs', data);
  },

  // Mengubah barang
  update: (id, data) => {
    return api.post(`/barangs/${id}`, data);
  },

  // Menghapus barang
  delete: (id) => {
    return api.delete(`/barangs/${id}`);
  },
};

export default barangService;
