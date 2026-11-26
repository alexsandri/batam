<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_pengguna_dapat_login_dan_menerima_token(): void
    {
        $user = User::factory()->admin()->create(['password' => 'rahasia123']);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'rahasia123',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);
    }

    public function test_login_gagal_dengan_password_salah(): void
    {
        $user = User::factory()->create(['password' => 'rahasia123']);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'salah',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_endpoint_terlindungi_menolak_tanpa_token(): void
    {
        $this->getJson('/api/barangs')->assertUnauthorized();
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_logout_mencabut_token(): void
    {
        $user = User::factory()->create(['password' => 'rahasia123']);
        $token = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'rahasia123',
        ])->json('token');

        $this->withToken($token)->postJson('/api/logout')->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
