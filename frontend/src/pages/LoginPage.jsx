import { useState } from 'react';
import { Alert, Button, Field, inputClass } from '../components/ui';
import { TOKEN_KEY } from '../services/api';
import { authService } from '../services/resourceServices';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});
      setMessage('');

      const response = await authService.login(form);
      localStorage.setItem(TOKEN_KEY, response.data.token);
      onLogin(response.data.user);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response?.status === 429) {
        setMessage('Terlalu banyak percobaan login. Coba lagi sebentar.');
      } else {
        setMessage('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xl font-bold">
            POS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke Aplikasi</h1>
          <p className="text-gray-500 text-sm mt-1">Manajemen Inventaris dan Penjualan Barang</p>
        </div>

        <Alert type="error">{message}</Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nama@contoh.com"
              required
              autoFocus
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              type="password"
              className={inputClass}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>

          <Button type="submit" disabled={loading} className="w-full py-3">
            {loading ? 'Memproses...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
