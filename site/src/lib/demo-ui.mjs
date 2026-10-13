import { esc, icon } from './utils.mjs';
import { rupiah } from './pricing.mjs';
import { moduleSpecs, totals } from './demo-state.mjs';
export function reportsFor(config) {
  const ids = ['erp-pilot','erp-zero'].includes(config.id) ? ['crm','projects'] : config.id==='erp-starter' ? ['sales','analytics','accounting','cash-bank'] : config.id==='erp-operations' ? ['sales','analytics','accounting','cash-bank','procurement-inventory','approval'] : ['sales','analytics','accounting','cash-bank','procurement-inventory','projects','crm','approval'];
  return ids.map(id=>({id:id==='analytics'?'invoices':id,...moduleSpecs[id]}));
}
export function specFor(config, id, report='') {
  if (id==='analytics') return reportsFor(config).find(item=>item.id===report)||reportsFor(config)[0];
  if (id !== 'sector') return moduleSpecs[id];
  const labels = { healthcare: ['Antrean klinik','Pasien fiktif','Dokter fiktif','Biaya layanan','Panggil / selesaikan'], education: ['Siswa & tagihan','Siswa fiktif','Program kelas','Tagihan contoh','Bayar simulasi'], agribusiness: ['Budidaya & panen','Blok lahan','Komoditas','Biaya budidaya','Catat panen 100 kg'], property: ['Unit & booking','Nama unit','Tipe unit','Harga contoh','Booking 5%'] };
  const [title,name,detail,amount,submit] = labels[config.scenario] || labels.property;
  return { title, collection:'sector', columns:[['name',name],['detail',detail],['amount',amount],...(config.scenario === 'agribusiness' ? [['yield','Panen (kg)']] : config.scenario === 'property' ? [['paid','Cicilan tercatat'],['progress','Progres (%)']] : []),['status','Status']], fields:[['name',name],['detail',detail],['amount',amount,'number']], action:'sector-add', submit:'Tambah data contoh', rowSubmit:submit, note:'Data fiktif. Alur inti disederhanakan untuk konsultasi; fitur khusus sektor dan regulasi diperiksa saat discovery.' };
}
const actionButton = (type,id,label,disabled=false) => `<button class="demo-action" data-action="${type}" data-id="${esc(id)}" ${disabled?'disabled':''}>${esc(label)}</button>`;
export function rowActions(module,row,config,readonly) {
  let buttons = [];
  const add=(type,label,disabled=false)=>buttons.push(actionButton(type,row.id,label,readonly||disabled));
  switch(module) {
    case 'crm': add('advance-lead','Lanjut tahap',row.status==='Menang'); break;
    case 'projects': add('progress','Progres +25%',row.progress>=100); add('project-invoice','Buat termin',row.progress<100||row.invoiced); break;
    case 'sales': case 'ecommerce': add('ship','Kirim',row.status!=='Draf'); add('return','Retur 1 unit',row.status!=='Dikirim'||row.returned>=row.quantity); break;
    case 'procurement-inventory': add('transfer','Transfer 5 unit',row.stock<5); break;
    case 'hr-payroll': add('payroll',row.payrollDone?'Slip: '+rupiah(row.slip):'Buat slip',row.payrollDone); break;
    case 'maintenance': add('maintenance-done','Selesaikan',row.status==='Selesai'); break;
    case 'budget': add('expense','Catat Rp100.000'); break;
    case 'approval': add('approve','Setujui tahap '+Math.min(2,row.level+1),row.level>=2); break;
    case 'analytics': case 'customer-portal': add('pay','Bayar simulasi',row.paid>=row.amount); break;
    case 'after-sales': add('resolve','Selesaikan',row.status==='Selesai'); break;
    case 'supplier-portal': add('supplier-ship','Kirim PO',row.status!=='Menunggu supplier'); add('supplier-receive','Terima PO',row.status!=='Dalam pengiriman'); break;
    case 'employee-portal': add('leave-approve','Setujui cuti',row.status==='Disetujui'); break;
    case 'fleet': add('dispatch','Berangkat',row.status!=='Dijadwalkan'); add('arrive','Sampai',row.status!=='Dalam perjalanan'); break;
    case 'contracts': add('bill-contract','Buat tagihan',row.billed); break;
    case 'compliance': add('risk-done','Tandai ditinjau',row.status==='Ditinjau'); break;
    case 'sector': add('sector-next',specFor(config,module).rowSubmit,['Lunas','Selesai','Dibooking'].includes(row.status)); if(config.scenario==='agribusiness')add('sector-expense','Biaya +Rp100.000'); if(config.scenario==='property'){add('sector-payment','Catat cicilan 10%',row.status!=='Dibooking'||row.paid>=row.amount);add('sector-progress','Progres +25%',row.status!=='Dibooking'||row.progress>=100);} break;
  }
  return buttons.join('');
}
export function fieldHtml([name,label,type='text'],state) {
  const options=type==='product'?state.inventory.map(item=>[item.id,item.name]):type==='role'?['Admin','Operator','Pembaca'].map(v=>[v,v]):type==='direction'?['Masuk','Keluar'].map(v=>[v,v]):type==='result'?['Lulus','Gagal'].map(v=>[v,v]):null;
  return `<label class="demo-field"><span>${esc(label)}</span>${options?`<select name="${name}">${options.map(([value,title])=>`<option value="${esc(value)}">${esc(title)}</option>`).join('')}</select>`:`<input name="${name}" type="${type}" ${type==='number'?'min="'+(name==='overtime'?0:1)+'" max="1000000000000" step="1"':'maxlength="160"'} ${type==='date'?'value="2026-10-15"':''} required>`}</label>`;
}
export function renderCart(state,config,shop=false) {
  const entries=Object.entries(state.cart), count=entries.reduce((sum,[,qty])=>sum+qty,0);
  const sum=entries.reduce((sum,[id,qty])=>sum+state.inventory.find(row=>row.id===id).price*qty,0);
  const imageIds=['food','retail'].includes(config.scenario)?[1,6,1]:[1,2,3];
  return `<div class="demo-commerce ${shop?'shop-commerce':''}"><section><h2>${shop?'Koleksi untuk keseharian.':'Pilih '+(config.entity||'produk').toLowerCase()+'.'}</h2>${shop?'<label class="demo-search shop-search">Cari koleksi<input type="search" data-shop-search placeholder="Mug, lampu, tote..." aria-label="Cari koleksi"></label>':''}<div class="demo-products">${state.inventory.map((item,i)=>`<article data-shop-item="${esc(item.name.toLowerCase())}"><img src="${shop?'/assets/artwork/'+['mug-luma','lamp-senja','tote-harian'][i%3]+'.webp':'/assets/demo-content/product-0'+imageIds[i]+'.webp'}" width="600" height="600" alt="Ilustrasi konsep ${esc(item.name)}"><h3>${esc(item.name)}</h3><p>${rupiah(item.price)} <span>Stok ${item.stock}</span></p>${actionButton('cart-add',item.id,'Tambah ke keranjang',item.stock<=0||state.shiftClosed)}</article>`).join('')}</div><p data-shop-empty hidden>Tidak ada koleksi yang cocok. Coba kata lain.</p></section><aside class="demo-cart" id="keranjang"><h2>Keranjang <span>${count}</span></h2>${entries.length?entries.map(([id,qty])=>{const item=state.inventory.find(row=>row.id===id);return `<div class="cart-line"><div><b>${esc(item.name)}</b><span>${qty} x ${rupiah(item.price)}</span></div>${actionButton('cart-remove',id,'Kurangi')}</div>`;}).join(''):'<p>Belum ada barang. Pilih dari koleksi.</p>'}<div class="cart-total"><span>Total contoh</span><strong>${rupiah(sum)}</strong></div><form data-demo-form="checkout"><label class="demo-field"><span>Nama pelanggan contoh</span><input name="name" maxlength="160" placeholder="Pelanggan contoh"></label>${config.scenario==='food'?'<label class="demo-field"><span>Nomor meja</span><input name="table" value="Meja 1" maxlength="160"></label>':''}<button class="button primary" type="submit" ${!entries.length||state.role==='Pembaca'?'disabled':''}>Checkout simulasi</button></form><p class="demo-fine">Tanpa pembayaran nyata. Stok dan struk contoh diperbarui.</p>${state.receipts.length?`<section class="receipt-history"><h3>Transaksi terbaru</h3>${state.receipts.slice(-3).toReversed().map(row=>`<details><summary>${esc(row.name)} <b>${rupiah(row.amount)}</b></summary><p>${esc(row.detail||row.table)}</p><p>${esc(row.status)}</p><button type="button" class="demo-action" data-receipt-download="${row.id}">Unduh struk</button></details>`).join('')}</section>`:''}${shop?'':actionButton(state.shiftClosed?'open-shift':'close-shift','',state.shiftClosed?'Buka shift baru':'Tutup shift')}</aside></div>`;
}
const moneyFields = new Set(['amount','price','salary','budget','spent','debit','credit','base','paid']);
function detailedEntry(state,config,id){
  const select=(name,label,rows)=>`<label class="demo-field"><span>${label}</span><select name="${name}">${rows.map(([value,text])=>`<option value="${esc(value)}">${esc(text)}</option>`).join('')}</select></label>`;
  const amount=(name,label)=>`<label class="demo-field"><span>${label}</span><input type="number" name="${name}" min="1" max="1000000000000" step="1" required></label>`;
  let fields='',action='',title='',note='';
  if(['sales','cash-bank','accounting','customer-portal'].includes(id)){
    const unpaid=state.invoices.filter(row=>row.paid<row.amount);if(!unpaid.length)return '';
    fields=select('id','Tagihan',unpaid.map(row=>[row.id,row.name+' / sisa '+rupiah(row.amount-row.paid)]))+amount('amount','Nilai pembayaran');action='payment';title='Catat pembayaran penuh atau sebagian';note='Kas dan jurnal diperbarui. Nilai tidak boleh melebihi sisa tagihan.';
  }else if(id==='procurement-inventory'){
    fields=select('productId','Produk',state.inventory.map(row=>[row.id,row.name+' / utama '+row.stock+', kedua '+row.secondary]))+select('direction','Arah transfer',[['Ke gudang kedua','Utama ke gudang kedua'],['Ke gudang utama','Kedua ke gudang utama']])+amount('quantity','Jumlah unit');action='transfer-quantity';title='Transfer stok antar gudang';note='Pilih arah dan jumlah. Total stok kedua gudang tetap sama.';
  }else if(id==='projects'){
    fields=select('id','Proyek',state.projects.map(row=>[row.id,row.name]))+amount('hours','Jam kerja');action='project-time';title='Timesheet proyek';note='Jam kerja menambah catatan proyek tanpa mengubah nilai anggaran atau status pembayaran.';
  }else if(id==='sector'&&config.scenario==='agribusiness'){
    fields=select('id','Blok lahan',state.sector.map(row=>[row.id,row.name+' / '+row.detail]))+amount('quantity','Panen (kg)');action='harvest';title='Catat hasil panen';note='Masukkan jumlah aktual untuk blok yang dipilih. Total panen diperbarui.';
  }
  if(!action)return '';
  return `<details class="demo-transaction-entry"><summary>${title}</summary><p>${note}</p><form data-demo-form="${action}" class="demo-entry-form">${fields}<button type="submit" class="button primary" ${state.role==='Pembaca'?'disabled':''}>Simpan catatan</button></form></details>`;
}

function workspaceMetrics(state,config){
  const m=totals(state),id=state.selectedModule;
  const result=id==='crm'?[
    ['Lead aktif',state.leads.filter(r=>r.status!=='Menang').length,'Dari pipeline saat ini'],['Nilai pipeline',rupiah(state.leads.filter(r=>r.status!=='Menang').reduce((sum,r)=>sum+r.amount,0)),'Peluang yang belum menang'],['Proposal',state.leads.filter(r=>r.status==='Proposal').length,'Siap ditindaklanjuti'],['Menang',state.leads.filter(r=>r.status==='Menang').length,'Tahap penawaran selesai'],
  ]:id==='projects'?[
    ['Proyek aktif',state.projects.filter(r=>r.progress<100).length,'Progres belum 100%'],['Jam tercatat',state.projects.reduce((sum,r)=>sum+r.hours,0),'Timesheet seluruh proyek'],['Anggaran proyek',rupiah(state.projects.reduce((sum,r)=>sum+r.budget,0)),'Nilai acuan proyek'],['Proyek selesai',state.projects.filter(r=>r.progress===100).length,'Siap periksa hasil'],
  ]:id==='sector'?[
    [config.scenario==='healthcare'?'Pasien dalam antrean':config.scenario==='education'?'Siswa terdaftar':config.scenario==='agribusiness'?'Blok budidaya':'Unit properti',state.sector.length,'Data fiktif sesuai sektor'],['Nilai tercatat',rupiah(state.sector.reduce((sum,r)=>sum+r.amount,0)),'Dari daftar saat ini'],[config.scenario==='agribusiness'?'Panen (kg)':'Perlu diproses',config.scenario==='agribusiness'?state.sector.reduce((sum,r)=>sum+(r.yield||0),0):state.sector.filter(r=>!['Lunas','Selesai','Dibooking'].includes(r.status)).length,'Diperbarui dari tindakan'],['Kas tercatat',rupiah(m.cash),'Dari transaksi lokal'],
  ]:config.id==='erp-pilot'||config.id==='erp-zero'?[
    ['Kas tercatat',rupiah(m.cash),'Catatan kas sederhana'],['Tagihan tersisa',rupiah(m.receivable),'Nilai belum dibayar'],['Proyek aktif',state.projects.filter(r=>r.progress<100).length,'Tugas dan milestone'],['Lead aktif',m.leads,'Peluang yang belum menang'],
  ]:[['Kas tercatat',rupiah(m.cash),'Dari transaksi yang dicatat'],['Piutang',rupiah(m.receivable),'Sisa tagihan pelanggan'],['Unit stok',m.stock,config.modules.includes('procurement-inventory')?'Stok utama + gudang kedua':'Stok contoh saat ini'],['Perlu ditindaklanjuti',m.leads+m.tasks,'Lead + proyek aktif']];
  return `<div class="demo-metrics">${result.map(([label,value,note],i)=>`<div ${i===0?'class="hero-metric"':''}><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('')}</div>`;
}
export function tableRows(state,config,spec,query='') {
  return state[spec.collection].filter(row=>Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase()));
}
export function renderTable(state,config,id,query='') {
  const spec=specFor(config,id,state.reportFilter), rows=tableRows(state,config,spec,query), readonly=state.role==='Pembaca';
  return `<table class="demo-table"><caption class="sr-only">${esc(spec.title)} — data contoh</caption><thead><tr>${spec.columns.map(([,label])=>`<th scope="col">${esc(label)}</th>`).join('')}<th scope="col">Tindakan</th></tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${spec.columns.map(([field])=>`<td class="${moneyFields.has(field)?'number':''}">${field==='status'?`<span class="demo-status-dot">${esc(row[field])}</span>`:moneyFields.has(field)?rupiah(row[field]):esc(row[field]??'—')}</td>`).join('')}<td><div class="row-actions">${rowActions(id==='analytics'&&spec.collection!=='invoices'?'report':id,row,config,readonly)||'<span class="demo-fine">Dicatat</span>'}</div></td></tr>`).join(''):`<tr><td colspan="${spec.columns.length+1}"><div class="table-empty">${query?'Tidak ada data yang cocok. Ubah pencarian.':'Belum ada data. Tambahkan contoh pertama.'}</div></td></tr>`}</tbody></table>`;
}
export function renderWorkspace(state,config) {
  const id=state.selectedModule,spec=specFor(config,id,state.reportFilter), metrics=totals(state);
  return `<div class="erp-page-heading"><div><p class="demo-fine">Workspace contoh / ${esc(config.focus)}</p><h1>${esc(id==='analytics'?'Dashboard & laporan':spec.title)}</h1></div><label class="demo-role">Role simulasi<select data-demo-role>${['Admin','Operator','Pembaca'].map(role=>`<option ${role===state.role?'selected':''}>${role}</option>`).join('')}</select></label></div><ol class="demo-flow">${config.flow.map((step,i)=>`<li><span>${i+1}</span>${esc(step)}</li>`).join('')}</ol>${workspaceMetrics(state,config)}<p class="demo-module-note">${esc(spec.note)}</p>${['pos','ecommerce'].includes(id)?renderCart(state,config):''}${id==='analytics'?`<label class="demo-report-selector">Laporan contoh<select data-demo-report>${reportsFor(config).map(report=>`<option value="${report.id}" ${report.id===spec.id?'selected':''}>${esc(report.title)}</option>`).join('')}</select></label>`:''}${id!=='analytics'&&spec.fields.length?`<details class="demo-entry" open><summary>Tambah data contoh</summary><form data-demo-form="${spec.action}" class="demo-entry-form">${spec.fields.map(field=>fieldHtml(field,state)).join('')}<button class="button primary" type="submit" ${state.role==='Pembaca'?'disabled':''}>${esc(spec.submit)}</button></form></details>`:''}${config.scenario==='food'&&id==='pos'?`<section class="kitchen"><h2>Antrean dapur</h2>${state.kitchen.length?state.kitchen.map(row=>`<div><b>${esc(row.name)}</b><span>${esc(row.detail)} — ${esc(row.status)}</span>${actionButton('cook',row.id,'Lanjut proses',row.status==='Siap'||state.role==='Pembaca')}</div>`).join(''):'<p>Checkout meja untuk menambahkan order dapur.</p>'}</section>`:''}${detailedEntry(state,config,id)}<section class="demo-data"><div class="demo-data-toolbar"><h2>${esc(spec.title)}</h2><div><label class="demo-search">${icon('search',18)}<input type="search" data-demo-search placeholder="Cari data..." aria-label="Cari data contoh"></label><button class="demo-action" data-export>Ekspor CSV</button></div></div><div class="demo-table-scroll" data-demo-table tabindex="0" role="region" aria-label="Tabel ${esc(spec.title)}">${renderTable(state,config,id)}</div></section><details class="demo-log"><summary>Log simulasi (${state.logs.length})</summary>${state.logs.length?`<ol>${state.logs.slice(0,10).map(row=>`<li><b>${esc(row.name)}</b> ${esc(row.detail)}</li>`).join('')}</ol>`:'<p>Belum ada perubahan data.</p>'}</details>`;
}
