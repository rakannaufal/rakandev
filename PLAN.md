# Plan Website RakanDev

Tanggal: 13 Oktober 2026. Status: rencana implementasi, belum website produksi.

## 1. Tujuan dan dasar proyek

RakanDev menjadi website penawaran jasa website dan sistem operasional untuk pasar Indonesia. Pengunjung dapat memahami kategori layanan, membandingkan harga, mencoba contoh website, lalu mengirim kebutuhan yang sudah menyebut paket atau demo pilihan.

Dasar konten:

- `../creativeluv/katalog-harga.md`: harga, batas paket, tambahan, pembayaran, dan garansi.
- `../creativeluv/business-plan.md`, terutama Bagian 4 dan 13: layanan web, tujuh fondasi ERP, delapan kelompok, 26 modul, dan 12 jenis usaha.
- `../creativeluv/clientops/core.mjs`: 11 ID produk dan aturan harga custom.
- `../creativeluv/clientops/docs/PRD.md` dan `docs/ARCHITECTURE.md`: alur intake dan batas integrasi ClientOps.

Folder RakanDev saat audit masih kosong. RakanDev memakai katalog bisnis CreativeLuv sebagai acuan; identitas publik memakai RD / RakanDev. Dashboard internal ClientOps tetap merupakan aplikasi operasional tersendiri.

Definisi "semua kategori": seluruh 11 penawaran, 18 tambahan web termasuk pemeliharaan, 26 modul dalam delapan kelompok ERP, delapan pekerjaan pendukung ERP, serta 12 kategori usaha. Harga dari sumber dipertahankan. Layanan yang belum mempunyai harga tetap ditampilkan sebagai penawaran setelah konsultasi.

## 2. Pengguna dan alur utama

Pengguna utama: pemilik UMKM, profesional, kreator, dan penanggung jawab operasional yang membuka website melalui ponsel. Prioritas penjualan awal mengikuti sumber: usaha jasa, interior, renovasi, dan kontraktor kecil.

Alur pengunjung:

1. Melihat headline, harga awal, dan dua pilihan tindakan di hero.
2. Memilih Website, Sistem ERP, atau Kebutuhan custom.
3. Membaca harga beserta isi dan batasnya.
4. Membuka demo yang sesuai, mencoba fungsi, lalu kembali ke penawaran.
5. Mengisi brief ringkas dengan paket, demo, tambahan, dan kebutuhan yang sudah dipilih.
6. Mendapat ringkasan untuk konsultasi; scope dan harga akhir dikunci sebelum pembayaran.

Tindakan konversi memakai satu label konsisten: "Konsultasi kebutuhan". "Lihat demo" menjadi tindakan eksplorasi. Demo tidak mengirim pesan, menerima pembayaran, atau membuat akun produksi.

## 3. Sitemap

| Halaman | Rute | Isi utama |
| --- | --- | --- |
| Beranda | `/` | Hero doodle, pilihan layanan, demo pilihan, harga web, proses, FAQ, konsultasi |
| Pricing | `/pricing/` | Tab Website / ERP / Custom, perbandingan, tambahan, biaya terpisah |
| Katalog layanan | `/layanan/` | Semua penawaran, filter jenis layanan, harga dan tautan demo |
| Detail layanan | `/layanan/[productId]/` | Scope, batas, jadwal, pembayaran, demo, CTA |
| Katalog demo | `/demo/` | Filter jenis website, paket, dan jenis usaha; pencarian; preview |
| Demo produk | `/demo/[productId]/` | Demo untuk tiap produk; Discovery menampilkan contoh hasil audit |
| Kategori ERP | `/erp/` | Delapan kelompok, tujuh fondasi, paket, kebutuhan discovery |
| Modul ERP | `/erp/modul/[moduleId]/` | Harga konfigurasi terbatas, fitur acuan, dependensi, demonstrasi |
| Solusi usaha | `/solusi/[industryId]/` | 12 jenis usaha, modul terkait, kebutuhan sektor, indikasi budget |
| Demo usaha | `/demo/solusi/[industryId]/` | Dataset dan alur simulasi berbeda untuk tiap jenis usaha |
| Custom | `/custom/` | Website custom, ERP pada platform, ERP dari nol, formulir brief |
| Proses | `/proses/` | Brief, proposal, pembayaran, produksi, review, peluncuran, garansi |
| Konsultasi | `/konsultasi/` | Brief, ringkasan pilihan, kontak resmi yang dikonfigurasi |
| Ketentuan | `/ketentuan/` | Batas jasa, revisi, biaya eksternal, pembayaran, kepemilikan aset |
| Privasi | `/privasi/` | Data formulir, tujuan, penyimpanan, kontak pengelola |
| Tidak ditemukan | `/404.html` | Tautan kembali ke katalog dan beranda |

Navigasi desktop: Layanan, Harga, Demo, Custom, Proses; CTA konsultasi. Navigasi mobile memakai menu sederhana dengan tombol tutup dan fokus keyboard yang benar.

## 4. Katalog penawaran dan harga

### 4.1 Website

| ID sumber | Penawaran | Harga jasa | Cakupan utama | Contoh demo |
| --- | --- | --- | --- | --- |
| `landing` | Landing page Basic | Rp300.000 | Satu halaman, maksimal empat bagian, 300 kata, lima gambar | RD Interior: layanan, manfaat, hasil, kontak |
| `portfolio` | Portofolio Basic | Rp300.000 | Satu halaman, maksimal empat bagian dan tiga karya; 300 kata, lima gambar total | RD Studio: profil, layanan, tiga karya, kontak |
| `plus` | Website Plus | Rp650.000 | Basic, dua bagian tambahan, penulisan maksimal 500 kata total, formulir kontak | RD Renovasi: enam bagian dan simulasi formulir |
| `profile` | Profil tiga halaman | Rp750.000 | Basic, dua halaman template tambahan, penulisan maksimal 500 kata total | RD Works: beranda, profil/layanan, karya/kontak |
| `custom` | Website custom | Setelah konsultasi | CMS, login, database, pembayaran, toko online, atau alur khusus sesuai brief | RD Shop: katalog, keranjang, checkout simulasi |

Basic adalah template dengan penyesuaian warna dan logo. Desain khusus, formulir, CMS, login, database, toko online, logo baru, serta penulisan dari nol tidak otomatis termasuk.

Ketentuan web: satu putaran revisi kecil terkonsolidasi, maksimal tiga perubahan kecil dan sekitar 20 menit kerja; garansi bug dalam scope 14 hari. Basic menargetkan dua sampai tiga hari kerja setelah bahan lengkap, template dipilih, DP diterima, dan sesuai antrean. Jadwal Plus, profil, serta custom dikonfirmasi dalam proposal.

DP web 50%, pelunasan 50% setelah penerimaan staging sebelum peluncuran atau serah terima. Basic dapat dibeli tanpa tambahan wajib. Koneksi satu domain milik klien termasuk; pembelian domain terpisah.

### 4.2 Tambahan website

| Tambahan | Harga jasa | Batas utama |
| --- | --- | --- |
| Bagian tambahan | Rp50.000 / bagian | Mengikuti template; bahan siap |
| Halaman statis tambahan | Rp150.000 / halaman | Maksimal empat bagian; mengikuti template |
| Galeri tambahan | Rp50.000 / tiga karya | Satu gambar dan deskripsi per karya; tanpa halaman detail |
| Revisi kecil tambahan | Rp50.000 / putaran | Maksimal tiga perubahan kecil; sekitar 20 menit |
| Penulisan materi | Rp150.000 | Maksimal 500 kata total, satu bahasa, satu koreksi |
| Desain susunan khusus | Rp350.000 | Satu halaman, maksimal enam bagian, satu arah, satu revisi desain |
| Animasi ringan | Rp50.000 | Maksimal tiga elemen sederhana |
| Formulir kontak | Rp100.000 | Maksimal lima kolom, satu penerima, tanpa upload |
| Tombol kontak tambahan | Rp50.000 | Maksimal tiga nomor/kanal tambahan |
| Peta lokasi tertanam | Rp50.000 | Satu lokasi melalui embed resmi |
| Galeri dengan penyaring | Rp100.000 | Maksimal 12 karya dan tiga kategori; tanpa CMS |
| Bahasa kedua | Rp150.000 | Satu halaman; terjemahan disediakan klien |
| Penerjemahan materi | Rp150.000 | Maksimal 500 kata ke satu bahasa yang dapat diperiksa |
| Pemasangan analitik | Rp100.000 | Satu akun klien; satu tindakan utama |
| Search Console dan sitemap | Rp100.000 | Satu domain; indeks tidak dijamin |
| Metadata berbagi tautan | Rp50.000 | Judul, deskripsi, satu gambar preview |
| Tautan pemesanan eksternal | Rp100.000 | Satu layanan klien; bukan pembuatan sistem booking |
| Pemeliharaan opsional | Rp100.000 / bulan | Maksimal 30 menit total per bulan; tanpa akumulasi |

### 4.3 Paket ERP

| ID sumber | Penawaran | Harga jasa | Batas awal | Asumsi kalender dari sumber |
| --- | --- | --- | --- | --- |
| `erp-discovery` | Discovery ERP | Rp1.200.000 | Satu proses, satu sesi maksimal 90 menit, peta alur/role/data/modul/risiko/estimasi | Sekitar lima hari kerja |
| `erp-pilot` | Pilot CRM dan proyek | Mulai Rp3.000.000 | Satu perusahaan, lima pengguna, pipeline, tugas/milestone, kas sederhana, dua laporan, impor 200 baris, pelatihan satu jam | Dua sampai tiga minggu |
| `erp-starter` | ERP Starter | Mulai Rp6.000.000 | Satu perusahaan/lokasi, sepuluh pengguna, faktur/pembayaran/piutang/jurnal, empat laporan, impor 500 baris, satu template cetak, pelatihan dua jam | Tiga sampai lima minggu |
| `erp-operations` | ERP Operasional | Mulai Rp12.000.000 | Satu perusahaan, dua gudang, 20 pengguna, penjualan/pembelian/stok/akuntansi, enam laporan, impor 1.000 baris, dua approval sederhana, dua pelatihan dua jam | Lima sampai delapan minggu |
| `erp-custom` | ERP custom pada platform | Mulai Rp15.000.000 | Fondasi platform teruji dan alur/modul khusus; anggaran awal 80 jam dasar + 20 jam cadangan | Enam sampai 12 minggu |
| `erp-zero` | ERP custom dari nol | Mulai Rp45.000.000 | Sistem dengan scope terbatas; 240 jam dasar + 60 jam cadangan | Empat sampai enam bulan pada kapasitas produksi 80 jam/bulan |

Harga ERP adalah usulan awal dari CreativeLuv. Penawaran implementasi memerlukan verifikasi kemampuan platform dan penyedia. Batas pengguna adalah batas konfigurasi, bukan jaminan kapasitas server atau lisensi gratis. Harga custom awal tidak mencakup semua 26 modul.

Discovery dibayar 100% di awal, terpisah dari implementasi kecuali kredit dinyatakan di proposal. Implementasi mengusulkan tahap 40% / 30% / 20% / 10% sesuai kontrak. Paket implementasi memuat instalasi milik klien, role/akses data, 2FA admin yang diverifikasi, backup dan satu uji restore, demo, koreksi minor, panduan, serta garansi bug 30 hari. Pilot belum mencakup akuntansi penuh.

### 4.4 Delapan kelompok dan seluruh 26 modul ERP

| Kelompok | Modul | Harga mulai konfigurasi terbatas |
| --- | --- | --- |
| Keuangan dan Akuntansi | Akuntansi/Jurnal/Aset | Rp3.000.000 |
| Keuangan dan Akuntansi | Anggaran dan Perencanaan Keuangan | Rp3.000.000 |
| Keuangan dan Akuntansi | Kas dan Bank | Rp3.000.000 |
| Keuangan dan Akuntansi | Perpajakan | Rp4.500.000 |
| Sumber Daya Manusia | Personalia/Penggajian | Rp4.500.000 |
| Sumber Daya Manusia | Portal Karyawan | Rp3.000.000 |
| Penjualan dan Pelanggan | Penjualan | Rp3.000.000 |
| Penjualan dan Pelanggan | CRM | Rp2.250.000 |
| Penjualan dan Pelanggan | POS Kasir | Rp4.500.000 |
| Penjualan dan Pelanggan | E-Commerce | Rp7.500.000 |
| Penjualan dan Pelanggan | Layanan Pelanggan/After-Sales | Rp3.000.000 |
| Penjualan dan Pelanggan | Portal Pelanggan | Rp4.500.000 |
| Rantai Pasok dan Logistik | Pembelian/Stok/Logistik | Rp4.500.000 |
| Rantai Pasok dan Logistik | Armada dan Transportasi | Rp4.500.000 |
| Rantai Pasok dan Logistik | Kontrak dan Vendor | Rp2.250.000 |
| Rantai Pasok dan Logistik | Portal Supplier | Rp4.500.000 |
| Operasional dan Produksi | Produksi/Manufaktur/Biaya | Rp7.500.000 |
| Operasional dan Produksi | Manajemen Kualitas (QC) | Rp3.000.000 |
| Operasional dan Produksi | Pemeliharaan (CMMS) | Rp3.000.000 |
| Operasional dan Produksi | Manajemen Proyek | Rp3.000.000 |
| Administrasi, Kontrol, dan Kepatuhan | Workflow dan Approval | Rp2.250.000 |
| Administrasi, Kontrol, dan Kepatuhan | Manajemen Dokumen | Rp2.250.000 |
| Administrasi, Kontrol, dan Kepatuhan | Kepatuhan, Risiko, Audit | Rp3.000.000 |
| Analitik dan Pelaporan | Dashboard, Laporan, BI | Rp3.000.000 |
| Platform dan Pengaturan Sistem | Administrasi Sistem | Rp2.250.000 |
| Platform dan Pengaturan Sistem | Integrasi dan Pengembangan | Rp4.500.000 |

Setiap detail modul menampilkan terpisah: batas konfigurasi berharga, fitur lengkap sebagai acuan discovery, dependensi, dan fitur yang memerlukan custom. Menjumlahkan 26 harga modul bukan estimasi satu ERP lengkap. Modul yang sudah termasuk paket tidak ditagih lagi.

Tujuh fondasi ditampilkan sebagai cakupan arsitektur: Login dan Keamanan, Dashboard, Master Data, Keuangan, Approval, Laporan, Pengaturan. Kedalaman mengikuti paket; fondasi keamanan, akses data, log kritis, backup, dan restore tersedia sejak pilot.

### 4.5 Pekerjaan pendukung ERP

| Pekerjaan | Harga mulai | Batas utama |
| --- | --- | --- |
| Impor data tambahan | Rp750.000 | Satu CSV bersih, maksimal 1.000 baris; preview dan rekonsiliasi |
| Laporan khusus | Rp750.000 | Satu laporan dari field tersedia, filter dan ekspor standar |
| Template cetak | Rp375.000 | Satu dokumen tersedia, satu revisi |
| Pelatihan tambahan | Rp375.000 | Sesi daring dua jam dan persiapan 30 menit |
| Notifikasi WhatsApp resmi | Rp3.000.000 | Satu pemicu dan template; provider resmi, biaya pesan terpisah |
| POS offline | Rp6.000.000 | Satu perangkat/alur; kelayakan dan sinkronisasi diuji |
| Aplikasi mobile khusus | Rp15.000.000 | Satu alur dan satu platform; backend tersedia |
| Pemeliharaan ERP | Rp500.000 / bulan | Maksimal 2,5 jam total; waktu respons hari kerja disepakati |

### 4.6 Seluruh 12 kategori usaha

| Kategori | Indikasi budget jasa dari sumber | Alur yang dicontohkan di demo |
| --- | --- | --- |
| Toko Retail / Minimarket | Rp24.000.000 sampai Rp45.000.000 | Pilih barang, transaksi kasir simulasi, struk, perubahan stok |
| Distributor / Grosir | Rp30.000.000 sampai Rp60.000.000 | Penawaran, order, pengiriman, faktur, piutang |
| Pabrik / Manufaktur | Rp60.000.000 sampai Rp150.000.000 | BOM sederhana, work order, hasil, inspeksi QC |
| Kontraktor / Konstruksi | Rp30.000.000 sampai Rp75.000.000 | Proyek, RAB contoh, progres, termin |
| Perusahaan Jasa / Konsultan / Agensi | Rp18.000.000 sampai Rp30.000.000 | Lead, pipeline, tugas, timesheet, invoice |
| Restoran / Kafe / F&B | Rp30.000.000 sampai Rp60.000.000 | Order meja, antrean dapur contoh, bill, stok bahan |
| Klinik / Rumah Sakit | Klinik Rp60.000.000 sampai Rp150.000.000; rumah sakit diaudit terpisah | Antrean dan billing dengan pasien fiktif |
| Sekolah / Kampus / Lembaga Kursus | Sekolah/kursus Rp45.000.000 sampai Rp90.000.000; skala kampus terpisah | Siswa fiktif, jadwal, tagihan, status pembayaran simulasi |
| Agribisnis / Perkebunan / Perikanan | Rp45.000.000 sampai Rp90.000.000 | Blok/kolam, kegiatan, biaya, hasil panen |
| Logistik / Ekspedisi / Transportasi | Rp45.000.000 sampai Rp90.000.000 | Order, manifest, penugasan, status pengiriman simulasi |
| Properti / Real Estate | Rp30.000.000 sampai Rp75.000.000 | Unit, booking simulasi, cicilan, progres |
| Toko Online / E-Commerce | Rp30.000.000 sampai Rp60.000.000 | Katalog, keranjang, order, status, stok |

Rentang adalah indikasi untuk kebutuhan terpilih setelah discovery, bukan harga lengkap semua fitur suatu sektor. Detail modul inti/opsional dan fitur sektor dipertahankan dalam `planning/catalog.json`.

## 5. Struktur dan gaya visual

Gaya: hand-drawn doodle minimalism, ramah, santai, terinspirasi bahasa visual Odoo. Identitas RD, ilustrasi, ikon, serta susunan halaman dibuat sendiri.

### Hero yang akan dibuat

- Headline tengah: "Website untuk bisnismu. Siap bertumbuh bareng."
- Font headline Kalam 700; ukuran responsif 44-76px, dua baris desktop.
- Dua kata yang diberi highlight oranye: "Website" dan "bisnismu". SVG path sedikit tidak beraturan, berada di belakang teks, tidak memotong huruf.
- Kata "bertumbuh" memakai garis bawah SVG biru seperti sapuan kuas.
- Subteks: "Dari landing page sampai sistem operasional, pilih yang pas untuk kebutuhan dan anggaranmu."
- CTA primer plum solid "Konsultasi kebutuhan"; sekunder abu muda "Lihat demo"; radius 8px, tinggi minimal 44px.
- Catatan harga tulisan tangan sedikit miring: "Mulai Rp300 ribu, sekali bayar*". Panah lengkung SVG mengarah ke catatan ini.
- Penjelasan bintang dekat catatan: "Paket Basic. Domain dan layanan berbayar terpisah."
- Pembatas melengkung mengalir ke bagian berlatar abu sangat muda.
- Deretan ikon aplikasi berwarna menunjukkan kategori nyata. Setiap ikon menuju kategori, mempunyai label teks dan bayangan lembut.

### Token utama

| Peran | Nilai |
| --- | --- |
| Latar | `#FFFFFF` |
| Latar bagian lembut | `#F6F5F7` |
| Teks utama | `#202733` |
| Teks sekunder | `#58606D` |
| Tombol utama | `#875A7B` |
| Tombol hover | `#704966` |
| Highlight | `#F9AE2D` |
| Coretan biru | `#2878B7` |
| Border | `#E5E2E7` |
| Font display | Kalam 700 |
| Font body | Inter 400 / 500 / 600 |
| Spasi | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px |
| Radius | Input 6px, tombol 8px, kartu 12px, dialog 16px |
| Lebar konten | Maksimal 1.200px; gutter 20px mobile, 32px desktop |

Plum mendominasi tindakan; oranye dan biru memberi coretan kecil. Warna ikon memakai latar pastel dengan simbol berkontras. Angka harga memakai Inter dan tabular numerals; font handwriting dipakai untuk headline dan anotasi.

Urutan beranda: hero, ikon kategori, demo pilihan dengan preview besar, pricing web, pengantar ERP dengan kelompok modul, custom, proses kerja, FAQ, konsultasi, footer. Konten ringkas di beranda; rincian lengkap tersedia di halaman detail.

Bagian memakai ritme berbeda: hero tengah, deretan ikon, demo dengan gambar besar, tabel/perbandingan harga, daftar modul, langkah proses. Kartu dipakai untuk item yang memang setara. Doodle menjadi satu sistem visual konsisten di semua halaman.

Motion ringan: kemunculan opacity/translate 200-300ms, urutan ikon singkat, hover tombol 150ms. Hormati `prefers-reduced-motion`. Mobile mempertahankan coretan dan harga, dengan posisi panah yang disesuaikan agar tidak menutupi teks.

## 6. Plan logo dan aset RD

Brief lengkap: `docs/asset-brief.md`.

Hasil aset yang ditargetkan:

- Monogram RD original; wordmark RakanDev horizontal; varian plum, gelap, dan putih.
- SVG sebagai master logo; PNG transparan, favicon SVG/32px, ikon 180px dan 512px.
- Tiga ilustrasi original: website usaha, susunan modul, proses kolaborasi.
- Empat ikon jenis website dan delapan ikon kelompok ERP; 26 simbol modul mengikuti bahasa bentuk yang sama.
- 11 cover penawaran dan 12 cover skenario usaha, diambil dari halaman demo yang berfungsi setelah implementasi.
- Lima elemen doodle SVG: dua highlight, underline biru, panah lengkung, curved divider.
- Gambar Open Graph 1.200 x 630px, RD, headline, dan harga Basic dengan catatan biaya terpisah.
- Gambar contoh interior, karya kreator, produk, dan tempat usaha untuk demo; asset buatan sendiri dengan catatan penggunaan.

Cover menyatakan "Demo RakanDev". Nama usaha memakai RD Interior, RD Studio, RD Works, RD Shop, serta RD + kategori usaha. Tidak memakai logo klien, testimoni, atau klaim proyek nyata yang belum tersedia.

## 7. Spesifikasi demo

Target katalog: 23 entri, terdiri dari 11 contoh penawaran dan 12 skenario usaha. Dari 11 contoh, Discovery adalah contoh hasil audit; sepuluh lainnya berupa demo website/aplikasi. Dua puluh enam modul mempunyai demonstrasi melalui deep link ke modul pada demo yang relevan.

### Demo penawaran

| Produk | Fungsi yang harus bisa dicoba |
| --- | --- |
| Landing Basic | Navigasi bagian, galeri sesuai batas, CTA kontak simulasi |
| Portofolio Basic | Tiga karya, detail ringan, profil, CTA simulasi |
| Plus | Enam bagian, formulir maksimal lima kolom, validasi, hasil simulasi |
| Profil tiga halaman | Navigasi tiga halaman, galeri, kontak |
| Website custom | Katalog, filter, keranjang, checkout simulasi; ringkasan scope custom |
| Discovery ERP | Peta proses contoh, role, daftar kebutuhan, risiko, contoh rekomendasi; tanpa aplikasi produksi |
| Pilot CRM/proyek | Buat lead fiktif, pindahkan tahap, tugas/milestone, dua laporan contoh |
| ERP Starter | Master sederhana, faktur, pembayaran simulasi, piutang/jurnal contoh, empat laporan |
| ERP Operasional | Order, pengiriman, penerimaan, stok dua gudang, dua approval, enam laporan |
| ERP custom pada platform | Contoh alur khusus di atas demo operasional, dengan fitur custom diberi label |
| ERP custom dari nol | Contoh aplikasi terbatas dengan role simulasi dan alur tertulis; bukan seluruh ERP |

### Aturan bersama

- Banner tetap: "Demo RakanDev. Data contoh. Transaksi tidak diproses."
- Tombol "Kembali ke penawaran", "Konsultasi kebutuhan", "Reset demo" selalu dapat ditemukan.
- Data sintetis tersimpan lokal per demo dengan namespace/version dan pemulihan bila storage tidak tersedia.
- Setiap skenario mempunyai seed dan perubahan state nyata. Tombol menjalankan tindakan yang tampak hasilnya.
- Penyaring kategori, pencarian, tampilan kosong, validasi, status, dan navigasi mobile berfungsi.
- Preview desktop/mobile memakai viewport terukur; tautan "Buka demo penuh" tersedia. Perbandingan tidak sekadar mengecilkan screenshot.
- Formulir dan checkout memberi konfirmasi eksplisit bahwa hasil adalah simulasi. Tidak memakai provider transaksi.
- Role hanya simulasi visual; demo publik tidak dipakai membuktikan keamanan akses produksi.
- Laporan/ekspor menggunakan data contoh dan format yang sungguh didukung. Tombol yang belum tersedia tidak ditampilkan sebagai fitur aktif.
- Cover diambil dari demo terkait. Dataset sektor berbeda; fungsi khusus yang ditampilkan dicatat dalam scope demo, meskipun fitur tersebut memerlukan custom pada penawaran produksi.
- Status modul di katalog: "Konfigurasi terbatas", "Perlu discovery", atau "Pengembangan custom" sesuai kemampuan yang sudah diverifikasi.

Contoh alur uji ERP: stok 100, kirim order 10, hasil stok 90; retur dua yang diterima membuat stok 92. Pengulangan aksi yang sama tidak mencatat transaksi ganda.

## 8. Pricing dan konsultasi

Pricing mempunyai tab Website / ERP / Custom. Tab website membandingkan Basic, Plus, Profil tiga halaman; pilihan Landing atau Portofolio menjelaskan isi Basic. Tambahan disusun menurut konten, tampilan, kontak, bahasa, dan publikasi.

Estimator web memakai jumlah item, bukan checkbox untuk fitur yang dapat berulang. Plus sudah memuat dua bagian tambahan, penulisan, dan formulir. Profil sudah memuat dua halaman tambahan dan penulisan. Pembeli melihat hanya jumlah tambahan di luar isi paket. Pemeliharaan bulanan dipisah dari total sekali bayar dan DP.

Contoh verifikasi total: Basic tanpa tambahan Rp300.000, DP Rp150.000; Plus standar Rp650.000; profil standar Rp750.000; Basic + bahasa kedua Rp450.000; dengan penerjemahan Rp600.000.

ERP memakai pembanding paket dan daftar modul. Pilihan modul menghasilkan ringkasan kebutuhan, bukan jumlah harga yang dipresentasikan sebagai penawaran final. Discovery, implementasi, dan biaya berulang tampil terpisah.

Website custom memakai "Harga setelah konsultasi". Formula perencanaan internal dari ClientOps: jam dasar x Rp150.000 x 1,25; jam ditentukan setelah kebutuhan diperiksa. Formula bukan harga otomatis untuk pembeli. ERP pada platform dan dari nol tetap memakai harga mulai serta batasnya.

Brief maksimal dua langkah: nama usaha/kontak, tujuan, jenis layanan, demo pilihan, kebutuhan/fitur, anggaran opsional, tenggat opsional. Tidak meminta data produksi untuk konsultasi awal. Ringkasan memuat ID produk, ID demo, tambahan dan satuan, total indikatif bila relevan, serta pesan kebutuhan.

Tahap awal memakai kontak resmi yang dikonfigurasi dan tautan pesan berisi ringkasan. Situs tidak menyebut ringkasan terkirim hanya karena aplikasi pesan dibuka. Bila kontak belum dikonfigurasi, ringkasan dapat disalin; sebelum publikasi kontak resmi wajib tersedia.

## 9. Rancangan teknis

Rekomendasi: Astro static output, TypeScript, vanilla CSS dengan token, data katalog JSON, JavaScript hanya untuk filter, estimator, form, dan demo. Halaman layanan dan solusi dihasilkan dari data agar harga tidak berbeda antarrute. Framework ini adalah usulan untuk RakanDev yang belum mempunyai stack.

Pisahkan tiga bagian: katalog bisnis, metadata/demo seed, aset. `planning/catalog.json` menjadi hasil ekstraksi acuan; pada implementasi, pindahkan ke `src/data/catalog.json` dengan schema dan riwayat perubahan harga. Jangan mengimpor modul ClientOps atau secret ke bundle browser.

Struktur implementasi yang diusulkan:

```text
src/
  data/catalog.json
  data/demos.json
  layouts/SiteLayout.astro
  components/BrandLogo.astro
  components/DoodleHero.astro
  components/AppIconRail.astro
  components/PriceComparison.astro
  components/DemoPreview.astro
  components/ConsultationBrief.astro
  pages/index.astro
  pages/pricing.astro
  pages/layanan/[productId].astro
  pages/demo/[productId].astro
  pages/demo/solusi/[industryId].astro
  pages/erp/modul/[moduleId].astro
  pages/solusi/[industryId].astro
  demos/shared/
  demos/seeds/
  styles/tokens.css
  styles/global.css
public/assets/
  brand/
  doodles/
  icons/
  illustrations/
  demo-content/
  demo-covers/
  social/
```

ClientOps sekarang memakai loopback, session/token privat, dan database internal. Integrasi publik bukan sekadar memanggil `/api/leads` dari browser. Versi awal menggunakan ringkasan/manual intake. Tahap berikutnya dapat menambah endpoint intake server terpisah dengan validasi, pembatasan request, consent, ID submission, dan antrean untuk operator. Kredensial hanya di server; data ClientOps tidak disalin ke demo.

Website utama memiliki metadata Bahasa Indonesia, judul/deskripsi per layanan, canonical sesudah domain ditentukan, sitemap, favicon, Open Graph, dan halaman 404. Demo memakai `noindex` dan tidak masuk sitemap utama. Hosting komersial dipilih setelah memeriksa ketentuan/kuota saat publikasi; source menyebut Netlify/Cloudflare Pages sebagai kandidat.

## 10. Urutan implementasi dan hasil tiap tahap

| Tahap | Pekerjaan | Hasil yang harus selesai |
| --- | --- | --- |
| 1. Fondasi | Schema katalog, brief desain, tokens, sitemap, penentuan kontak | Semua harga terpetakan; kategori lengkap; keputusan desain tersimpan |
| 2. Brand dan aset | Logo RD, wordmark, doodle, ikon, ilustrasi, gambar demo | Kit brand siap pakai; SVG/master dan ukuran web; lisensi/provenance |
| 3. Website penawaran | Layout, hero, katalog, harga, tambahan, custom, proses, FAQ, konsultasi | Seluruh rute penawaran berfungsi; harga konsisten; mobile selesai |
| 4. Demo website | Landing, portofolio, Plus, profil, website custom | Lima demo berbeda; sesuai scope; validasi dan navigasi aktif |
| 5. Demo ERP produk | Hasil Discovery dan lima demo ERP implementasi | Enam contoh terkait produk; fondasi dan modul dapat diperiksa |
| 6. Solusi usaha | Dua belas seed/alur sektor dan deep link 26 modul | Semua kategori memiliki contoh yang relevan; tidak ada placeholder mati |
| 7. Preview dan gambar | Screenshot demo nyata, cover penawaran/sektor, Open Graph | 23 cover sesuai demo, gambar terkompresi, identitas RD konsisten |
| 8. QA dan publikasi | Uji harga, alur, aksesibilitas, responsive, build, kontak, metadata | Build lulus, semua demo tersedia, situs siap diluncurkan |

Perkiraan perencanaan untuk satu pengembang, bukan janji jadwal: 12-20 hari kerja dengan demo sebagai simulasi browser dan engine bersama. Pembangunan ERP produksi, konektor, atau backend transaksi merupakan proyek terpisah. Bila dikerjakan bertahap, katalog lengkap tetap tersedia; website baru disebut selesai setelah demo seluruh kategori yang dijanjikan aktif.

## 11. Kriteria selesai

- Seluruh 11 penawaran, 18 tambahan web, 26 modul, delapan kelompok, tujuh fondasi, delapan pekerjaan pendukung, dan 12 jenis usaha cocok dengan sumber.
- Semua harga menyebut jenisnya: tetap, mulai, setelah konsultasi, atau per bulan. Domain, hosting, API, lisensi, perangkat, biaya pesan/transaksi terpisah.
- Ada 23 entri demo; tiap penawaran dan jenis usaha terhubung ke contoh yang sesuai; 26 modul memiliki demonstrasi yang dapat ditemukan.
- Basic/Plus/profil tidak memamerkan fitur berbayar tambahan seolah termasuk harga dasar. Fitur custom diberi konteks biaya/scope.
- Logo RD, ilustrasi, ikon, dua highlight oranye, underline biru, panah harga, curved divider, dua tombol hero, dan deretan ikon berwarna digunakan.
- Konten publik berbahasa Indonesia. Angka, status, catatan harga, label formulir terbaca jelas.
- Uji viewport 360, 390, 768, 1.024, 1.440px; zoom 200%; tanpa overflow halaman. Tabel panjang mempunyai area scroll terlabel.
- Keyboard, fokus, menu/dialog, label/error input, kontras, alt text, dan reduced motion lolos pemeriksaan.
- Estimator diuji pada harga dasar, kuantitas tambahan, isi paket, pemeliharaan terpisah, dan harga custom yang belum ditentukan.
- Demo diuji pada state normal/kosong/error, reset, storage tidak tersedia, transaksi simulasi, dan pengulangan aksi.
- Kontak nyata dan penerimaan formulir diuji bila backend dipasang; tampilan sukses harus sesuai hasil penyimpanan/pengiriman.
- Screenshot mencerminkan demo yang berfungsi; semua gambar punya dimensi, kompresi, atribusi/provenance; tidak ada logo/testimoni fiktif sebagai bukti klien.
- Build static, tautan internal, metadata, sitemap, noindex demo, favicon, serta 404 diverifikasi sebelum publikasi.

## 12. Keputusan untuk tahap implementasi

Plan memakai harga sumber, Kalam + Inter, Astro static, data demo sintetis, dan intake manual sebagai asumsi awal. Sebelum peluncuran isi domain final, nomor WhatsApp/email resmi, identitas pengelola, kanal penyimpanan brief bila ada, dan status layanan ERP yang sudah dapat dikerjakan.

Brand kit dan demo merupakan pekerjaan tahap implementasi. Berkas plan dan katalog acuan tidak menyatakan logo, gambar, aplikasi ERP, atau website sudah dibuat.
