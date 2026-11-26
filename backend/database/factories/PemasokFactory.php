<?php

namespace Database\Factories;

use App\Models\Pemasok;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pemasok>
 */
class PemasokFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_pemasok' => fake()->company(),
            'telepon' => fake()->numerify('08##########'),
            'email' => fake()->safeEmail(),
            'alamat' => fake()->address(),
        ];
    }
}
