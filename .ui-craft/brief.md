# RakanDev: redesign 13 Oktober 2026

Permintaan terbaru menggantikan arahan Odoo: identitas warna dan komposisi berbeda, menarik untuk promosi, demo kaya, aset digarap serius.

## Audit
- Lama: plum #875A7B, Kalam headline, hero tengah, highlight oranye, curved divider, deretan ikon. Terlalu dekat dengan Odoo.
- Struktur tetap: 25 penawaran, 30 demo, 26 modul, harga/layanan/custom/proses/konsultasi, estimator jasa, draft serta simulasi lokal.
- Konversi: harga > demo > konsultasi > ringkasan. Kontak resmi ditunda pengguna.
- SEO: route/judul layanan dipertahankan; canonical mengikuti SITE_URL atau origin lokal.

## Design Read
Studio web kreatif untuk pemilik usaha Indonesia. Ramah, tegas, editorial berbasis karya. Astro + CSS native.
DESIGN_VARIANCE 8 / MOTION_INTENSITY 5 / VISUAL_DENSITY 4. Entrance dan reveal untuk hierarki; reduced-motion menghapus gerak.

## Produk
Harga jasa terpisah dari domain/hosting. Hosting static gratis + subdomain provider cocok untuk landing/portfolio tanpa backend. Custom domain bisa memakai hosting gratis. Trafik dinilai dari beban, bandwidth, fungsi, batas provider.
Konsultasi: domain, cek RDAP registry nyata dengan enam alternatif, hosting, spesifikasi dan durasi. Merek penyedia tidak ditampilkan. Nama contoh memakai Luma; data demo lama dimigrasikan tanpa reset. Belum terdaftar bukan jaminan pembelian: reserved/premium dan checkout registrar tetap diperiksa. Harga bersumber, bertanggal; promo/perpanjangan terpisah.

## Batas
- Preview dan hosting tetap lokal. Unggahan source ke GitHub rakannaufal/rakandev diizinkan pengguna pada 13 Oktober 2026; tidak ada publikasi Sites.
- Tidak mengarang kontak, testimoni, klien atau performa.
- Demo kaya merupakan konsep; aset tambahan tidak otomatis termasuk Basic.
- Foto berlisensi dibedakan dari artwork original RD.

## Identitas supplied
Logo utama menggunakan PNG di RakanDev-Logo-Assets, disalin persis dan diekspor lossless dengan padding dipangkas. Favicon menggunakan gambar RD yang dikirim pengguna pada 13 Oktober 2026. Token teal #086288, blue #4D8DBA, sky #97D7FF, cream #FFEFC4 serta font lokal Caveat/Manrope dipertahankan. Header/footer, toolbar, artwork, cover, OG mengikuti identitas supplied. Demo memiliki bahasa visual masing-masing.

## Konsultasi dan biaya
Empat tahap: kenalan, isi/fitur, domain/hosting, ringkasan. Brief per bagian untuk Basic/Plus, per halaman untuk profil, per modul untuk ERP, per fitur untuk custom. Jawaban berbeda per paket tetap tersimpan; materi boleh ditandai belum siap. Tambahan dihitung setelah inklusi paket. Tiga putaran revisi dalam scope.
Tarif domain mengikuti screenshot acuan pengguna: subtotal + PPN 11%, dibulatkan ke atas per Rp5.000 sesuai koreksi terbaru. Tanpa margin jasa tambahan. Subtotal, PPN, selisih pembulatan, tahun pertama dan perpanjangan diperlihatkan. Harga final mengikuti tagihan sebelum pembayaran.

## Commerce, 13 Oktober 2026
Harga awal Rp500.000; Starter statis dengan konfirmasi manual, otomatis dengan harga/scope tersendiri. Tujuh gaya demo, mark SVG, 25 foto asli berlisensi, artwork RD tersedia. Gambar baru gagal karena kuota; pakai foto asli tanpa klaim generasi. Jangan memberi semua demo satu komposisi: SAJI/BEKAL arch, LUMA product dominant, SELA panorama, KARYA sheet, PANGGUNG poster/agenda, TEMU market band. Mobile hero harus muat kata terpanjang; periksa clipping di dalam container, bukan hanya overflow dokumen. Biaya domain PPN + pembulatan ke atas per Rp5.000 tetap.

## Hero dan harga Basic, revisi 13 Oktober 2026
Landing page dan portofolio Basic Rp300.000, DP 50% Rp150.000. Commerce tetap mengikuti harga kategorinya. Harga acuan, estimator, konsultasi, FAQ, metadata dan materi sosial memakai katalog yang sama.
Hero berganti otomatis setiap 8 detik: 30 screenshot demo sebagai background, aset utama/nama/harga/tautan mengikuti demo aktif. Harga industri adalah rentang indikatif, custom setelah konsultasi. Background fit contain dari sisi atas agar navbar demo tetap utuh; opacity 32%, overlay menjaga keterbacaan teks. Tidak ada panel pemilih, dropdown, panah navigasi atau nomor slide: pengguna menghapusnya karena memenuhi hero. Satu ikon jeda kecil di sudut artwork mengendalikan rotasi. Reduced motion mematikan autoplay; fokus/hover/offscreen/tab tersembunyi menjeda, putar eksplisit tetap bekerja saat tombol mendapat fokus.
