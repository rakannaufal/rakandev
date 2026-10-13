# Acuan domain dan hosting Indonesia

Dicek 13 Oktober 2026. Biaya online terpisah dari jasa pembuatan. Domain sudah termasuk PPN 11% dan pembulatan ke atas; hosting memakai acuan sebelum pajak. Tarif dapat berubah; checkout menentukan harga, dokumen, promo, bundling, dan periode tagihan final. Data terstruktur: `src/data/infrastructure.mjs`. Merek dan URL sumber hanya dicatat untuk audit di dokumen ini; antarmuka serta ringkasan konsultasi menggunakan nama layanan generik.

## Hosting statis gratis

Cloudflare Pages Free memberi subdomain `namamu.pages.dev`, HTTPS, dan dukungan domain custom. Landing page, portofolio, dan profil statis dapat memakai pilihan ini. Subdomain provider bukan domain yang dimiliki sendiri. Domain custom dibeli terpisah; hostingnya tetap boleh gratis.

[Batas resmi Pages](https://developers.cloudflare.com/pages/platform/limits/): 500 build/bulan, 20.000 file, maksimum 25 MiB/file. Backend, database, email bisnis, serta Functions memiliki kebutuhan/kuota tersendiri. Tidak ada angka pengunjung buatan untuk menentukan kapan harus membayar; lihat workload, bandwidth, fungsi, syarat provider, dan hasil pengujian.

## Domain

Sumber tarif: screenshot daftar domain DomaiNesia yang diberikan pengguna, 13 Oktober 2026; [halaman domain](https://www.domainesia.com/domain/) sebagai referensi penyedia. Screenshot subtotal pembayaran .com menunjukkan Rp137.000 + PPN Rp15.070 = Rp152.070. Sesuai koreksi pengguna berikutnya, total dibulatkan ke atas per Rp5.000 sehingga menjadi Rp155.000. Tidak ada margin jasa tambahan; selisih pembulatan dipisahkan dari pajak.

| Ekstensi | Subtotal daftar | PPN 11% | Pembulatan | Total tahun pertama | Total perpanjangan / tahun |
| --- | --- | --- | --- | --- | --- |
| .com | Rp137.000 | Rp15.070 | Rp2.930 | Rp155.000 | Rp235.000 |
| .id | Rp219.000 | Rp24.090 | Rp1.910 | Rp245.000 | Rp280.000 |
| .my.id | Rp9.900 | Rp1.089 | Rp4.011 | Rp15.000 | Rp40.000 |
| .web.id | Rp9.900 | Rp1.089 | Rp4.011 | Rp15.000 | Rp65.000 |
| .biz.id | Rp9.900 | Rp1.089 | Rp4.011 | Rp15.000 | Rp80.000 |
| .net | Rp168.000 | Rp18.480 | Rp3.520 | Rp190.000 | Rp280.000 |
| .org | Rp269.000 | Rp29.590 | Rp1.410 | Rp300.000 | Rp300.000 |
| .co.id | Rp295.000 | Rp32.450 | Rp2.550 | Rp330.000 | Rp335.000 |
| .online | Rp29.900 | Rp3.289 | Rp1.811 | Rp35.000 | Rp710.000 |
| .cloud | Rp44.900 | Rp4.939 | Rp161 | Rp50.000 | Rp590.000 |
| .site | Rp29.900 | Rp3.289 | Rp1.811 | Rp35.000 | Rp745.000 |
| .store | Rp68.000 | Rp7.480 | Rp4.520 | Rp80.000 | Rp1.055.000 |
| .xyz | Rp79.900 | Rp8.789 | Rp1.311 | Rp90.000 | Rp445.000 |
| .space | Rp45.900 | Rp5.049 | Rp4.051 | Rp55.000 | Rp810.000 |
| .it.com | Rp75.000 | Rp8.250 | Rp1.750 | Rp85.000 | Rp615.000 |
| .tech | Rp68.000 | Rp7.480 | Rp4.520 | Rp80.000 | Rp1.245.000 |
| .sch.id | Rp48.900 | Rp5.379 | Rp721 | Rp55.000 | Rp65.000 |
| .asia | Rp79.900 | Rp8.789 | Rp1.311 | Rp90.000 | Rp270.000 |
| .icu | Rp109.000 | Rp11.990 | Rp4.010 | Rp125.000 | Rp455.000 |
| .pw | Rp55.000 | Rp6.050 | Rp3.950 | Rp65.000 | Rp510.000 |

Tarif pendaftaran dapat berupa promo. Perpanjangan memakai subtotal renewal tersendiri, ditambah PPN 11%, lalu dibulatkan ke atas per Rp5.000. Rumus: ceil((subtotal + round(subtotal × 11%)) / 5000) × 5000. Selisih pembulatan setiap tarif tahunan selalu antara Rp0 dan Rp4.999; harga tidak dibulatkan ke bawah. Contoh .com renewal: Rp209.000 + PPN Rp22.990 + pembulatan Rp3.010 = Rp235.000.

Estimasi dua/tiga tahun menjumlahkan total tarif tahunan yang sudah dibulatkan: tahun pertama ditambah perpanjangan untuk tahun berikutnya. Ini anggaran periode, bukan penawaran tagihan multi-tahun dari registrar. Nama premium/reserved dan promosi bisa berbeda; tagihan dikonfirmasi sebelum pembayaran. .co.id dan .sch.id memerlukan dokumen sesuai ketentuan. Tidak ada pembelian otomatis. Merek sumber tidak ditampilkan pada UI.

## Hosting berbayar

Sumber: [Rumahweb hosting murah](https://www.rumahweb.com/hosting-murah/).

| Pilihan | Reguler / bulan | Promo yang ditampilkan / bulan tahun pertama | Resource acuan |
| --- | --- | --- | --- |
| Entry | Rp25.000 | Rp15.000 | 1 GB storage; CPU hingga 1 core shared; RAM 512 MB; 10 entry process; CPU harian 20% |
| Small | Rp50.000 | Rp17.900 | Batas 250.000 inode; CPU hingga 1 core shared; RAM hingga 1 GB, guaranteed 512 MB; 15 entry process; CPU harian 40% |
| Medium | Rp90.000 | Rp29.900 | Batas 250.000 inode; CPU hingga 1,5 core shared; RAM hingga 2 GB, guaranteed 1 GB; 20 entry process; CPU harian 60% |

SSL, database/email, dan fasilitas mengikuti paket provider. Backup mingguan Small/Medium mengikuti batas pemakaian <5 GB dan <75.000 inode. Shared resource bukan CPU dedicated; storage/inode bukan kapasitas pengguna tanpa batas.

Durasi 1/3/6/12/24 bulan pada form adalah kebutuhan dan estimasi anggaran. Perhitungan menggunakan harga reguler x bulan; tidak menganggap setiap provider menawarkan semua siklus atau promo yang sama. Perpanjangan hosting memakai acuan tarif reguler sekarang. VPS/cloud, ERP, database besar, atau banyak pengguna aktif memerlukan audit dan penawaran spesifik. Field custom mencatat lokasi, RAM/CPU/storage, database, backup, dukungan, dan perkiraan trafik.

## Pemeriksaan domain

Endpoint resmi dari [bootstrap RDAP IANA](https://data.iana.org/rdap/dns.json): .com/.net Verisign, .id PANDI, .org PIR, .online/.site/.store/.space/.tech/.pw Radix; .cloud Registry Cloud; .xyz/.icu CentralNic; .asia Identity Digital. Snapshot bootstrap di `rdap-bootstrap-reference.json`; `.it.com` belum memiliki cek otomatis dan ditampilkan sebagai unknown dengan alternatif. Browser mengirim nama domain input dan enam alternatif ke registry melalui endpoint tetap; tidak mengirim nama, kontak, atau ringkasan konsultasi.

Domain object yang cocok: terdaftar. RDAP 404 dengan `errorCode: 404`, atau respons kosong bertipe `application/rdap+json`: belum tercatat, kandidat pendaftaran; konfirmasi registrar tetap diperlukan. Blokir, rate limit, timeout, network error, non-JSON, atau object yang tidak cocok: belum dapat dipastikan. Respons sebelumnya dibatalkan saat nama berubah; hasil draft ditandai belum diperiksa ulang. Pemeriksaan live .com dan .id sudah diuji dari browser lokal. Alternatif dibentuk dari nama utama dengan ekstensi lain serta akhiran studio/digital. Semua diperiksa secara nyata, maksimal dua pemeriksaan paralel, timeout delapan detik per nama. Kandidat belum tercatat bisa dipilih; unknown diberi cek ulang; nama terdaftar tidak ditawarkan sebagai pendaftaran baru. Pemilihan kandidat mengisi field, mengubah mode ke custom, menghitung ulang tarif sesuai ekstensi, dan menyimpan hasil/draft. Pemeriksaan baru, perubahan input/mode, atau reset membatalkan hasil lama. Tidak ada pembelian atau provisioning otomatis.
