#!/usr/bin/env bash
# Menjalankan backend (port 8000) dan frontend (port 5173) setiap Codespace dinyalakan.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT/backend"

# Di Codespaces, URL gambar harus memakai alamat publik port 5173 (diteruskan ke /storage oleh Vite).
if [ -n "${CODESPACE_NAME:-}" ]; then
  PUBLIC_URL="https://${CODESPACE_NAME}-5173.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  sed -i '/^ASSET_URL=/d' .env
  echo "ASSET_URL=${PUBLIC_URL}" >> .env
  php artisan config:clear > /dev/null
fi

setsid nohup php artisan serve --host=127.0.0.1 --port=8000 > /tmp/backend.log 2>&1 < /dev/null &

cd "$ROOT/frontend"
setsid nohup npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/frontend.log 2>&1 < /dev/null &

echo "Aplikasi berjalan di port 5173. Log: /tmp/backend.log dan /tmp/frontend.log"
cat "$ROOT/backend/storage/app/demo-akun.txt" 2>/dev/null || true
