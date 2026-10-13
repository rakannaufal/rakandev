# RakanDev Brand Kit

Identitas RakanDev untuk website dan sistem usaha: ekspresif, personal, dan mengalir. Monogram R+D saling menyatu; simbol dan wordmark selalu satu warna. Lettering dan headline memakai karakter tulisan tangan yang terinspirasi website Odoo.

## Mulai

- Buka `index.html` untuk panduan visual interaktif, swatch warna, uji logo kecil, dan contoh komponen.
- `design-system.md` menjelaskan aturan brand dan UI dalam bahasa Indonesia.
- `design-system.css` menyediakan font lokal, CSS variables, dan komponen dengan prefix `rd-`.
- `tokens.json` menyediakan token bertipe untuk developer atau integrasi alat desain.
- `logos/` berisi master SVG dan PNG transparan untuk simbol, wordmark, horizontal, serta vertikal.
- Panduan PDF tersedia di `../output/pdf/rakandev-design-system.pdf`.

## Pilih logo

| Kebutuhan | File |
| --- | --- |
| Logo utama: RD menyatu + logo teks satu warna teal | `logos/rakandev-horizontal-primary.svg` |
| Simbol RD | `logos/rakandev-mark-primary.svg` |
| Logo teks tanpa simbol | `logos/rakandev-wordmark-primary.svg` |
| Komposisi vertikal | `logos/rakandev-stacked-primary.svg` |
| Aksen satu warna / latar putih | Varian `-blue.svg` |
| Latar teal brand | Varian `-cream.svg` atau `-white.svg` |
| Simbol 16-23px | `logos/rakandev-mark-micro.svg` |
| Favicon / ikon aplikasi | `logos/favicon.svg`, `favicon-16.png`, `favicon-32.png` |

Palet inti mengikuti referensi: Sea Teal `#086288`, Harbor Blue `#4D8DBA`, Sky Blue `#97D7FF`, Warm Cream `#FFEFC4`. Primary memakai Sea Teal pada seluruh simbol dan wordmark. Semua varian satu warna. Kaki diagonal R sekaligus menjadi batang D; dua ruang negatif memperjelas hurufnya.

PNG simbol: 1024 x 1024px. PNG wordmark, horizontal, dan vertikal: lebar 2400px. Semua PNG logo memiliki alpha transparan; ikon aplikasi memakai simbol cream pada latar teal.

## Regenerasi

Di repositori sumber, setelah dependensi `site/` terpasang:

```sh
node brand/generate.mjs
```

Path lettering dan monogram sudah disimpan di `source/`; regenerasi tidak memerlukan alat konversi font. Script menggunakan Sharp dari dependensi `site/`. Versi mikro memiliki ruang negatif lebih luas untuk ukuran 16-23px.

## Implementasi

Simpan struktur `fonts/` di samping CSS. CSS hanya mengatur variables dan kelas `rd-*`, tanpa reset global. Gunakan komponen dan token sesuai kebutuhan.

```html
<link rel="stylesheet" href="/brand/design-system.css">
<a class="rd-button rd-button--primary" href="/konsultasi/">
  Konsultasi kebutuhan
</a>
```

Untuk situs yang sudah memakai `--plum`, `--ink`, `--display`, dan `--body`, petakan ke token `--rd-brand`, `--rd-ink`, `--rd-font-display`, dan `--rd-font-body` saat integrasi.

## Canvas desain

[Buka canvas RakanDev di Superdesign](https://superdesign.dev/teams/339e816c-5568-46e0-be69-57bf55ef8ee0/projects/79710a3f-f622-4e7e-a25c-0377735727a6).

Revisi 4.0 memakai wordmark Caveat dengan spasi optis, kontur lebih lebar, dan terminal v yang memanjang. Headline Caveat dipadukan dengan teks Manrope serta sapuan cream/sky. Monogram mengikuti prinsip interlock pada referensi AutoPrompt. Pratinjau canvas serta panduan offline memakai aset SVG final yang sama.

## Sumber dan lisensi

Monogram RD dan komposisi logo dibuat untuk RakanDev. Wordmark berbasis Caveat Bold dari The Caveat Project Authors; outline diberi spasi optis, diperlebar 8%, dan terminal v disesuaikan. Headline [website Odoo](https://www.odoo.com/) menjadi referensi tipografi. Font Caveat dan Manrope memakai SIL Open Font License 1.1; salinan lisensi disertakan di `fonts/`. Ikon memakai keluarga SVG original yang sudah ada di proyek RakanDev. Tidak ada font atau gambar remote di master SVG.
