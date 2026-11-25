import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json'
  }
});

const kategoriService = {
  // Mengambil semua kategori (opsional: { search })
  getAll: (params = {}) => api.get('/kategoris', { params }),

  // Menampilkan detail kategori
  getById: (id) => api.get(`/kategoris/${id}`),

  // Menambah kategori
  create: (data) => api.post('/kategoris', data),

  // Mengubah kategori
  update: (id, data) => api.put(`/kategoris/${id}`, data),

  // Menghapus kategori
  delete: (id) => api.delete(`/kategoris/${id}`)
};

export default kategoriService;
