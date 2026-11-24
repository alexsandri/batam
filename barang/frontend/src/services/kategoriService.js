import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json'
    }
});

const kategorisService = {

    // Mengambil data kategori
    getAll: (params = {}) => {
        return api.get('/kategoris', { params });
    },

    // Menampilkan detail kategori
    getById: (id) => {
        return api.get(`/kategoris/${id}`);
    },

    // Menambah kategori
    create: (data) => {
        return api.post('/kategoris', data);
    },

    // Mengubah kategori
    update: (id, data) => {
        return api.post(`/kategoris/${id}`, data);
    },

    // Menghapus kategori
    delete: (id) => {
        return api.delete(`/kategoris/${id}`);
    }
};

export default kategorisService;