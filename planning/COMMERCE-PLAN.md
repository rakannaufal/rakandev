# Perluasan commerce RakanDev

13 Oktober 2026. Status: implementasi lokal pada website penawaran dan tujuh demo; pembayaran, email dan role produksi belum diaktifkan.

## Harga dan batas

Harga jasa commerce sekali bayar dimulai Rp500.000. Starter menyediakan katalog/pemesanan statis dan konfirmasi manual. Paket otomatis dijual terpisah, memakai fondasi transaksi teruji yang kompatibel; pembangunan mesin dari nol mengikuti proposal custom.

| Website / demo | Starter | Otomatis mulai | Batas Starter | Batas otomatis |
| --- | ---: | ---: | --- | --- |
| Penjualan makanan / SAJI | Rp500.000 | Rp1.750.000 | 12 produk/menu | 40 produk/menu |
| Toko makanan & pre-order / BEKAL | Rp650.000 | Rp2.000.000 | 12 produk/menu | 40 produk/menu |
| Toko online / LUMA | Rp500.000 | Rp1.500.000 | 10 produk/menu | 30 produk/menu |
| Booking layanan / SELA | Rp750.000 | Rp2.500.000 | 5 layanan | 10 layanan |
| Penjualan produk digital / KARYA | Rp650.000 | Rp1.500.000 | 10 produk/menu | 30 produk/menu |
| Tiket & workshop / PANGGUNG | Rp750.000 | Rp3.000.000 | 1 acara | 5 acara aktif |
| Direktori & marketplace / TEMU | Rp1.000.000 | Rp9.500.000 | 30 produk/menu | 300 produk/menu |

Basic landing page/portofolio Rp300.000; Plus Rp650.000, Profil usaha Rp750.000. Semua paket: tiga putaran revisi dalam scope, mobile/desktop, materi berizin dari klien, source dan panduan. Produksi foto/logo/ilustrasi baru tidak otomatis termasuk. Starter tanpa akun admin, database pesanan atau pembayaran otomatis.

## SAJI: Penjualan makanan

Starter Rp500.000: Satu halaman, 12 menu, keranjang, catatan, pilihan pickup/meja dan ringkasan pesanan. QRIS atau tautan bayar milik merchant; pembayaran dikonfirmasi manual. Tanpa dashboard dapur.

Otomatis mulai Rp1.750.000: Satu outlet, 40 menu, topping/porsi, QRIS dinamis, verifikasi pembayaran server, antrean dapur, menu habis, laporan CSV; tiga staf. Pengantaran/printer terpisah.

Jadwal indikatif: Katalog 3-5 hari kerja; otomatis 2-3 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/saji/. Paket otomatis: ?package=saji-qris.

## BEKAL: Toko makanan & pre-order

Starter Rp650.000: Satu halaman, 12 produk, varian isi, keranjang, permintaan tanggal pre-order/pickup dan ongkir lima zona. Stok/jadwal serta pembayaran dikonfirmasi admin secara manual.

Otomatis mulai Rp2.000.000: Satu dapur/toko, 40 produk, 80 varian total, QRIS dinamis, stok, kuota pre-order, batas pemesanan, jadwal dan ongkir lima zona; dua admin. Kurir diatur admin.

Jadwal indikatif: Katalog 4-6 hari kerja; otomatis 2-4 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/bekal/. Paket otomatis: ?package=bekal-qris.

## LUMA: Toko online

Starter Rp500.000: Satu halaman, 10 produk, detail/varian, pencarian, keranjang, ongkir tetap, dan ringkasan pesanan. QRIS/tautan bayar merchant; status diverifikasi manual. Tanpa akun atau database pesanan.

Otomatis mulai Rp1.500.000: Satu toko/gudang, 30 produk, 60 varian total, admin stok/pesanan, QRIS dinamis, invoice email, kupon, resi manual dan CSV. Dua admin; API ongkir terpisah.

Jadwal indikatif: Katalog 3-5 hari kerja; otomatis 2-3 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/luma/. Paket otomatis: ?package=luma-qris.

## SELA: Booking layanan

Starter Rp750.000: Lima layanan pada satu halaman, rincian durasi, permintaan jadwal/staf dan ringkasan booking. Slot, DP dan pembayaran dikonfirmasi admin manual; tanpa kalender kapasitas otomatis.

Otomatis mulai Rp2.500.000: Satu lokasi, sepuluh layanan, tiga staf, kalender/slot, reservasi sementara, DP atau penuh dengan QRIS, email konfirmasi, blok jadwal dan permintaan reschedule. Pembatalan sesuai kebijakan.

Jadwal indikatif: Katalog 4-6 hari kerja; otomatis 3-4 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/sela/. Paket otomatis: ?package=sela-qris.

## KARYA: Penjualan produk digital

Starter Rp650.000: Sepuluh produk digital, preview/isi/lisensi dan ringkasan pembelian pada satu halaman. Pembayaran dikonfirmasi manual; tautan file dikirim admin setelah lunas.

Otomatis mulai Rp1.500.000: Satu penjual, 30 produk, QRIS dinamis, email akses setelah lunas, tautan unduh terbatas waktunya, pencatatan unduhan dan kupon. Storage/lisensi aset terpisah; tanpa DRM atau kursus video.

Jadwal indikatif: Katalog 4-6 hari kerja; otomatis 2-3 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/karya/. Paket otomatis: ?package=karya-qris.

## PANGGUNG: Tiket & workshop

Starter Rp750.000: Satu acara, tiga kelas tiket, form peserta dan ringkasan pemesanan. Kuota/pembayaran dikonfirmasi manual, tiket dikirim penyelenggara. Tanpa QR check-in otomatis.

Otomatis mulai Rp3.000.000: Lima acara aktif, tiga kelas per acara, kuota, QRIS dinamis, e-ticket email, kirim ulang dan check-in QR online. Tiga petugas; tanpa peta kursi dan check-in offline.

Jadwal indikatif: Katalog 4-6 hari kerja; otomatis 3-5 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/panggung/. Paket otomatis: ?package=panggung-qris.

## TEMU: Direktori & marketplace

Starter Rp1.000.000: Direktori lima toko dan 30 produk; pencarian/filter, profil toko, ringkasan pesanan per toko dan pembayaran ke merchant terkait yang dikonfirmasi manual. Data diperbarui pengelola; tanpa akun penjual.

Otomatis mulai Rp9.500.000: Pilot 15 penjual, 300 produk total, portal penjual/operator, moderasi produk, QRIS per penjual, pesanan dan invoice komisi. Satu penjual per checkout; kelayakan gateway multi-merchant harus terbukti. Split dana terpisah.

Jadwal indikatif: Direktori 1-2 minggu; marketplace 5-8 minggu. Dimulai setelah bahan, scope, DP dan kesiapan layanan disepakati.
Demo lokal: http://127.0.0.1:4321/demo/temu/. Paket otomatis: ?package=temu-qris.

## Alur yang dapat dicoba

- SAJI: menu, topping pada paket otomatis, meja/pickup, catatan, total, status bayar, antrean dapur, menu tidak tersedia dan laporan CSV.
- BEKAL: varian kemasan, pre-order H-1, tanggal, lima zona ongkir, kuota contoh 12 paket/tanggal, pembayaran dan pengelolaan pesanan.
- LUMA: pencarian/filter/urutan harga, detail/varian, keranjang, ongkir, kupon HEMAT10, status, resi manual dan laporan.
- SELA: satu layanan per reservasi, durasi/jeda, tanggal/staf, DP 50% atau penuh, benturan slot, blok jadwal, permintaan perubahan dan persetujuan admin.
- KARYA: preview dan lisensi, kupon KARYA10, akses otomatis setelah lunas, file CSV/Markdown/HTML nyata, batas 24 jam dan pencatatan unduhan. Starter menunggu pengiriman admin.
- PANGGUNG: Starter satu acara/tiga kelas; otomatis lima acara contoh, nama tiap peserta, e-ticket HTML dengan QR lokal, kode check-in dan pencegahan penggunaan dua kali.
- TEMU: lima toko contoh, profil/filter toko, satu penjual per checkout, barang toko lain tetap di keranjang, tampilan operator/penjual, moderasi katalog, laporan dan invoice komisi contoh 5%.

Data dan harga barang fiktif. Demo memakai localStorage per kategori dan kontrol simulasi lunas/kedaluwarsa/refund sebelum penyerahan. Kode QR pembayaran adalah ilustrasi yang tidak dapat dibayar; QR tiket hanya berisi ID demo. Email, kamera scan, printer, ongkir API, notifikasi eksternal serta gateway nyata belum terhubung. Peran visual tidak menggantikan autentikasi/otorisasi server. File e-ticket contoh bukan tiket acara nyata.

## Pembayaran produksi

Akun merchant, rekening penerima, domain, hosting/database dan kanal email dimiliki klien. Aktivasi QRIS dinamis memerlukan persetujuan merchant, dukungan jenis usaha, koneksi server, verifikasi nominal/status/order, webhook terverifikasi dan idempotensi, serta pengujian staging. Kategori produk digital dan dukungan multi-merchant diperiksa sebelum kontrak.

TEMU otomatis adalah pilot 15 penjual/300 produk total; satu seller per checkout, dana langsung ke akun merchant seller. Komisi menggunakan invoice terpisah. Split dana, escrow, pencairan otomatis, saldo wallet dan alur multi-seller dalam satu pembayaran tidak termasuk Rp9.500.000. Kelayakan multi-merchant harus terbukti sebelum implementasi; jika belum tersedia, direktori/manual tetap menjadi pilihan.

MDR, pemrosesan, pajak, settlement dan refund mengikuti kategori merchant serta kontrak gateway; tidak dijanjikan satu tarif universal atau bebas seluruh biaya. Checkout demo tidak menambahkan surcharge QRIS kepada pembeli. Produksi memisahkan harga jasa dan biaya transaksi sebelum persetujuan.

## Domain, hosting dan biaya jasa

Starter statis dapat memakai hosting/subdomain gratis sesuai batas layanan. Domain custom tahunan dapat dipasang pada hosting statis gratis. Otomatis memerlukan server/database, backup dan email sesuai beban; fungsi backend tidak termasuk hosting statis gratis. Pilihan hosting/durasi tetap mengikuti estimator Indonesia pada konsultasi: 1/3/6/12/24 bulan, resource dan harga reguler, promo/perpanjangan terpisah, kebutuhan custom dibahas dahulu.

Domain mengikuti subtotal + PPN 11% lalu pembulatan ke atas per Rp5.000, tanpa margin jasa. .com Rp155.000 tahun pertama / Rp235.000 perpanjangan sesuai acuan proyek 13 Oktober 2026. Harga final mengikuti tagihan. Cek RDAP memakai registry resmi: ceklis tersedia, silang terdaftar, alternatif kandidat diperiksa; reserved/premium dan pembelian tetap dikonfirmasi. Merek provider tidak ditampilkan pada UI.

Pembayaran jasa: DP 50%, pelunasan 50% setelah staging diterima, sebelum peluncuran. Garansi Starter 14 hari; commerce otomatis 30 hari, bug dalam scope. Pemeliharaan opsional mempunyai batas tertulis. Lisensi, fotografi, storage, email, gateway dan pekerjaan di luar scope dipisahkan dalam proposal.

## Desain dan aset

Identitas utama menggunakan logo supplied RakanDev dan favicon pilihan pengguna; Caveat/Manrope, teal/sky/cream dipertahankan. Tujuh demo mempunyai mark SVG sendiri, tipografi serta komposisi berbeda: SAJI tomato/menu, BEKAL bakery editorial, LUMA homeware, SELA studio panorama, KARYA lembar kreatif, PANGGUNG poster/agenda, TEMU kurasi pasar. Font dan media disajikan lokal.

Tambahan 25 foto asli berlisensi Unsplash, dikompresi WebP 1400 x 1050. Materi RUANG, PULS, ORBIT dan lainnya menggunakan artwork original yang sudah tersedia. Nama/isi produk disesuaikan setelah inspeksi foto. Generator bitmap sempat dicoba, tetapi layanan menolak dengan quota_exceeded; foto tambahan tidak diklaim sebagai gambar AI. Provenance dan lisensi per berkas dicatat di site/public/assets/manifest.json.

Cover tujuh demo diambil dari situs yang berjalan. Screenshot dan hasil pemeriksaan tersimpan di site/qa/commerce/. Template ini bukan portofolio proyek klien atau testimoni bisnis nyata.

## Konsultasi dan verifikasi

Konsultasi empat tahap: kenalan, brief kategori, domain/hosting, ringkasan. Pilihan layanan dikelompokkan menjadi website profil, Starter, QRIS otomatis, ERP dan custom. Setiap kategori memiliki tiga brief berpemandu; otomatis menambahkan kesiapan merchant/akses tanpa meminta API key atau dokumen bank. Draft dan pilihan per paket dipertahankan. Ringkasan belum dikirim; kontak resmi tetap ditunda.

Pengujian unit memeriksa harga/scope, konfirmasi manual, nominal/idempotensi, stok terakhir, pelepasan reservasi, benturan/jeda/blok booking, kuota pre-order, kupon, isolasi seller, akses unduh, tiket duplikat, resi dan restore state rusak. Build dan pemeriksaan route memeriksa seluruh tautan/aset/metadata serta noindex demo. Browser diperiksa untuk desktop/ponsel dan alur utama tujuh kategori. Ini verifikasi demo lokal; bukan audit backend pembayaran produksi.

Website tetap lokal sesuai instruksi pengguna. Tidak mengunggah source, build atau aset ke layanan publikasi.
