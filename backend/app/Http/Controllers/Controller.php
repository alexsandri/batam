<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

abstract class Controller
{
    /**
     * Membuat nomor faktur berurutan per tanggal, misalnya PJ-20261126-0001.
     *
     * @param  class-string<Model>  $modelClass
     */
    protected function nomorFaktur(string $prefix, string $modelClass, string $tanggal): string
    {
        $kodeTanggal = Carbon::parse($tanggal)->format('Ymd');
        $awalan = $prefix.'-'.$kodeTanggal.'-';

        $terakhir = $modelClass::where('no_faktur', 'like', $awalan.'%')
            ->orderByDesc('no_faktur')
            ->value('no_faktur');

        $urutan = $terakhir ? ((int) substr($terakhir, -4)) + 1 : 1;

        return $awalan.str_pad((string) $urutan, 4, '0', STR_PAD_LEFT);
    }
}
