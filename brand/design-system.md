# RakanDev - Design System 4.0

13 Oktober 2026. Panduan identitas, bahasa visual, dan komponen untuk website serta sistem usaha RakanDev.

## 1. Karakter brand

**Ide berani. Hasil berarti.** RakanDev membantu pemilik usaha membangun website dan sistem operasional. Identitas tampil ekspresif, ramah, dan mengalir. Arah visual mengikuti prinsip huruf menyatu pada referensi AutoPrompt, karakter tulisan tangan pada website Odoo, dan palet biru-cream pilihan pengguna.

- **Berani:** monogram R+D menyatu dalam satu warna, headline Caveat Bold, lengkung yang ekspresif.
- **Jelas:** rincian layanan, harga, scope, dan tindakan disampaikan dengan bahasa sederhana.
- **Terarah:** satu tindakan utama per area, modul tersusun, elemen dekoratif membantu perhatian.

Nama brand ditulis **RakanDev**. Nama berkas dan identifier boleh memakai `rakandev`. Gunakan kata "kamu", "usahamu", dan "kebutuhanmu" secara konsisten. Headline membicarakan manfaat konkret. Tindakan memakai kata kerja: "Lihat demo", "Konsultasi kebutuhan", "Pilih paket".

## 2. Logo

### Simbol RD

R dan D dibentuk sebagai **satu outline dengan dua ruang negatif**. R terbaca dari batang tegak kiri, mangkuk atas, dan kaki diagonal. D berada di kanan bawah: lengkung luarnya kembali ke batang diagonal yang sama. Kaki R sekaligus menjadi batang D, sehingga keduanya benar-benar menyatu. D mengikuti kemiringan kaki R; komposisi bertingkat memberi gerak seperti prinsip interlock pada referensi.

Kontur memiliki sambungan halus, sudut luar membulat, dan ujung yang dirapikan secara optis. Lubang R berbentuk mangkuk; lubang D mengikuti lengkung miring. Tidak ada garis pemisah, lapisan warna kedua, atau huruf yang ditempel terpisah. Master simbol berisi satu compound path dengan `fill-rule="evenodd"`. Koordinat dan versi mikro tersedia di `source/monogram-path.json`.

### Logo teks

Wordmark **RakanDev** berbasis Caveat Bold, keluarga tulisan tangan yang dipakai headline website Odoo. Outline diperlebar 8%, setiap pasangan huruf diberi spasi optis, dan ujung naik pada v diperpanjang sebagai terminal khas. R dan D kapital menjaga ejaan serta kaitan dengan monogram. Seluruh nama memakai satu warna Sea Teal pada versi primary. File wordmark hanya memuat nama, tanpa monogram atau garis dekoratif. Pakai master path yang tersedia, jangan ketik ulang nama brand sebagai pengganti logo.

### Susunan dan varian

| Susunan | Rasio master | Penggunaan | Minimum digital |
| --- | --- | --- | --- |
| Simbol | 128 x 128 | Avatar, penanda brand, sidebar | 24px |
| Mikro, satu warna | 128 x 128 | Browser, toolbar kecil | 16px |
| Wordmark | 420 x 112 | Judul dokumen, identitas teks | Lebar 120px |
| Horizontal | 572 x 128 | Header, proposal, footer | Lebar 180px |
| Vertikal | 420 x 314 | Sampul, kartu, avatar luas | Lebar 160px |

Cetak: simbol minimal 10mm; wordmark 30mm; horizontal 45mm; vertikal 40mm. Periksa hasil proof sesuai bahan dan proses cetak. Ukuran minimum dihitung dari keseluruhan viewBox.

**Seluruh varian satu warna.** Primary memakai Sea Teal `#086288`, blue memakai Harbor Blue `#4D8DBA`, cream memakai Warm Cream `#FFEFC4`, dan white memakai putih. Primary dipakai di atas white atau cream; cream/white dipakai di atas Sea Teal. Blue cocok untuk materi pendukung di atas putih. Sky Blue tetap menjadi warna pendukung, bukan warna utama logo. PNG simbol diekspor 1024px; logo lainnya lebar 2400px dengan latar transparan.

### Ruang bebas

Tetapkan **x = lebar batang R** pada artwork. Pada master simbol 128px, x = 20 unit. Sisakan minimal x dari tepi artwork ke teks, objek lain, atau tepi media. Tambahkan ruang di luar margin transparan SVG sesuai kebutuhan. Pada simbol 32px, ruang bebas minimum 5px; pada simbol 128px, 20px.

Jangan memisahkan R dan D, meregangkan, memutar, memberi outline/shadow, mengubah urutan huruf, atau memakai dua warna dalam satu logo. Gunakan versi mikro pada 16-23px: ruang negatif diperbesar agar tidak tertutup saat rasterisasi. Mulai 24px gunakan master utama. Keduanya satu warna.

## 3. Warna

Empat warna inti mengikuti HEX pada referensi pengguna. Sea Teal memegang identitas; Harbor Blue memberi kedalaman, Sky Blue memberi ruang, Warm Cream menghangatkan komposisi. Kanvas tetap terang. Warna turunan dipakai hanya untuk kebutuhan UI seperti hover, helper text, dan permukaan halus.

| Token CSS | Nama | HEX | Fungsi |
| --- | --- | --- | --- |
| `--rd-brand` | Sea Teal | `#086288` | Brand, CTA utama, logo |
| `--rd-blue` | Harbor Blue | `#4D8DBA` | Aksen, ikon besar, garis kontrol |
| `--rd-sky` | Sky Blue | `#97D7FF` | Bidang terang, ilustrasi |
| `--rd-cream` | Warm Cream | `#FFEFC4` | Permukaan hangat, inverse logo |
| `--rd-brand-hover` | Teal Hover | `#064E6B` | Hover, tautan, teks pada sky |
| `--rd-ink` | Brand Ink | `#086288` | Teks utama dan ikon |
| `--rd-brand-soft` | Cloud | `#EAF7FF` | Permukaan sekunder |
| `--rd-focus` | Focus Teal | `#086288` | Underline, focus ring |
| `--rd-white` | White | `#FFFFFF` | Kanvas utama, teks pada teal |
| `--rd-soft` | Mist | `#F4FBFF` | Pergantian section, permukaan UI |
| `--rd-paper` | Paper | `#FFFFFF` | Latar ilustrasi dan materi brand |
| `--rd-muted` | Muted Teal | `#426879` | Deskripsi dan helper text |
| `--rd-border` | Decorative Border | `#CDE4EE` | Garis dekoratif, pemisah, kartu |
| `--rd-input-border` | Input Border | `#4D8DBA` | Batas input yang harus terlihat |

Komposisi awal: 60% white/cream/cloud, 25% sky, 15% total teal/blue. Angka ini adalah panduan visual, bukan aturan layout yang kaku. Logo selalu memakai satu warna. Bidang warna besar diperbolehkan pada materi brand; gunakan permukaan tenang untuk isi yang panjang.

### Warna status

| Status | Teks | Latar | Kontras |
| --- | --- | --- | --- |
| Sukses | `#20634C` | `#E8F9EE` | 6.51:1 |
| Peringatan | `#775800` | `#FFEFC4` | 5.78:1 |
| Error | `#AD2D3C` | `#FFF0F0` | 5.90:1 |
| Informasi | `#086288` | `#EAF7FF` | 6.18:1 |

Setiap status memuat teks yang menjelaskan keadaan. Warna bukan satu-satunya pembeda. Warna status merupakan utility UI, bukan tambahan warna pada logo.

### Kontras terverifikasi

Rasio dihitung dengan luminance sRGB menurut WCAG.

| Pasangan | Rasio | Pemakaian |
| --- | --- | --- |
| Sea Teal / White | 6.75:1 | Body, CTA, teks brand |
| Sea Teal / Warm Cream | 5.91:1 | Body pada cream, inverse logo |
| Teal Hover / White | 9.09:1 | Tautan dan hover |
| Teal Hover / Cloud | 8.33:1 | Tombol secondary |
| Muted / White | 6.02:1 | Deskripsi kecil |
| Harbor Blue / White | 3.60:1 | Batas input, ikon, teks besar |
| Sea Teal / Sky Blue | 4.33:1 | Logo dan headline besar |
| White / Harbor Blue | 3.60:1 | Teks besar, bukan body |
| White / Sky Blue | 1.56:1 | Tidak digunakan untuk teks |
| White / Warm Cream | 1.14:1 | Tidak digunakan untuk teks |

Target: teks normal minimal 4.5:1; teks besar minimal 3:1; batas input/focus/ikon bermakna minimal 3:1 terhadap permukaan. `--rd-border` hanya untuk dekorasi karena kontrasnya terlalu rendah untuk batas kontrol penting.

## 4. Tipografi

**Caveat 700** untuk headline dan pesan singkat: miring alami, lengkung organik, dan ritme tulisan tangan. Wordmark memakai outline yang disesuaikan, bukan teks font langsung. **Manrope 400/500/600** untuk body, navigasi, label, angka, tabel, serta formulir. Bentuknya terbuka dan sedikit membulat, mendampingi karakter headline. Font lokal WOFF2 dan lisensi OFL disertakan; gunakan `font-display: swap`.

| Peran | Font | Desktop | Mobile | Line height |
| --- | --- | --- | --- | --- |
| H1 | Caveat 700 | 88px maksimum | 52px minimum | 1.08 |
| H2 | Caveat 700 | 64px maksimum | 40px minimum | 1.08 |
| H3 | Manrope 600 | 24px | 24px | 1.4 |
| Lead | Manrope 400 | 18px | 18px | 1.75 |
| Body | Manrope 400 | 16px | 16px | 1.65 |
| Label / button | Manrope 500/600 | 14px | 14px | 1.4 |
| Caption | Manrope 400/500 | 12px | 12px | 1.5 |

H1 memakai `clamp(3.25rem, 6.2vw, 5.5rem)`, H2 `clamp(2.5rem, 4.5vw, 4rem)`. Tracking headline 0; kemiringan sudah ada pada font, jangan tambahkan italic atau skew. Caveat hanya untuk kalimat pendek, idealnya 2-8 kata per baris. Batasi body sekitar 60-70 karakter per baris. Harga/tabel memakai `font-variant-numeric: tabular-nums`. Input selalu minimal 16px, termasuk mobile.

### Sapuan aksen

Gunakan `.rd-marker` untuk bidang cream di belakang satu kata, atau `.rd-swash` untuk garis lengkung sky di bawahnya. Maksimal satu kata beraksen per headline; pada pasangan tagline cover, satu aksen per baris diperbolehkan. Aksen tidak masuk ke artwork logo. Pastikan kata tidak terpotong pada mobile; pindahkan seluruh kata ke baris berikutnya. `.rd-heading` dan `.rd-heading--section` menyediakan skala heading siap pakai. Jangan memakai Caveat untuk paragraf panjang, tabel, formulir, atau rincian harga.

## 5. Layout, spacing, bentuk

Grid dasar **4px**. Skala yang dipakai: **4, 8, 12, 16, 24, 32, 48, 64, 96px**. Tidak setiap elemen harus berada pada grid jika koreksi optis dibutuhkan pada lettering atau doodle.

- Container maksimum 1200px; gutter desktop 32px per sisi, mobile 20px per sisi.
- Grid halaman 12 kolom desktop, 8 tablet, 4 mobile. Gap kartu 24px.
- Breakpoint panduan: mobile sampai 760px, tablet 761-1100px, desktop mulai 1101px.
- Section spacing 96px desktop, 56-64px mobile. Jarak label ke input 8px; antar field 24px.
- Radius kontrol 8px, kartu 12px, area preview 18px. Lingkaran hanya untuk ikon bulat/avatar.
- Border dekoratif 1px. Input memakai border yang memenuhi kontras. Kartu tidak perlu shadow kecuali perlu menonjol atau sedang hover.
- Shadow: `0 2px 4px rgb(32 39 51 / 4%), 0 8px 24px rgb(32 39 51 / 8%)`.

Pada mobile, tindakan utama tetap terlihat, kartu menjadi satu kolom, kontrol minimal 44 x 44px, tabel berada dalam area scroll berlabel. Logo tetap memiliki ruang bebas; jangan dipaksa mengecil di bawah ukuran minimum untuk memuat seluruh navigasi.

## 6. Komponen

### Tombol

Primary: Sea Teal + teks putih. Hover: Teal Hover. Secondary: Cloud + Teal Hover. Tinggi minimal 48px; padding 12px 22px; radius 8px; font Manrope 600 14px. Gunakan satu primary per kelompok. Focus: outline teal 3px, offset 4px. Disabled memakai atribut `disabled`; label tetap terbaca. Loading memakai `aria-busy="true"`, label seperti "Menyiapkan...", dan mencegah aksi berulang selama proses.

### Input

Label permanen di atas input. Placeholder hanya contoh, bukan pengganti label. Tinggi minimal 48px; ukuran teks 16px; border `#4D8DBA`; helper text 12px muted. Error memakai border `#AD2D3C`, teks error, `aria-invalid="true"`, serta `aria-describedby` ke pesan. Jangan menghapus isian pengguna setelah validasi gagal.

### Kartu

Latar putih, border decorative, radius 12px, padding 28px. Struktur: label/icon, judul, satu paragraf, tindakan. Pakai shadow untuk satu kartu prioritas. Semua kartu tidak perlu diberi efek yang sama. Harga dan biaya terpisah harus terbaca bersama.

### Badge dan status

Padding 4px 12px, radius 5px, ukuran 12px. Gunakan label seperti "Tersimpan", "Perlu ditinjau", "Belum lengkap", "Informasi". Tambahkan ikon bila membantu; ikon dekoratif memakai `alt=""` atau `aria-hidden="true"`.

### Navigasi

Header desktop dapat memakai logo horizontal, link Manrope 14px, dan satu CTA. Link aktif memakai warna serta indikator seperti `aria-current="page"`. Mobile menu memiliki `aria-expanded`, label, urutan fokus, dan target minimum 44px.

## 7. Ikon, ilustrasi, dan doodle

Keluarga ikon SVG original memakai viewBox 24px, stroke 1.7-1.8px, cap/join membulat, warna ink. Skala visual 20/24px untuk kontrol, 32px untuk tile 64px. Ikon pendukung sudah disertakan di `icons/`.

Elemen grafis mengulang lengkung besar D, diagonal R, dan radius halus. Gunakan bidang sky/cream, kurva terbuka, serta grid titik yang tipis. Hindari dekorasi yang menutupi isi atau memecah bentuk logo. Ornamen memakai `aria-hidden="true"` dan `pointer-events: none`.

## 8. Motion

Feedback hover/focus 150ms; perpindahan UI 200ms; reveal section 400ms dengan `cubic-bezier(.16, 1, .3, 1)`. Pergerakan reveal maksimal 8px. Hindari animasi terus menerus pada logo, tombol, harga, dan formulir. Jangan menggeser layout saat hover. Dalam `prefers-reduced-motion: reduce`, hapus perpindahan dan reveal; perubahan status tetap langsung terlihat.

## 9. Implementasi dan sumber

`design-system.css` berisi tokens dan komponen opt-in dengan prefix `rd-`. `tokens.json` berisi nilai bertipe. `index.html` adalah panduan visual yang dapat dibuka offline. `generate.mjs` meregenerasi aset menggunakan outline lettering yang sudah disimpan.

Monogram dan komposisi logo dibuat untuk RakanDev. Wordmark berasal dari outline Caveat Bold (The Caveat Project Authors), dengan penyesuaian kontur, spasi, dan terminal. Referensi tipografi: [website Odoo](https://www.odoo.com/), headline Caveat 700, ditinjau 13 Oktober 2026. Caveat dan Manrope (The Manrope Project Authors) berlisensi SIL OFL 1.1; lisensi lengkap ada di `fonts/`. Master SVG hanya memuat path, shape, dan metadata aksesibilitas, tanpa font eksternal atau script.
