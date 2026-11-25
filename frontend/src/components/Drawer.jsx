import { useEffect } from 'react';

// Panel form yang muncul dari sisi kanan layar (slide-over).
// Tombol Simpan terhubung ke <form id={formId}> di dalamnya.
export default function Drawer({ open, title, onClose, children, formId, saving, submitLabel = 'Simpan' }) {
  // Tutup dengan tombol Esc dan kunci scroll halaman saat terbuka
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Latar gelap, klik untuk menutup */}
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between bg-blue-700 px-6 py-4 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-blue-100 hover:bg-blue-600 hover:text-white"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            type="submit"
            form={formId}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : submitLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}
