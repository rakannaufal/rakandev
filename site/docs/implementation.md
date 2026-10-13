# Implementasi RakanDev

Tanggal: 13 Oktober 2026. Stack: Astro static, JavaScript browser, CSS native. Caveat/Manrope dari Brand Kit 4.0 untuk website utama; Space Grotesk dan Cormorant Garamond mempertahankan karakter demo. Semua font lokal. Bahasa: Indonesia. Source penawaran: katalog CreativeLuv yang dipetakan sebelum implementasi; bundle publik hanya memakai data katalog tersanitasi.

## Cakupan

106 halaman HTML: beranda, direktori/pricing/detail layanan, custom, proses, konsultasi, ketentuan, privasi, ERP, modul, solusi usaha, demo, serta 404. Ada 105 route halaman normal, 30 entri demo utama, dan dua halaman tambahan profil demo. Sitemap mengecualikan demo; seluruh area demo memakai noindex.

25 penawaran mencakup Landing Basic, Portofolio Basic, Plus, Profil usaha, Discovery, Pilot, Starter, Operasional, ERP custom pada platform, ERP dari nol, serta website custom, ditambah 14 penawaran Starter/otomatis dari tujuh kategori commerce. Tersedia 18 tambahan website, 7 fondasi, 8 kelompok ERP, 26 modul, 8 pekerjaan pendukung, 12 kategori usaha.

Basic Rp300.000, Plus Rp650.000, Profil Rp750.000. Website custom ditentukan sesudah konsultasi. ERP merupakan harga awal/scope terbatas; seluruh modul bukan isi otomatis harga awal. Estimator menghitung tambahan yang melebihi inklusi paket, DP 50%, biaya sekali bayar, serta pemeliharaan terpisah. Biaya domain/provider dijelaskan dekat harga.

## Demo website

| Demo | Implementasi |
| --- | --- |
| RD Interior | Silver/navy, serif arsitektural, lima foto, komposisi proyek asimetris, empat bagian, navigasi jangkar, CTA ke brief |
| RD Studio | Karya cobalt/coral dan artwork RD teal/cream, tipografi besar, enam konsep brand, filter kategori, dialog detail/deliverables, empat bagian, CTA ke brief |
| RD Renovasi | Powder blue/ocean/yellow, foto dan studi material, enam bagian, accordion, proses, galeri, FAQ, form simulasi tervalidasi |
| RD Works | Graphite/oranye, fotografi ruang kerja, layout editorial; beranda, tentang, karya tetap tiga halaman |
| RD Shop | Still-life produk original, tiga produk, filter, keranjang, pengurangan unit, checkout, perubahan stok, persistence, reset |

Artwork dibuat untuk RD; fotografi memakai lisensi Unsplash dengan provenance per berkas. Nama/karya/usahanya fiktif; bukan portofolio klien. Basic portofolio menampilkan enam karya dengan filter kategori dan detail kasus. Landing Basic berisi pembuka, layanan, karya, kontak. Plus enam bagian; profil tiga halaman. Penataan materi, identitas brand, metadata, mobile, tiga putaran revisi termasuk sesuai scope. Produksi aset baru/fitur tambahan dibahas terpisah.

## Demo ERP

Discovery menampilkan contoh dokumen audit: proses, role, prioritas, risiko, data, rekomendasi, batas implementasi, serta kriteria penerimaan.

Pilot memperlihatkan CRM/proyek dan dua laporan. Starter memberi alur order, invoice, pembayaran, jurnal/kas dan empat laporan. Operasional memberi stok dua gudang, penerimaan, pengiriman, approval dua tahap, serta enam laporan. Platform custom menyediakan demonstrasi seluruh 26 modul melalui deep link. Demo ERP dari nol sengaja memperlihatkan aplikasi terbatas: CRM, proyek, dokumen, approval, laporan, role visual, dan integrasi simulasi.

| Sektor | Alur terpilih |
| --- | --- |
| Retail | Keranjang kasir, checkout, stok, struk, shift |
| Distribusi | Order, kirim, retur invoice belum dibayar, pembayaran |
| Manufaktur | BOM dua unit bahan per hasil, work order, QC |
| Konstruksi | RAB/proyek, progres/jam kerja, termin setelah selesai |
| Jasa | Lead/pipeline, proyek, laporan |
| Kuliner | Order meja, keranjang, dapur Antre/Dimasak/Siap, shift |
| Klinik | Pasien/dokter fiktif, antrean, layanan, billing |
| Pendidikan | Siswa/program fiktif, tagihan, pembayaran contoh |
| Agribisnis | Blok/komoditas, biaya contoh, panen dalam kg |
| Logistik | Armada/sopir/rute fiktif, berangkat, sampai |
| Properti | Unit, booking/invoice booking 5%, cicilan contoh terpisah, progres |
| Ecommerce | Keranjang, checkout, order dan stok |

Semua operasi berada di browser. Simulasi role tidak membuktikan keamanan server. Pajak memakai parameter fiktif 11%; payroll hanya contoh gaji + lembur Rp25.000/jam. Retur demo hanya tersedia sebelum invoice dibayar; refund/nota kredit perlu scope lain. Stok tidak dapat menjadi negatif melalui alur normal. Aksi pengiriman, pembayaran, receipt supplier, invoice kontrak, dan slip payroll berulang ditolak. Event integrasi dengan ID sama dikenali tanpa duplikasi stok.

## Penyimpanan dan konsultasi

- `rd:demo:v1:<id>`: localStorage, dipisahkan per demo; schema/version dan cart diverifikasi saat load.
- `rd:selection:v1`: sessionStorage tab, paket/tambahan/modul.
- `rd:brief:v1`: sessionStorage tab, form konsultasi.
- Storage dibatasi: interaksi memakai state memori dengan pemberitahuan. State demo tidak valid: data awal dipulihkan.
- Reset memakai dialog konfirmasi, hanya mengganti demo terkait. Draft bisa dihapus melalui tombol khusus.

Brief empat tahap memiliki validasi, error per kolom, fokus ke error pertama, review, salin clipboard dengan fallback manual, unduh .txt, dan pemulihan draft. Jawaban per bagian/halaman/fitur mengikuti paket. Pergantian paket mempertahankan jawaban serta pilihan tambahan masing-masing. ERP membedakan modul inklusi dan fitur untuk proposal terpisah. Custom website memakai pilihan CMS, toko, akun, booking, formulir, data, integrasi, lainnya. Belum ada backend intake. Kontak resmi/domain ditunda pengguna; pengiriman langsung tidak diklaim. Env valid bisa mengaktifkan tautan WhatsApp/email sesudah build; pengunjung tetap memilih mengirim.

## Domain dan hosting

Pilihan alamat: subdomain provider gratis, domain custom baru, domain milik sendiri, atau bantuan memilih. Hosting statis gratis tersedia untuk website statis termasuk landing dan portofolio. Domain custom berbayar tetap dapat dipasang pada hosting gratis. Beban dinilai dari fungsi, resource, batas provider, dan pengujian; jumlah pengguna saja tidak menetapkan keharusan membeli hosting.

Form memeriksa domain langsung melalui RDAP registry resmi sesuai bootstrap IANA; status tersedia memakai ceklis, terdaftar memakai silang, unknown tetap belum terverifikasi. .it.com memerlukan pemeriksaan tim, dengan alternatif ekstensi yang bisa diperiksa otomatis. Endpoint dibatasi dari bootstrap IANA. Nama domain yang dimasukkan beserta enam alternatif dikirim; data konsultasi lainnya tetap lokal. Merek registry/hosting/domain tidak ditampilkan di antarmuka. Respons domain yang sesuai berarti terdaftar; 404 RDAP berarti belum tercatat, tetap memerlukan konfirmasi registrar untuk reserved/premium/pembelian. Error, rate limit, timeout, respons tidak cocok atau non-JSON berarti belum dapat dipastikan. Timeout 12 detik, pembatalan input berubah, dan ID permintaan mencegah hasil lama menimpa input baru. Hasil draft ditandai belum diperiksa ulang. Enam alternatif diperiksa dengan konkurensi dua dan batas delapan detik per nama. Status terdaftar tidak dapat dipilih sebagai domain baru; hasil belum terverifikasi dapat dicek ulang. Kandidat belum tercatat bisa mengisi domain custom dan memperbarui biaya/draft. Respons 404 kosong dengan tipe application/rdap+json dikenali sebagai belum tercatat; 404 generik/HTML tidak diartikan tersedia.

Acuan hosting Indonesia: Entry, Small, Medium Rumahweb dengan spesifikasi CPU shared, RAM, storage/inode, entry process, dan batas backup. Form menyediakan durasi anggaran 1/3/6/12/24 bulan, kebutuhan trafik/server custom, domain 1/2/3 tahun. Siklus tagihan nyata mengikuti checkout provider. Estimasi memakai tarif reguler, memisahkan promo, perpanjangan, komponen belum diketahui, serta harga jasa. Domain mengikuti subtotal acuan screenshot + PPN 11%, dibulatkan ke atas per Rp5.000 sesudah pajak. Rincian subtotal, pajak, pembulatan, pendaftaran/perpanjangan terlihat di pricing, hasil domain, estimasi, dan ringkasan. Tidak ada margin jasa domain tambahan. Harga, spesifikasi, dan tanggal acuan tersimpan di `src/data/infrastructure.mjs`; sumber merek/URL hanya di dokumentasi audit `docs/domain-hosting-sources.md`, tidak pada UI atau ringkasan pengunjung.

## Aset dan desain

Aset meliputi enam PNG logo supplied, ekspor WebP lossless, favicon dari gambar pilihan pengguna, ikon modul/kategori, 12 artwork original dengan master SVG dan enam crop detail portofolio, delapan foto lokal, 30 cover demo, serta Open Graph. Brand Kit 4.0 dipertahankan untuk font/token dan arsip. Master SVG, ekspor WebP/PNG, serta provenance tersedia di `/assets/manifest.json`. Foto tidak diklaim sebagai karya RD. Font berlisensi OFL, salinan disertakan.

Identitas supplied dari `RakanDev-Logo-Assets/` diterapkan pada logo utama; token/font dari `brand/` dipertahankan: teal #086288, blue #4D8DBA, sky #97D7FF, cream #FFEFC4, Caveat 700 untuk headline dan Manrope untuk body/angka/form. Logo header/footer/favicon/toolbar/demo, kartu, kontrol, status, focus, serta artwork brand mengikuti kit. Layout tetap asimetris, dengan foto/poster, selected works, section bervariasi, harga dan CTA jelas. Lima demo mempertahankan bahasa visual masing-masing.

`src/styles/brand/design-system.css` dan font disalin persis dari kit; `brand-integration.css` memetakan komponen situs ke token final. `scripts/sync-brand.mjs` menyalin PNG supplied persis, memangkas padding untuk WebP lossless, dan mengekspor favicon pilihan pengguna tanpa menggambar ulang. Alias nama file lama merujuk master final; master wordmark-white tetap wordmark, tidak tertimpa logo horizontal. Generator aset memakai logo final tertanam pada stationery, collage, dan studi material. Seluruh nama demo menjadi Luma, termasuk pada aset raster dan cover. State lama dimigrasikan rekursif tanpa menghapus transaksi.

Animasi reveal mengikuti 400ms/8px dan reduced motion. Preview desktop/mobile memakai iframe dengan lebar viewport aktual, disertai tautan demo penuh. Token/brief integrasi tercatat pada `.ui-craft/` di root proyek.

## Verifikasi

`npm test`: aturan harga/inklusi/recurring, validasi brief, stok 100/90/92, pembayaran ganda, invoice proyek/kontrak, integrasi duplikat, BOM/stok, role/approval, kasir/dapur/shift, supplier, payroll, sektor, tanggal, dan state rusak.

`npm run check:routes`: seluruh HTML, tautan/anchor lokal, gambar/font/CSS, judul/deskripsi/bahasa, noindex demo, sitemap, dan scan source privat pada output.

`npm run test:browser`: 84 route, 26 deep link/modul, filter, pricing/keyboard, brief, galeri/form, toko, laporan/CSV, reset/persistence, storage ditolak/rusak, preview aktual, overflow dan menu pada viewport 360/390/768/1024/1440. Hasil akhir disimpan di `qa/browser-results.json` dan agregat `qa/verification.json`. Kegagalan pemuatan gambar sesaat pada preview QA awal diselesaikan melalui server loopback Node HTTP, menggunakan build yang sama. Follow-up terarah disimpan terpisah; hasil awal dan asal resolusi dipertahankan.

`npm run test:redesign` (`scripts/experience-qa.mjs`): logo supplied, tiga revisi, brief empat tahap/restore/per-paket, profil/custom/ERP, transaksi variabel serta kompatibilitas hosting gratis/domain custom, subtotal biaya, durasi/brief/draft, respons registry/error/input invalid, pembatalan respons lama, hosting ERP, enam karya/filter/dialog/fokus, cek live .com/.id, semua foto/artwork serta overflow 360-1440 px. Hasil ada di `qa/experience-results.json`; konfirmasi terarah di `qa/experience-followup-results.json`.

`npm run test:identity`: subset supplied/domain/responsive dari pengujian pengalaman. Source favicon dari gambar pengguna dibandingkan dengan salinan publik; hasil mengikuti laporan pengalaman. Migrasi transaksi tetap diperiksa pengujian unit/regresi.

Audit dependency setelah memperbarui Sharp: nol kerentanan. Pemeriksaan browser merupakan QA fungsional/visual; belum merupakan audit aksesibilitas independen, uji backend produksi, atau pembuktian kapasitas ERP.

## Status penyerahan

Pengguna memilih tetap lokal. Tidak ada unggahan source/build atau deployment ke Sites. Source, build statis, kit aset, dan hasil QA tersedia di workspace. Preview lokal memakai http://127.0.0.1:4321/; jalankan `npm run dev` dari folder `site` bila server belum aktif. Kontak/domain resmi masih ditunda. Konfigurasi `.env` dibaca saat build; `SITE_URL` kosong memakai origin lokal.

## Perluasan commerce

Harga, batas, desain, aset dan alur lokal final tercatat di `../../planning/COMMERCE-PLAN.md`. Tambahan 25 foto asli berlisensi; generator bitmap menghasilkan quota_exceeded, sehingga tidak ada klaim foto AI. Starter mulai Rp500.000 dengan konfirmasi manual; otomatis memakai harga tersendiri dan garansi bug 30 hari. Tujuh storefront memiliki monogram, palet, komposisi hero dan katalog berbeda. Demo memperlihatkan QRIS ilustratif, pembayaran manual/otomatis simulasi, nominal/idempotensi, stok, kedaluwarsa, ongkir/kupon, resi, pre-order, booking/DP/perubahan/blok, file digital, e-ticket QR/check-in, portal/moderasi dan invoice komisi.

`test/commerce.test.mjs` memeriksa batas/invarians state. Screenshot dan pemeriksaan browser lewat Codex In-app Browser tersimpan di `../qa/commerce/`, terpisah dari QA lama. Draft konsultasi memberi tiga brief per kategori dan satu brief merchant bagi otomatis; hosting gratis hanya ditawarkan bagi Starter statis. Gateway/email/otorisasi backend/scan kamera belum tersambung. Source/build tidak dipublikasikan.

## Hero carousel dan koreksi harga Basic

Landing page dan portofolio Basic kembali Rp300.000, dengan DP Rp150.000. Harga produk commerce tidak ikut berubah. `src/data/hero-slides.mjs` menghubungkan seluruh 30 demo dengan aset, paket, konsultasi, dan mode harga yang benar. Background screenshot fit dari atas, opacity 32%; overlay melindungi copy. Artwork, nama, harga dan CTA diperbarui bersama setelah gambar selesai dimuat. Hero tanpa JavaScript tetap menampilkan demo Basic pertama dengan tautan aktif.

Rotasi otomatis 8 detik, satu ikon jeda kecil; panel pilihan, dropdown, panah dan nomor slide dihapus sesuai koreksi pengguna. Fokus, hover, sentuhan, area di luar viewport serta tab tersembunyi menjeda rotasi; reduced motion mematikan autoplay. Putar eksplisit bekerja saat tombol masih fokus. Tampilan dan state pemuatan diperiksa pada desktop dan ponsel. Bukti QA revisi terbaru ada di `../qa/hero-carousel/verification.json`; laporan commerce sebelumnya merupakan snapshot historis.

Interpolasi literal pada deskripsi direktori demo diperbaiki. `test/marketing.test.mjs` dan `scripts/check-site.mjs` menjaga halaman publik dari nilai template yang belum dirender, `undefined`, serta `NaN`.
