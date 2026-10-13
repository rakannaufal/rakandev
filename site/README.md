# RakanDev

Website penawaran berbahasa Indonesia, berdasarkan katalog CreativeLuv yang dipetakan pada tahap perencanaan. Katalog publik tersanitasi berada di `src/data/catalog.json`.

Revisi hero: carousel 30 demo, background fit dari atas/opacity 32%, aset/nama/harga/CTA sinkron, satu ikon jeda tanpa panel pemilih. Landing page dan portofolio Basic Rp300.000; DP Rp150.000. Koreksi error direktori demo dan QA terbaru dicatat di `docs/implementation.md`; bukti lokal di `qa/hero-carousel/verification.json`. Source repository: https://github.com/rakannaufal/rakandev, preview tetap lokal.

## Jalankan

Gunakan Node.js >=22.12 (implementasi diuji dengan Node.js 26.8.2).

```sh
npm ci
npm run dev
```

Preview: http://127.0.0.1:4321/. Astro dapat menjalankan server di background; hentikan dengan `npm exec astro dev stop`. Gunakan `ASTRO_TELEMETRY_DISABLED=1` pada lingkungan yang membatasi direktori preferensi sistem.

```sh
npm test
npm run build
npm run check:routes
npm run test:browser
npm run test:redesign
npm run test:identity
```

Browser QA menggunakan Chrome lokal. Atur `QA_CHROME` untuk lokasi executable lain, `QA_ORIGIN` untuk server preview lain. Hasil akhir tercatat di `qa/verification.json` serta `qa/browser-results.json`; screenshot QA lokal di `qa/screenshots/` tidak masuk source Git.

## Isi

- 25 penawaran, 18 tambahan website, 7 fondasi ERP, 8 kelompok, 26 modul, 8 pekerjaan pendukung, 12 kategori usaha.
- 30 demo utama: lima website, tujuh commerce, satu dokumen discovery, lima simulasi paket ERP, 12 skenario usaha. Profil website mempunyai tiga halaman.
- Harga Basic Rp300.000, Plus Rp650.000, Profil Rp750.000; custom setelah konsultasi. ERP memakai harga awal/scope dari katalog, bukan janji semua fitur.
- Estimator menampilkan tambahan yang benar-benar ditagih, DP, biaya sekali bayar, pemeliharaan terpisah. Isi Plus/Profil tidak ditagih ulang.
- Brief empat tahap, validasi, pemulihan draft tab, pilihan paket/modul/demo, salin, unduh. Belum ada backend penerimaan brief.
- Identitas final Brand Kit 4.0: logo RD menyatu, Caveat/Manrope, teal/sky/cream, hero asimetris, lima gaya demo berbeda, enam konsep portofolio, 12 artwork dan delapan foto berlisensi.
- Hosting statis gratis, domain custom kompatibel, cek domain RDAP live dengan enam alternatif yang diperiksa, hosting Indonesia beserta spesifikasi/durasi/biaya. Antarmuka tidak menampilkan merek penyedia.
- Metadata, sitemap, robots, halaman 404, navigasi keyboard, mode reduced motion, viewport responsive.

## Kontak dan domain

Kontak/domain resmi ditunda sesuai permintaan pengguna. Tanpa konfigurasi, konsultasi menghasilkan ringkasan lokal yang belum dikirim.

Salin `.env.example` ke `.env`, isi saat kontak resmi siap:

```text
PUBLIC_CONTACT_WHATSAPP=62...
PUBLIC_CONTACT_EMAIL=...
SITE_URL=https://domain-resmi.example
```

Gunakan nomor internasional dengan kode negara. Build ulang setelah mengubah konfigurasi. Tombol WhatsApp/email hanya muncul jika nilai valid; pengunjung tetap memilih mengirim melalui aplikasi tersebut. Kontak dan canonical membaca `.env` saat build. `SITE_URL` kosong memakai origin lokal. Pilihan domain/hosting pengunjung tidak membeli atau membuat akun otomatis. Mode lokal dipilih pengguna; source/build tidak diunggah.

## Data dan demo

Katalog publik: `src/data/catalog.json` dan padanan modul ESM. Keduanya harus diperbarui bersamaan agar SSR/browser memakai harga sama. Data internal ClientOps, formula tarif per jam, kredensial, dan data klien tidak digunakan dalam bundle publik.

Simulasi ERP berada di `src/lib/demo-state.mjs`; render bersama di `demo-ui.mjs`. Namespace `rd:demo:v1:<id>` menyimpan state per demo dalam localStorage. Paket/modul dan draft menggunakan sessionStorage tab. Storage gagal/rusak dipulihkan ke state contoh. Reset satu demo mempertahankan demo lain. Nama contoh lama dimigrasikan ke Luma saat dibuka, tanpa mereset transaksi, stok, invoice, atau keranjang.

Demo memakai role visual; tidak ada autentikasi produksi, server transaksi, bank, gateway, marketplace, IoT, layanan medis, atau perpajakan resmi. Modul/integrasi/fondasi produksi tetap perlu discovery, scope, implementasi, dan verifikasi tersendiri. Catatan batas fitur ditampilkan di setiap demo/modul/penawaran.

## Aset

SVG/master dan WebP/PNG ada di `public/assets/`. `manifest.json` memuat dimensi, alt, provenance, dan penggunaan. Artwork RD memiliki master SVG; fotografi lokal berlisensi Unsplash, bukan foto proyek klien. Cover diambil dari demo yang berjalan.

```sh
npm run assets:generate
npm run assets:capture
npm run build
npm run check:routes
```

`assets:generate` memperbarui master/vector dan raster. Jalankan `assets:capture` sesudahnya agar 30 cover dan manifest lengkap kembali tersedia. Caveat dan Manrope dari kit final disajikan lokal; Space Grotesk serta Cormorant Garamond mempertahankan gaya demo. Wordmark memakai master outline Caveat 4.0, bukan teks ulang. `brand:sync` menyalin persis kit final `../brand/`; generator aset juga menjalankan sinkronisasi ini. Salinan lisensi OFL ada di `public/assets/licenses/`.

## Penyerahan lokal

Output statis ada di `dist/`. Arsip build dan kit aset ada di `artifacts/` pada root proyek. Tidak ada publikasi otomatis. Kontak/domain resmi disiapkan saat pengguna memutuskan online.

Dokumentasi teknis, sumber harga provider, dan batas demo ada di `docs/`. QA regresi mencakup 84 route; QA redesign mencakup domain live, hosting, galeri, dan tampilan 360-1440 px. QA identitas memeriksa kesamaan master logo/font, nama Luma, tampilan tanpa merek penyedia, alternatif domain, pemilihan/draft, serta migrasi transaksi.

QA identitas: `npm run test:identity`. `QA_ONLY` pada browser/redesign menjalankan kelompok terpilih; follow-up tersimpan terpisah dengan provenance pada hasil agregat. Preview QA statis menggunakan server loopback terpisah; server dev pengguna tetap aktif.

## Commerce, 13 Oktober 2026

Tujuh konsep: SAJI, BEKAL, LUMA, SELA, KARYA, PANGGUNG dan TEMU. Starter mulai Rp500.000; scope katalog/ringkasan dan konfirmasi manual. Otomatis mempunyai harga serta batas terpisah. Paket/demonstrasi, harga dan biaya produksi dijelaskan di `../planning/COMMERCE-PLAN.md`.

Data `src/data/commerce.mjs`, state `commerce-state.mjs`, render `commerce-ui.mjs`, interaksi `scripts/commerce.js`, CSS `styles/commerce.css` pada folder site. localStorage `rd:commerce:<kategori>:v1`; validasi schema, stok/reservasi, nominal, idempotensi, kedaluwarsa, booking/pre-order, seller, unduhan, tiket dan resi. QRIS/email/peran hanya simulasi lokal. E-ticket mempunyai QR kode demo; file digital memiliki isi nyata. Tambahan 25 foto berlisensi lokal, tujuh cover dari screenshot situs. Generator gambar kehabisan kuota; foto tidak diklaim sebagai gambar AI.

QA perluasan tersimpan di `qa/commerce/`: screenshot desktop/ponsel, verifikasi browser terarah, pengujian unit, build dan seluruh tautan/aset/metadata. Laporan QA lama tetap menjadi arsip sebelum perluasan, bukan bukti pengujian browser seluruh kategori baru. Situs tetap lokal.
