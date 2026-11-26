#!/usr/bin/env bash
# Menyiapkan aplikasi sekali saat Codespace dibuat: dependensi, basis data SQLite, dan data demo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT/backend"
composer install --no-interaction --prefer-dist

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate --force
fi

touch database/database.sqlite
php artisan migrate --force
php artisan storage:link --force

# Akun demo dibuat sekali; password acak disimpan di storage/app/demo-akun.txt (tidak masuk git).
if [ ! -f storage/app/demo-akun.txt ]; then
  PASSWORD="$(php -r 'echo bin2hex(random_bytes(6));')"
  ADMIN_EMAIL=admin@pos.test ADMIN_PASSWORD="$PASSWORD" php artisan db:seed --force
  DEMO_PASSWORD="$PASSWORD" php artisan db:seed --class=DemoSeeder --force
  cat > storage/app/demo-akun.txt <<AKUN
Akun demo (password sama untuk semua akun): $PASSWORD
  Admin : admin@pos.test
  Kasir : kasir@pos.test, sari@pos.test
AKUN
fi

cd "$ROOT/frontend"
npm ci
