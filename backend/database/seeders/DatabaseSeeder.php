<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Membuat akun admin pertama.
     *
     * Email dan password diambil dari ADMIN_EMAIL dan ADMIN_PASSWORD di .env.
     * Bila ADMIN_PASSWORD kosong, password acak dibuat dan ditampilkan sekali di terminal.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@pos.test');

        if (User::where('email', $email)->exists()) {
            $this->command->info("Admin {$email} sudah ada, dilewati.");

            return;
        }

        $password = env('ADMIN_PASSWORD') ?: Str::password(12, symbols: false);

        User::create([
            'name' => 'Administrator',
            'email' => $email,
            'role' => User::ROLE_ADMIN,
            'password' => $password,
        ]);

        $this->command->info("Admin dibuat: {$email}");

        if (! env('ADMIN_PASSWORD')) {
            $this->command->warn("Password sementara: {$password} (segera ganti lewat menu Pengguna)");
        }
    }
}
