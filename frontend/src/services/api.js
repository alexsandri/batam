import axios from 'axios';

export const TOKEN_KEY = 'pos_token';

// Instance Axios bersama: menyisipkan token login di setiap request
const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Token kedaluwarsa atau dicabut: kembali ke halaman login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.reload();
    }

    return Promise.reject(error);
  },
);

export default api;
