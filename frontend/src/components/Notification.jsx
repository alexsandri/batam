import { useEffect } from 'react';

// Toast di pojok atas: hijau untuk sukses, merah untuk error.
// Hilang otomatis setelah 4 detik.
export default function Notification({ message, isError, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="status"
        className={`flex max-w-md items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
          isError
            ? 'border-red-200 bg-red-100 text-red-700'
            : 'border-green-200 bg-green-100 text-green-700'
        }`}
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="opacity-60 hover:opacity-100"
          aria-label="Tutup notifikasi"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
