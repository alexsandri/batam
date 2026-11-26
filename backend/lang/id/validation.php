<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Baris Bahasa Validasi
    |--------------------------------------------------------------------------
    |
    | Pesan kesalahan bawaan yang dipakai kelas validator. Beberapa aturan
    | memiliki beberapa versi, misalnya aturan ukuran.
    |
    */

    'accepted' => ':Attribute harus diterima.',
    'accepted_if' => ':Attribute harus diterima bila :other bernilai :value.',
    'active_url' => ':Attribute harus berupa URL yang valid.',
    'after' => ':Attribute harus berupa tanggal setelah :date.',
    'after_or_equal' => ':Attribute harus berupa tanggal setelah atau sama dengan :date.',
    'alpha' => ':Attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':Attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
    'alpha_num' => ':Attribute hanya boleh berisi huruf dan angka.',
    'any_of' => ':Attribute tidak valid.',
    'array' => ':Attribute harus berupa array.',
    'array_keys' => ':Attribute hanya boleh berisi kunci berikut: :values.',
    'ascii' => ':Attribute hanya boleh berisi karakter alfanumerik dan simbol satu byte.',
    'base64' => ':Attribute harus berupa teks Base64 yang valid.',
    'before' => ':Attribute harus berupa tanggal sebelum :date.',
    'before_or_equal' => ':Attribute harus berupa tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':Attribute harus memiliki :min sampai :max item.',
        'file' => ':Attribute harus berukuran :min sampai :max kilobyte.',
        'numeric' => ':Attribute harus bernilai :min sampai :max.',
        'string' => ':Attribute harus terdiri dari :min sampai :max karakter.',
    ],
    'boolean' => ':Attribute harus bernilai benar atau salah.',
    'can' => ':Attribute berisi nilai yang tidak diizinkan.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'contains' => ':Attribute tidak memuat nilai yang diwajibkan.',
    'current_password' => 'Password salah.',
    'date' => ':Attribute harus berupa tanggal yang valid.',
    'date_equals' => ':Attribute harus berupa tanggal yang sama dengan :date.',
    'date_format' => ':Attribute harus sesuai format :format.',
    'decimal' => ':Attribute harus memiliki :decimal angka desimal.',
    'declined' => ':Attribute harus ditolak.',
    'declined_if' => ':Attribute harus ditolak bila :other bernilai :value.',
    'different' => ':Attribute dan :other harus berbeda.',
    'digits' => ':Attribute harus terdiri dari :digits digit.',
    'digits_between' => ':Attribute harus terdiri dari :min sampai :max digit.',
    'dimensions' => 'Dimensi gambar :attribute tidak valid.',
    'distinct' => ':Attribute memiliki nilai ganda.',
    'doesnt_contain' => ':Attribute tidak boleh memuat salah satu dari: :values.',
    'doesnt_end_with' => ':Attribute tidak boleh diakhiri salah satu dari: :values.',
    'doesnt_start_with' => ':Attribute tidak boleh diawali salah satu dari: :values.',
    'email' => ':Attribute harus berupa alamat email yang valid.',
    'encoding' => ':Attribute harus menggunakan encoding :encoding.',
    'ends_with' => ':Attribute harus diakhiri salah satu dari: :values.',
    'enum' => ':Attribute yang dipilih tidak valid.',
    'exists' => ':Attribute yang dipilih tidak ditemukan.',
    'extensions' => ':Attribute harus memiliki salah satu ekstensi berikut: :values.',
    'file' => ':Attribute harus berupa file.',
    'filled' => ':Attribute harus memiliki nilai.',
    'gt' => [
        'array' => ':Attribute harus memiliki lebih dari :value item.',
        'file' => ':Attribute harus berukuran lebih dari :value kilobyte.',
        'numeric' => ':Attribute harus lebih besar dari :value.',
        'string' => ':Attribute harus lebih dari :value karakter.',
    ],
    'gte' => [
        'array' => ':Attribute harus memiliki :value item atau lebih.',
        'file' => ':Attribute harus berukuran lebih dari atau sama dengan :value kilobyte.',
        'numeric' => ':Attribute harus lebih besar dari atau sama dengan :value.',
        'string' => ':Attribute harus terdiri dari :value karakter atau lebih.',
    ],
    'hex_color' => ':Attribute harus berupa warna heksadesimal yang valid.',
    'image' => ':Attribute harus berupa gambar.',
    'in' => ':Attribute yang dipilih tidak valid.',
    'in_array' => ':Attribute harus ada di :other.',
    'in_array_keys' => ':Attribute harus memuat setidaknya salah satu kunci berikut: :values.',
    'integer' => ':Attribute harus berupa bilangan bulat.',
    'ip' => ':Attribute harus berupa alamat IP yang valid.',
    'ipv4' => ':Attribute harus berupa alamat IPv4 yang valid.',
    'ipv6' => ':Attribute harus berupa alamat IPv6 yang valid.',
    'json' => ':Attribute harus berupa teks JSON yang valid.',
    'list' => ':Attribute harus berupa daftar.',
    'lowercase' => ':Attribute harus berupa huruf kecil.',
    'lt' => [
        'array' => ':Attribute harus memiliki kurang dari :value item.',
        'file' => ':Attribute harus berukuran kurang dari :value kilobyte.',
        'numeric' => ':Attribute harus lebih kecil dari :value.',
        'string' => ':Attribute harus kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':Attribute tidak boleh memiliki lebih dari :value item.',
        'file' => ':Attribute harus berukuran kurang dari atau sama dengan :value kilobyte.',
        'numeric' => ':Attribute harus lebih kecil dari atau sama dengan :value.',
        'string' => ':Attribute harus terdiri dari :value karakter atau kurang.',
    ],
    'mac_address' => ':Attribute harus berupa alamat MAC yang valid.',
    'max' => [
        'array' => ':Attribute tidak boleh memiliki lebih dari :max item.',
        'file' => ':Attribute tidak boleh lebih dari :max kilobyte.',
        'numeric' => ':Attribute tidak boleh lebih dari :max.',
        'string' => ':Attribute tidak boleh lebih dari :max karakter.',
    ],
    'max_digits' => ':Attribute tidak boleh lebih dari :max digit.',
    'mimes' => ':Attribute harus berupa file bertipe: :values.',
    'mimetypes' => ':Attribute harus berupa file bertipe: :values.',
    'min' => [
        'array' => ':Attribute harus memiliki minimal :min item.',
        'file' => ':Attribute harus berukuran minimal :min kilobyte.',
        'numeric' => ':Attribute minimal bernilai :min.',
        'string' => ':Attribute minimal terdiri dari :min karakter.',
    ],
    'min_digits' => ':Attribute minimal terdiri dari :min digit.',
    'missing' => ':Attribute harus tidak ada.',
    'missing_if' => ':Attribute harus tidak ada bila :other bernilai :value.',
    'missing_unless' => ':Attribute harus tidak ada kecuali :other bernilai :value.',
    'missing_with' => ':Attribute harus tidak ada bila :values ada.',
    'missing_with_all' => ':Attribute harus tidak ada bila :values ada.',
    'multiple_of' => ':Attribute harus kelipatan :value.',
    'not_in' => ':Attribute yang dipilih tidak valid.',
    'not_regex' => 'Format :attribute tidak valid.',
    'numeric' => ':Attribute harus berupa angka.',
    'password' => [
        'letters' => ':Attribute harus memuat minimal satu huruf.',
        'mixed' => ':Attribute harus memuat minimal satu huruf besar dan satu huruf kecil.',
        'numbers' => ':Attribute harus memuat minimal satu angka.',
        'symbols' => ':Attribute harus memuat minimal satu simbol.',
        'uncompromised' => ':Attribute ini pernah muncul dalam kebocoran data. Gunakan :attribute lain.',
    ],
    'present' => ':Attribute wajib ada.',
    'present_if' => ':Attribute wajib ada bila :other bernilai :value.',
    'present_unless' => ':Attribute wajib ada kecuali :other bernilai :value.',
    'present_with' => ':Attribute wajib ada bila :values ada.',
    'present_with_all' => ':Attribute wajib ada bila :values ada.',
    'prohibited' => ':Attribute tidak diizinkan.',
    'prohibited_if' => ':Attribute tidak diizinkan bila :other bernilai :value.',
    'prohibited_if_accepted' => ':Attribute tidak diizinkan bila :other diterima.',
    'prohibited_if_declined' => ':Attribute tidak diizinkan bila :other ditolak.',
    'prohibited_unless' => ':Attribute tidak diizinkan kecuali :other ada di :values.',
    'prohibits' => ':Attribute melarang :other untuk diisi.',
    'regex' => 'Format :attribute tidak valid.',
    'required' => ':Attribute wajib diisi.',
    'required_array_keys' => ':Attribute wajib memuat entri untuk: :values.',
    'required_if' => ':Attribute wajib diisi bila :other bernilai :value.',
    'required_if_accepted' => ':Attribute wajib diisi bila :other diterima.',
    'required_if_declined' => ':Attribute wajib diisi bila :other ditolak.',
    'required_unless' => ':Attribute wajib diisi kecuali :other ada di :values.',
    'required_with' => ':Attribute wajib diisi bila :values diisi.',
    'required_with_all' => ':Attribute wajib diisi bila :values diisi.',
    'required_without' => ':Attribute wajib diisi bila :values tidak diisi.',
    'required_without_all' => ':Attribute wajib diisi bila :values tidak ada yang diisi.',
    'same' => ':Attribute harus sama dengan :other.',
    'size' => [
        'array' => ':Attribute harus memuat :size item.',
        'file' => ':Attribute harus berukuran :size kilobyte.',
        'numeric' => ':Attribute harus bernilai :size.',
        'string' => ':Attribute harus terdiri dari :size karakter.',
    ],
    'starts_with' => ':Attribute harus diawali salah satu dari: :values.',
    'string' => ':Attribute harus berupa teks.',
    'timezone' => ':Attribute harus berupa zona waktu yang valid.',
    'unique' => ':Attribute sudah digunakan.',
    'uploaded' => ':Attribute gagal diunggah.',
    'uppercase' => ':Attribute harus berupa huruf besar.',
    'url' => ':Attribute harus berupa URL yang valid.',
    'ulid' => ':Attribute harus berupa ULID yang valid.',
    'uuid' => ':Attribute harus berupa UUID yang valid.',

    /*
    |--------------------------------------------------------------------------
    | Pesan Validasi Khusus
    |--------------------------------------------------------------------------
    */

    'custom' => [
        'items' => [
            'required' => 'Pilih minimal satu barang.',
            'min' => 'Pilih minimal satu barang.',
        ],
        'items.*.barang_id' => [
            'distinct' => 'Barang yang sama dipilih lebih dari sekali.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Nama Atribut
    |--------------------------------------------------------------------------
    |
    | Mengganti nama kolom dengan sebutan yang mudah dibaca,
    | misalnya "kode_barang" menjadi "Kode barang".
    |
    */

    'attributes' => [
        'name' => 'nama',
        'email' => 'email',
        'password' => 'password',
        'role' => 'peran',
        'kode_barang' => 'kode barang',
        'nama_barang' => 'nama barang',
        'kategori' => 'kategori',
        'deskripsi' => 'deskripsi',
        'harga_beli' => 'harga beli',
        'harga_jual' => 'harga jual',
        'stok' => 'stok',
        'satuan' => 'satuan',
        'gambar' => 'gambar',
        'nama_kategori' => 'nama kategori',
        'nama_pemasok' => 'nama pemasok',
        'telepon' => 'telepon',
        'alamat' => 'alamat',
        'pemasok_id' => 'pemasok',
        'tanggal' => 'tanggal',
        'catatan' => 'catatan',
        'bayar' => 'jumlah bayar',
        'items' => 'daftar barang',
        'items.*.barang_id' => 'barang',
        'items.*.jumlah' => 'jumlah',
        'items.*.harga_beli' => 'harga beli',
        'barang_id' => 'barang',
        'stok_baru' => 'stok baru',
        'keterangan' => 'keterangan',
        'dari' => 'tanggal awal',
        'sampai' => 'tanggal akhir',
        'batas' => 'batas stok menipis',
    ],

];
