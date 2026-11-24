<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class HargaTest extends TestCase
{
    public function test_menghitung_harga_setelah_diskon()
    {
        $harga = 1000;
        $diskon = 10;

        $hasil = $harga - ($harga * $diskon / 100);

        $this->assertEquals(900, $hasil);
    }

    public function test_menghitung_harga_beli()
    {
        $harga = 1000;
        $qty = 10;

        $hasil = $harga * $qty;

        $this->assertEquals(100000, $hasil);
    }
}
