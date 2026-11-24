<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class HargaDiskon extends TestCase
{
    public function test_menghitung_harga_setelah_diskon()
    {
        $harga = 100000;
        $diskon = 10;

        $hasil = $harga - ($harga * $diskon / 100);

        $this->assertEquals(90000, $hasil);
    }
}
