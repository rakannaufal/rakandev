import { catalog } from '../data/catalog.mjs';
import { productModules } from '../data/demos.mjs';
import { commerceBriefs } from '../data/commerce.mjs';
import { esc, icon } from './utils.mjs';

const section = (id,title,hint,example,page='Halaman utama') => ({id,title,hint,example,page});
const opening=section('opening','Pembuka','Apa yang ditawarkan, untuk siapa, dan tindakan utama pengunjung?','Desain interior untuk keluarga muda di Bandung. Judul: Ruang nyaman, cerita baru. Tombol utama: Diskusikan ruang saya.');
const contact=section('contact','Kontak & ajakan','Ke mana pengunjung menghubungi kamu? Jam layanan, lokasi, dan ajakan apa yang ditampilkan?','Tombol WhatsApp ke nomor yang akan saya siapkan. Area layanan Bandung, Senin-Sabtu 09.00-17.00. Ajak pengunjung meminta konsultasi.');
const work=section('work','Karya pilihan','Ceritakan karya atau hasil yang boleh ditampilkan. Cantumkan nama, tujuan, dan bahan yang tersedia.','Tampilkan tiga renovasi ruang keluarga. Tiap karya memuat nama proyek, kebutuhan pemilik, solusi, dan foto hasil yang saya siapkan.');
const services=section('services','Layanan & keunggulan','Layanan utama apa yang dijual? Apa perbedaannya? Hindari klaim yang belum dapat dibuktikan.','Desain interior, penataan ruang, dan pemilihan material. Fokus pada ruang kecil, material mudah dirawat, serta rincian anggaran sebelum produksi.');
export const customFeatureOptions=[
  ['site-cms','Kelola konten','Konten apa yang perlu diubah sendiri, oleh siapa, dan seberapa sering?','Admin mengubah artikel, foto, layanan, serta harga dari satu panel.'],
  ['site-shop','Katalog & pemesanan','Produk, varian, keranjang, pembayaran, dan proses pengiriman seperti apa?','Produk mempunyai warna dan stok. Pengunjung memilih produk, checkout, lalu melihat status pesanan.'],
  ['site-account','Akun & akses','Siapa yang memiliki akun? Apa hak akses setiap jenis pengguna?','Admin mengelola data; pelanggan hanya melihat pesanan dan profil miliknya.'],
  ['site-booking','Jadwal & reservasi','Apa yang dipesan, kapasitas, aturan jadwal, dan pembatalannya?','Pelanggan memilih layanan serta slot; admin mengonfirmasi reservasi.'],
  ['site-forms','Formulir khusus','Kolom, lampiran, validasi, dan penerima formulir seperti apa?','Nama, email, layanan, pesan, lampiran PDF; diteruskan ke admin untuk ditindaklanjuti.'],
  ['site-data','Data & laporan','Data apa yang disimpan? Laporan dan ekspor apa yang diperlukan?','Daftar permintaan pelanggan, status tindak lanjut, dan ekspor CSV per bulan.'],
  ['site-integration','Integrasi layanan','Layanan apa yang perlu terhubung? Apakah akun dan API sudah tersedia?','Pembayaran dan pengiriman akan memakai akun milik usaha; koneksi diuji di staging.'],
  ['site-other','Fitur lainnya','Jelaskan kebutuhan yang belum ada di pilihan lain.','Portal untuk melihat progres pekerjaan, dokumen, dan tagihan proyek.'],
].map(([id,name,scope,example])=>({id,name,pricedConfigurationScope:scope,discoveryReferenceFeatures:[example],price:{amount:null}}));
const webSections={
  landing:[opening,services,work,contact],
  portfolio:[section('opening','Perkenalan','Siapa kamu, bidang keahlianmu, dan jenis kolaborasi yang dicari?','Saya desainer identitas brand. Membantu usaha kuliner tampil konsisten. Tombol utama menuju karya pilihan.'),section('about','Tentang & keahlian','Pendekatan kerja, keahlian, dan pengalaman mana yang relevan?','Bidang utama: identitas visual, editorial, dan website. Pendekatan: pahami usaha, eksplorasi konsep, lalu susun panduan visual.'),{...work,hint:'Paket memuat enam karya. Untuk tiap karya, tulis judul, kategori, masalah, solusi, dan tautan foto.'},contact],
  plus:[opening,services,section('process','Cara kerja','Apa urutan pemesanan atau proses layananmu?','Konsultasi kebutuhan, pemeriksaan lokasi, penawaran tertulis, pengerjaan, dan pemeriksaan hasil.'),work,section('faq','Pertanyaan pelanggan','Apa pertanyaan yang sering muncul? Sertakan jawaban yang benar untuk usahamu.','Apakah bisa satu ruangan? Bisa. Apakah ada survey? Jadwal dan biaya disepakati. Siapa menyiapkan material? Mengikuti penawaran.'),{...contact,title:'Kontak & formulir',hint:'Tentukan penerima dan kolom formulir, maksimal lima kolom. Contoh: nama, email, layanan, pesan.'}],
  profile:[{...opening,page:'Beranda'},{...services,page:'Beranda'},{...work,id:'home-work',page:'Beranda'},{...contact,page:'Beranda'},section('about','Tentang usaha','Ceritakan usaha, perjalanan, dan pendekatan kerja.','Usaha perencanaan ruang kerja. Mulai dari kebutuhan tim, lalu menyusun ruang dan tahap pelaksanaan.','Tentang'),section('story','Perjalanan & pendekatan','Apa cerita pendirian atau cara kerja yang perlu dikenalkan?','Berawal dari kebutuhan ruang kerja yang lebih nyaman. Tiap proyek melalui perencanaan dan pemeriksaan bersama.','Tentang'),section('team','Tim & nilai kerja','Siapa yang perlu diperkenalkan? Nilai kerja apa yang bisa dijelaskan dengan contoh?','Tim perencana dan desainer. Nilai: komunikasi terbuka, rincian pekerjaan jelas, dan pemeriksaan tiap tahap.','Tentang'),{...contact,id:'about-contact',page:'Tentang'},section('work-intro','Pembuka karya / layanan','Apa pengantar untuk halaman karya atau layanan?','Ruang dan pengalaman kerja yang direncanakan dari kebutuhan pengguna.','Karya / layanan'),{...work,page:'Karya / layanan'},section('work-detail','Detail & proses','Informasi apa yang penting pada tiap karya atau layanan?','Kebutuhan, pendekatan, material, dan hasil. Semua foto memakai bahan yang saya punya izin untuk gunakan.','Karya / layanan'),{...contact,id:'work-contact',page:'Karya / layanan'}],
};
const processQuestions=[
  section('workflow','Alur utama','Ceritakan satu pekerjaan dari awal sampai selesai. Siapa melakukan apa?','Sales menerima pesanan, gudang memeriksa stok, barang dikirim, keuangan menerbitkan faktur dan mencatat pembayaran.','Kebutuhan sistem'),
  section('users','Pengguna & akses','Berapa pengguna, cabang, dan siapa yang dapat melihat atau mengubah data?','Satu perusahaan, lima pengguna: admin, dua sales, gudang, keuangan. Sales melihat pelanggannya sendiri.','Kebutuhan sistem'),
  section('reports','Hasil & laporan','Laporan apa yang paling membantu? Contoh data atau format yang sudah dipakai?','Order belum terkirim, stok minimum, piutang jatuh tempo. Saat ini dicatat di spreadsheet.','Kebutuhan sistem'),
];

export function scopeFor(productId,quantities={},moduleIds=[]){
  const product=catalog.products.find(p=>p.id===productId);
  const isWebsite=Boolean(webSections[productId]||product?.commerce);
  const commerceSections=product?.commerce?commerceBriefs[product.commerce.key].map(([id,title,hint,example])=>section(id,title,hint,example,'Alur pemesanan')):null;
  if(commerceSections){
    const automatic=product.commerce.level==='automatic';
    if(automatic)commerceSections[0].hint=commerceSections[0].hint.replace('Starter memuat 12 menu.','');
    commerceSections[0].hint+=' Paket pilihan: '+product.limits.products+' '+(product.commerce.key==='sela'?'layanan':product.commerce.key==='panggung'?'acara aktif':'produk/menu')+'.';
    if(automatic)commerceSections.push(section('merchant','Kesiapan pembayaran otomatis','Apakah akun merchant milik usaha sudah aktif? Siapa penerima notifikasi dan admin pesanan? Cukup tulis status; jangan isi kunci API atau dokumen bank.','Akun merchant belum aktif. Saya perlu panduan pendaftaran; dua admin akan mengelola pesanan.','Pembayaran & akses'));
  }
  const sections=(commerceSections||webSections[productId]||processQuestions).map(x=>({...x}));
  if(isWebsite){
    const included=catalog.packageInclusions[productId]||{};
    const extraSections=Math.max(0,Math.min(100,Number(quantities.section)||0)-(included.section||0));
    const extraPages=Math.max(0,Math.min(100,Number(quantities.page)||0)-(included.page||0));
    for(let i=0;i<extraSections;i++)sections.push(section('extra-'+i,'Bagian tambahan '+(i+1),'Apa tujuan bagian ini, isi, dan bahan yang tersedia?','Contoh: daftar paket layanan dan harga, dengan satu tombol pemesanan.'));
    for(let i=0;i<extraPages;i++)sections.push(section('page-'+i,'Halaman tambahan '+(i+1),'Nama halaman, susunan isi, dan tindakan pengunjung?','Contoh: halaman layanan dengan pembuka, daftar layanan, pertanyaan, dan kontak.','Halaman tambahan'));
  }
  const includedModules=['erp-custom','erp-zero'].includes(productId)?[]:(productModules[productId]||[]);
  const featureCatalog=productId==='custom'?customFeatureOptions:product?.kind==='erp'?catalog.erpModules:[];
  const chosen=[...new Set([...includedModules,...moduleIds])].filter(id=>featureCatalog.some(m=>m.id===id));
  const features=chosen.map(id=>{
    const module=featureCatalog.find(m=>m.id===id);
    const included=includedModules.includes(id)&&!['erp-custom','erp-zero','erp-discovery'].includes(productId);
    return {id,name:module.name,included,price:module.price.amount,scope:module.pricedConfigurationScope,example:module.discoveryReferenceFeatures[0]||module.pricedConfigurationScope};
  });
  return {product,isWebsite,sections,features,includedModules,featureCatalog};
}

export function renderScopeFields(scope,answers={}){
  const sectionAnswers=answers.sections||{}, featureAnswers=answers.features||{};
  return `<div class="scope-builder-intro"><h2>${scope.isWebsite?'Susun cerita websitemu.':'Ceritakan cara kerjanya.'}</h2><p>${scope.isWebsite?'Isi satu per satu. Belum tahu jawabannya? Boleh ditulis “bantu arahkan”.':'Mulai dari alur terpenting. Pilihan fitur di luar paket akan dibahas dan dihitung terpisah.'}</p><p class="scope-counter" data-scope-completion></p></div><div class="scope-outline">${scope.sections.map((s,i)=>`<details class="brief-section" ${i===0?'open':''}><summary><span class="section-index">${i+1}</span><span><small>${esc(s.page)}</small><b>${esc(s.title)}</b></span><span class="section-answer-state" data-answer-state="${s.id}"></span>${icon('arrow-right',18)}</summary><div class="section-body"><label for="scope-${s.id}">Brief ${esc(s.title.toLowerCase())}</label><p class="field-hint" id="hint-${s.id}">${esc(s.hint)}</p><textarea id="scope-${s.id}" data-section-brief="${s.id}" aria-describedby="hint-${s.id}" rows="4" maxlength="3000" placeholder="Ceritakan dengan bahasamu sendiri...">${esc(sectionAnswers[s.id]?.brief||'')}</textarea><button type="button" class="example-button" data-brief-example="${s.id}">Isi contoh untuk diedit ${icon('arrow-right',16)}</button><label for="assets-${s.id}">Tautan bahan atau catatan (opsional)</label><input id="assets-${s.id}" data-section-assets="${s.id}" maxlength="1000" placeholder="Tautan folder foto, teks siap, atau bahan belum tersedia" value="${esc(sectionAnswers[s.id]?.assets||'')}"></div></details>`).join('')}</div>${scope.featureCatalog.length?`<section class="feature-builder"><h3>Brief tiap fitur</h3><p>Fitur paket tetap terlihat. Tambahan ditandai agar tidak dianggap sudah termasuk.</p><div class="feature-choice-list">${scope.featureCatalog.map(m=>`<label><input type="checkbox" data-brief-module="${m.id}" ${scope.features.some(f=>f.id===m.id)?'checked':''} ${scope.features.some(f=>f.id===m.id&&f.included)?'disabled':''}><span>${esc(m.name)}</span>${scope.features.some(f=>f.id===m.id&&f.included)?'<small>Dalam alur paket</small>':''}</label>`).join('')}</div><div class="feature-briefs">${scope.features.map(f=>`<details class="brief-section feature-brief"><summary><span><b>${esc(f.name)}</b><small>${f.included?'Penyesuaian mengikuti batas paket':'Kebutuhan tambahan / proposal terpisah'}</small></span>${icon('arrow-right',18)}</summary><div class="section-body"><p class="field-hint">${esc(f.scope)}</p><label for="feature-${f.id}">Apa yang ingin dilakukan dengan fitur ini?</label><textarea id="feature-${f.id}" data-feature-brief="${f.id}" rows="3" maxlength="3000" placeholder="Alur, aturan, pengguna, dan hasil yang diharapkan...">${esc(featureAnswers[f.id]?.brief||'')}</textarea><button type="button" class="example-button" data-feature-example="${f.id}">Isi contoh untuk diedit</button><label for="feature-output-${f.id}">Laporan atau kriteria hasil (opsional)</label><input id="feature-output-${f.id}" data-feature-output="${f.id}" maxlength="1000" value="${esc(featureAnswers[f.id]?.output||'')}" placeholder="Contoh: stok berkurang setelah order dikirim"></div></details>`).join('')||'<p class="note">Pilih modul yang ingin dibahas, atau cukup isi alur utama.</p>'}</div></section>`:''}`;
}

export function scopeBriefLines(data,scope){
  const lines=['','Brief isi & fitur'];
  if(scope.product?.commerce)lines.push('Batas paket: '+scope.product.scope);
  for(const section of scope.sections){
    const answer=data.scopeAnswers?.sections?.[section.id];
    lines.push(section.page+' / '+section.title+': '+(answer?.brief?.trim()||'Bantu arahkan'));
    if(answer?.assets?.trim())lines.push('Bahan: '+answer.assets.trim());
  }
  for(const feature of scope.features){
    const answer=data.scopeAnswers?.features?.[feature.id];
    lines.push(feature.name+' ('+(feature.included?'dalam batas alur paket':'dibahas terpisah')+'): '+(answer?.brief?.trim()||'Bantu arahkan'));
    if(answer?.output?.trim())lines.push('Hasil yang diharapkan: '+answer.output.trim());
  }
  return lines;
}
