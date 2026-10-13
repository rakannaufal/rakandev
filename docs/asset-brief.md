# Brief aset RD / RakanDev — revisi 13 Oktober 2026

Status: diimplementasikan dan diverifikasi lokal. Arahan terbaru mengganti kemiripan dengan Odoo pada plan awal. PLAN.md menyimpan perencanaan awal; brief ini menjelaskan aset situs saat ini.

## Arah visual

Studio web kreatif, ramah, tegas. Hero rata kiri, fotografi dan poster bertumpuk, galeri karya asimetris, ritme section bervariasi. Brand Kit 4.0: teal #086288, blue #4D8DBA, sky #97D7FF, cream #FFEFC4, kanvas putih. Caveat 700 untuk headline dan Manrope untuk body/angka/form. Space Grotesk dan Cormorant Garamond tetap dipakai sesuai karakter demo.

Aset publik berada di site/public/assets/. Kit final di brand/ merupakan sumber identitas situs. scripts/sync-brand.mjs menyalin master SVG/PNG, font, tokens, CSS dan ikon final; generator lokal memakai kit yang sama agar hasil dapat direproduksi.

## Logo dan ikon

Monogram RD menyatu dalam satu path, wordmark RakanDev outline Caveat yang disesuaikan, susunan mark/wordmark/horizontal/stacked, varian primary/blue/cream/white, PNG transparan, logo mikro, favicon 16/32, touch icon, dan ikon perangkat. Semua master logo disalin tanpa perubahan; SVG tidak memerlukan font eksternal. Alias lama plum/ink merujuk master primary. Master wordmark putih tetap wordmark asli. Ikon modul/kategori memakai keluarga SVG yang tersedia. Doodle dan ilustrasi awal tetap tersedia sebagai aset pendukung.

## Artwork original

12 komposisi baru, masing-masing master SVG 1400 x 1050 serta ekspor WebP:

| Aset | Konsep |
| --- | --- |
| ara-coffee | Kemasan kopi hijau/peach, lettering, pola, detail kemasan |
| puls-poster | Poster tipografi cobalt/coral |
| moru-skincare | Komposisi skincare dan identitas |
| ruang-editorial | Buku terbuka, editorial, ilustrasi arsitektural |
| orbit-identity | Identitas studio, garis orbit, kartu nama |
| luma-digital | Konsep website pada laptop |
| studio-collage | Poster teal dan kartu cream dengan logo RD final untuk hero portofolio |
| mug-luma | Keramik cobalt, volume/pantulan/bayangan |
| lamp-senja | Lampu meja dengan komposisi studio |
| tote-harian | Tote canvas, lettering dan jahitan |
| material-study | Swatch kayu, keramik, microcement |
| rd-stationery | Letterhead dan kartu teal/cream memakai master logo final |

Nama contoh memakai Luma pada konten, master SVG, raster, dan cover demo. Data demo tersimpan dimigrasikan tanpa menghapus transaksi. Semua nama/proyek demo fiktif; artwork tidak diklaim sebagai pekerjaan klien. Galeri portofolio berisi enam konsep dengan uraian dan deliverables. Aset tambahan/desain eksploratif demo tidak otomatis termasuk Basic.

## Fotografi

Delapan foto lokal 1600 x 1100 WebP: interior-hero, interior-living, interior-kitchen, interior-detail, interior-bedroom, works-office, works-studio, renovasi-room. Bersumber dari Unsplash dengan lisensi penggunaan komersial; foto bukan dibuat RD dan bukan dokumentasi proyek klien. Identitas/sumber foto ada pada manifest. Nama kitchen/bedroom merupakan identifier lama; alt mengikuti isi foto yang diverifikasi.

## Pemakaian demo

RD Interior memakai serif arsitektural, lima foto, dan komposisi ruang asimetris. RD Studio memakai tipografi besar dan enam artwork brand. RD Renovasi menggabungkan foto dengan material study, accordion, proses, proyek, FAQ, form simulasi. RD Works mempunyai tiga halaman graphite/oranye dengan foto ruang kerja. RD Shop memakai still-life produk original dan keranjang fungsional. Cover ERP berasal dari simulator yang berfungsi.

## Cover, lisensi, dan regenerasi

23 cover 1200 x 750 diambil dari demo aktual, badge teal RD. Open Graph 1200 x 630 memakai komposisi hero baru. Semua gambar memiliki dimensi/alt; gambar bawah halaman lazy, hero diprioritaskan. Motion memiliki reduced-motion.

Manifest mencatat file, fungsi, dimensi, alt, provenance, lisensi, tanggal. Lisensi Unsplash/OFL tercatat di site/public/assets/licenses/. Artwork vector/raster tetap dapat diregenerasi tanpa layanan generasi gambar.

Dari folder site:

~~~sh
npm run assets:generate
npm run assets:capture
npm run build
npm run check:routes
~~~

Regenerasi foto online: npm run assets:refresh-photos. Mode offline menggunakan foto lokal yang sudah tersedia. Jalankan capture setelah generate; kedua proses menulis manifest dan harus berurutan.
