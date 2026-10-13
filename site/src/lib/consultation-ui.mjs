import { catalog } from '../data/catalog.mjs';
import { demos } from '../data/demos.mjs';
import { infrastructureFields } from './infrastructure-ui.mjs';
import { esc, icon } from './utils.mjs';

const field=(name,label,options='')=>`<div class="field"><label for="brief-${name}">${label}</label><input id="brief-${name}" name="${name}" ${options} aria-describedby="error-${name}"><span class="field-error" id="error-${name}"></span></div>`;
const next=(label)=>`<button type="button" class="button primary" data-brief-next>${label} ${icon('arrow-right',18)}</button>`;
const back='<button type="button" class="button secondary" data-brief-back>Kembali</button>';

export function renderConsultation(){
  const groups=[['Website profil',p=>p.kind==='website'&&!p.commerce&&p.id!=='custom'],['Penjualan & booking - Starter',p=>p.commerce?.level==='starter'],['Penjualan & booking - QRIS otomatis',p=>p.commerce?.level==='automatic'],['Sistem ERP',p=>p.kind==='erp'],['Kebutuhan custom',p=>p.id==='custom']];
  const productOptions=groups.map(([name,match])=>`<optgroup label="${esc(name)}">${catalog.products.filter(match).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</optgroup>`).join('');
  return `<section class="consultation-heading container"><div><h1>Idemu, kita susun<br><span>selangkah demi selangkah.</span></h1><p>Empat tahap. Isi dengan bahasamu sendiri, simpan draft, lalu bawa ringkasannya ke konsultasi.</p></div><img src="/assets/brand/rakandev-signature.webp" width="360" height="98" alt="RakanDev"></section>
  <section class="container consultation-layout guided-consultation"><aside class="consultation-aside"><img class="consultation-art" src="/assets/artwork/rd-stationery.webp" width="1400" height="1050" alt="Identitas RakanDev pada stationery"><div class="brief-package-summary" data-package-summary aria-live="polite"></div><p class="note">Tiga putaran revisi untuk penyesuaian dalam scope. Domain dan hosting dihitung terpisah.</p><a class="text-link" href="/pricing/">Lihat semua harga ${icon('arrow-right',16)}</a></aside>
  <div class="brief-panel"><ol class="brief-progress" aria-label="Tahap brief">${['Kenalan','Isi & fitur','Alamat website','Ringkasan'].map((name,i)=>`<li data-progress="${i+1}" ${i===0?'class="active" aria-current="step"':''}><span>${i+1}</span><b>${name}</b></li>`).join('')}</ol><div class="brief-draft-bar"><p class="draft-status" data-draft-status role="status">Draft disimpan hanya di tab browser ini.</p><button type="button" class="quiet-link" data-clear-brief>Hapus draft</button></div>
  <form id="consultation-form" novalidate>
    <section data-brief-step="1"><h2 tabindex="-1" data-step-heading>Kenalan dulu, yuk.</h2><p class="step-intro">Apa yang ingin dibuat, siapa yang akan menggunakannya?</p>
      ${field('name','Nama kamu','autocomplete="name" maxlength="100" required')}
      ${field('business','Nama usaha / proyek','autocomplete="organization" maxlength="160" required')}
      ${field('contact','Email atau WhatsApp','autocomplete="email" maxlength="160" required')}
      <div class="field"><label for="brief-product">Pilih layanan</label><select id="brief-product" name="product"><option value="">Bantu pilih layanan</option>${productOptions}</select></div>
      <div class="field"><label for="brief-goal">Tujuan utama website atau sistem</label><p class="field-hint">Contoh: memperkenalkan usaha, mendapatkan pertanyaan pelanggan, atau merapikan stok.</p><textarea id="brief-goal" name="goal" rows="3" maxlength="3000" required aria-describedby="error-goal"></textarea><span class="field-error" id="error-goal"></span></div>
      <div class="step-actions">${next('Susun isi & fitur')}</div>
    </section>
    <section data-brief-step="2" hidden><div class="field"><label for="brief-demo">Contoh website sebagai arah visual (opsional)</label><select id="brief-demo" name="demo"><option value="">Bantu arahkan desain</option>${demos.map(d=>`<option value="${d.id}">${esc(d.name)} / ${esc(d.title)}</option>`).join('')}</select><a class="text-link" data-selected-demo href="/demo/" target="_blank" rel="noopener">Lihat contoh ${icon('arrow-right',16)}</a></div><div data-scope-builder></div><details class="brief-extras" data-brief-extras><summary>Butuh isi atau fitur tambahan?</summary><p>Harga berubah sesuai tambahan. Isi paket sudah diperhitungkan.</p><div data-brief-addon-list></div></details><div class="step-actions">${back}${next('Pilih domain & hosting')}</div></section>
    <section data-brief-step="3" hidden><h2 tabindex="-1" data-step-heading>Alamat yang pas untukmu.</h2><p class="step-intro">Bisa mulai gratis. Pilih domain atau hosting berbayar jika diperlukan.</p>${infrastructureFields()}
      <details class="optional-fields"><summary>Anggaran & target waktu (opsional)</summary>${field('budget','Anggaran jasa','maxlength="100" placeholder="Contoh: Rp650.000"')}${field('deadline','Target waktu','type="date"')}</details>
      <label class="consent"><input type="checkbox" name="consent" required aria-describedby="error-consent"><span>Saya menyetujui penggunaan informasi ini untuk ringkasan konsultasi. <a href="/privasi/">Baca privasi</a>.</span></label><span class="field-error" id="error-consent"></span>
      <div class="step-actions">${back}<button type="submit" class="button primary">Periksa ringkasan ${icon('arrow-right',18)}</button></div>
    </section>
    <section data-brief-step="4" hidden><h2 tabindex="-1" data-review-heading>Siap dibahas bersama.</h2><p>Isi, fitur, biaya jasa, domain, dan hosting ada dalam ringkasan ini.</p><div class="review-costs" data-review-costs></div><textarea data-brief-output rows="18" readonly aria-label="Ringkasan brief"></textarea><p class="note">Ringkasan masih di perangkatmu. Belum dikirim.</p><div class="review-actions"><button type="button" class="button primary" data-copy-brief>${icon('copy',18)} Salin ringkasan</button><button type="button" class="button secondary" data-download-brief>${icon('download',18)} Unduh .txt</button><button type="button" class="text-link" data-edit-brief>Ubah brief</button></div><div class="contact-actions" data-contact-actions></div><p data-copy-status role="status"></p></section>
    <p class="form-status" data-brief-status role="status"></p>
  </form></div></section>`;
}
