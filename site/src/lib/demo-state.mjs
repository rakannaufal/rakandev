import { enrichDemoState } from '../data/demo-enrichment.mjs';
export const VERSION = 1;
export const today = '2026-10-13';
export function migrateDemoNames(value){
  if(typeof value==='string')return value.replace(/\bnara\b/gi,name=>name==='NARA'?'LUMA':name==='Nara'?'Luma':'luma');
  if(Array.isArray(value))return value.map(migrateDemoNames);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,migrateDemoNames(item)]));
  return value;
}
export const moduleSpecs = {
  accounting: { title: 'Jurnal & akuntansi', collection: 'journal', columns: [['name','Transaksi'],['debit','Debit'],['credit','Kredit'],['status','Status']], fields: [['name','Keterangan'],['amount','Nilai transaksi','number']], action: 'journal', submit: 'Catat jurnal berimbang', note: 'Jurnal contoh memakai akun penjualan, kas, dan piutang. Bukan penetapan kebijakan akuntansi.' },
  'hr-payroll': { title: 'Tim & penggajian', collection: 'employees', columns: [['name','Karyawan contoh'],['salary','Gaji tetap'],['overtime','Jam lembur contoh'],['status','Status']], fields: [['name','Nama karyawan contoh'],['salary','Gaji tetap','number'],['overtime','Jam lembur contoh','number']], action: 'employee', submit: 'Tambah karyawan', note: 'Slip contoh: gaji tetap + jam lembur x Rp25.000. PPh/BPJS dan rumus produksi perlu scope serta persetujuan klien.' },
  sales: { title: 'Penjualan', collection: 'orders', columns: [['name','Pelanggan contoh'],['product','Produk'],['quantity','Jumlah'],['amount','Nilai'],['status','Status']], fields: [['name','Nama pelanggan contoh'],['productId','Produk','product'],['quantity','Jumlah unit','number']], action: 'order', submit: 'Buat order', note: 'Stok berkurang saat pengiriman. Retur satu unit hanya tersedia untuk order yang sudah dikirim.' },
  'procurement-inventory': { title: 'Pembelian & stok', collection: 'inventory', columns: [['name','Produk'],['stock','Gudang utama'],['secondary','Gudang kedua'],['price','Harga contoh']], fields: [['productId','Produk','product'],['quantity','Jumlah diterima','number']], action: 'receive', submit: 'Terima pembelian', note: 'Penerimaan menambah stok; transfer memindahkan stok antargudang tanpa mengubah jumlah total.' },
  manufacturing: { title: 'Produksi & BOM', collection: 'production', columns: [['name','Work order'],['quantity','Hasil'],['material','Bahan dipakai'],['status','Status']], fields: [['name','Nama work order'],['quantity','Jumlah produksi','number']], action: 'produce', submit: 'Jalankan produksi', note: 'BOM contoh: satu produk jadi menggunakan dua unit bahan kedua. Stok bahan dan hasil berubah bersama.' },
  crm: { title: 'CRM & pipeline', collection: 'leads', columns: [['name','Prospek contoh'],['company','Usaha'],['amount','Nilai peluang'],['status','Tahap']], fields: [['name','Nama prospek contoh'],['company','Usaha contoh'],['amount','Nilai peluang','number']], action: 'lead', submit: 'Tambah lead', note: 'Tahap: Baru, Dihubungi, Proposal, Menang. Mengubah tahap di demo tidak mengirim pesan.' },
  projects: { title: 'Proyek & milestone', collection: 'projects', columns: [['name','Proyek/tugas'],['owner','Penanggung jawab'],['progress','Progres (%)'],['budget','Anggaran'],['status','Status']], fields: [['name','Nama proyek/tugas'],['owner','Penanggung jawab contoh'],['budget','Anggaran/RAB contoh','number']], action: 'project', submit: 'Tambah proyek', note: 'Catat progres dan jam kerja. Termin contoh tersedia setelah progres mencapai 100%.' },
  quality: { title: 'Inspeksi kualitas', collection: 'inspections', columns: [['name','Lot/produk'],['result','Hasil'],['status','Status']], fields: [['name','Lot / produk contoh'],['result','Hasil inspeksi','result']], action: 'inspection', submit: 'Catat inspeksi', note: 'Lulus/gagal adalah parameter contoh. NCR, CAPA, dan sertifikasi produksi membutuhkan scope khusus.' },
  maintenance: { title: 'Pemeliharaan peralatan', collection: 'maintenance', columns: [['name','Peralatan'],['schedule','Jadwal'],['status','Status']], fields: [['name','Nama peralatan'],['schedule','Jadwal','date']], action: 'maintenance', submit: 'Jadwalkan pemeliharaan', note: 'Jadwal dan penyelesaian work order contoh. Tidak terhubung ke sensor atau IoT.' },
  budget: { title: 'Anggaran & realisasi', collection: 'budgets', columns: [['name','Departemen/proyek'],['amount','Anggaran'],['spent','Realisasi'],['status','Status']], fields: [['name','Departemen / proyek'],['amount','Anggaran','number']], action: 'budget', submit: 'Buat anggaran', note: 'Catat pengeluaran contoh Rp100.000 per tindakan untuk melihat perbandingan terhadap batas anggaran.' },
  'cash-bank': { title: 'Kas & bank', collection: 'cash', columns: [['name','Keterangan'],['amount','Nominal'],['direction','Arah'],['status','Status']], fields: [['name','Keterangan'],['amount','Nominal','number'],['direction','Arah transaksi','direction']], action: 'cash', submit: 'Catat transaksi kas', note: 'Pencatatan contoh; tidak mengeksekusi transfer, mengakses bank, atau menarik mutasi nyata.' },
  tax: { title: 'Rekap pajak contoh', collection: 'taxes', columns: [['name','Dokumen'],['base','Dasar contoh'],['amount','Pajak simulasi'],['status','Status']], fields: [['name','Nama dokumen'],['base','Dasar perhitungan contoh','number']], action: 'tax', submit: 'Buat rekap simulasi', note: 'Demo menggunakan parameter fiktif 11% untuk memperlihatkan perhitungan; bukan panduan tarif atau pelaporan pajak resmi.' },
  documents: { title: 'Dokumen & versi', collection: 'documents', columns: [['name','Dokumen'],['version','Versi'],['status','Status']], fields: [['name','Nama dokumen']], action: 'document', submit: 'Simpan versi dokumen', note: 'Nama yang sama membuat versi berikutnya. File dan tanda tangan elektronik tidak diunggah di demo.' },
  approval: { title: 'Workflow & approval', collection: 'approvals', columns: [['name','Permintaan'],['amount','Nominal'],['level','Tahap'],['status','Status']], fields: [['name','Nama permintaan'],['amount','Nominal','number']], action: 'approval', submit: 'Ajukan permintaan', note: 'Dua tahap persetujuan simulasi dengan log. Menyembunyikan tombol berdasarkan role bukan keamanan server.' },
  analytics: { title: 'Dashboard & laporan', collection: 'invoices', columns: [['name','Invoice'],['amount','Nilai'],['paid','Dibayar'],['status','Status']], fields: [], note: 'Angka dihitung dari data simulasi aktif. Ekspor CSV berisi data tabel yang sedang ditampilkan.' },
  'after-sales': { title: 'Layanan pelanggan', collection: 'tickets', columns: [['name','Tiket'],['customer','Pelanggan contoh'],['status','Status']], fields: [['name','Masalah contoh'],['customer','Nama pelanggan contoh']], action: 'ticket', submit: 'Buat tiket', note: 'Alur tiket contoh; status SLA aplikasi tidak berarti layanan dukungan 24 jam.' },
  pos: { title: 'POS kasir', collection: 'receipts', columns: [['name','Struk'],['amount','Total'],['table','Meja/counter'],['status','Status']], fields: [], note: 'Keranjang, stok, struk, dan tutup shift berjalan dalam simulasi. Pembayaran tidak diproses.' },
  ecommerce: { title: 'Katalog & order online', collection: 'orders', columns: [['name','Order contoh'],['product','Produk'],['quantity','Jumlah'],['amount','Nilai'],['status','Status']], fields: [], note: 'Katalog, keranjang, dan order menggunakan data contoh. Gateway/kurir/marketplace tidak terhubung.' },
  'customer-portal': { title: 'Portal pelanggan', collection: 'invoices', columns: [['name','Tagihan'],['amount','Nilai'],['paid','Dibayar'],['status','Status']], fields: [], note: 'Tampilan pelanggan simulasi. Akses data produksi tetap harus diperiksa pada server.' },
  'supplier-portal': { title: 'Portal supplier', collection: 'purchases', columns: [['name','PO'],['product','Produk'],['quantity','Jumlah'],['status','Status']], fields: [], note: 'Supplier dapat memperbarui status pengiriman PO contoh. Tidak tersambung ke ERP supplier.' },
  'employee-portal': { title: 'Portal karyawan', collection: 'leave', columns: [['name','Karyawan contoh'],['schedule','Tanggal cuti'],['status','Status']], fields: [['name','Nama karyawan contoh'],['schedule','Tanggal cuti','date']], action: 'leave', submit: 'Ajukan cuti contoh', note: 'Contoh pengajuan cuti. Tanpa biometrik, geofencing, atau absensi nyata.' },
  fleet: { title: 'Armada & penugasan', collection: 'fleet', columns: [['name','Kendaraan'],['driver','Sopir contoh'],['route','Rute'],['status','Status']], fields: [['name','Kendaraan contoh'],['driver','Sopir contoh'],['route','Rute pengiriman']], action: 'fleet', submit: 'Buat penugasan', note: 'Manifest dan status perjalanan contoh. GPS, POD, serta optimasi rute membutuhkan integrasi tersendiri.' },
  contracts: { title: 'Kontrak & vendor', collection: 'contracts', columns: [['name','Vendor/kontrak'],['amount','Tagihan periodik'],['schedule','Masa berlaku'],['status','Status']], fields: [['name','Nama vendor/kontrak'],['amount','Tagihan contoh','number'],['schedule','Masa berlaku','date']], action: 'contract', submit: 'Simpan kontrak', note: 'Tagihan periodik dibuat maksimal sekali per periode contoh; tidak menagih pembayaran otomatis.' },
  compliance: { title: 'Kontrol & risiko', collection: 'risks', columns: [['name','Kontrol/risiko'],['owner','Penanggung jawab'],['status','Status']], fields: [['name','Kontrol/risiko contoh'],['owner','Penanggung jawab contoh']], action: 'risk', submit: 'Catat kontrol', note: 'Daftar kontrol dan log demonstrasi, bukan audit bersertifikat atau jaminan kepatuhan hukum.' },
  administration: { title: 'Pengaturan & role', collection: 'users', columns: [['name','Pengguna contoh'],['role','Role'],['status','Status']], fields: [['name','Nama pengguna contoh'],['role','Role','role']], action: 'user', submit: 'Tambah pengguna contoh', note: 'Role adalah simulasi antarmuka. Data hanya di browser; tidak ada login/2FA produksi di demo ini.' },
  integrations: { title: 'Integrasi & idempotensi', collection: 'integrationEvents', columns: [['name','Event ID'],['quantity','Jumlah'],['status','Status']], fields: [['name','Event ID contoh'],['quantity','Jumlah penerimaan','number']], action: 'integration', submit: 'Proses event simulasi', note: 'Event ID yang sama tidak menambah stok dua kali. Tidak memanggil API eksternal.' },
};

export function seedState(config) {
  const name = config.items || ['Mug Luma', 'Bahan kemasan', 'Tote Harian'];
  const prices = config.prices || [85000, 25000, 125000];
  const state = { version: VERSION, id: config.id, sequence: 100, role: 'Admin', selectedModule: config.module, cart: {}, shiftClosed: false, logs: [], reportFilter: 'all',
    inventory: name.map((item, i) => ({ id: 'item-' + i, name: item, price: prices[i], stock: i === 0 ? 100 : i === 1 ? 200 : 60, secondary: i === 0 ? 20 : 10 })),
    leads: [{ id: 'lead-1', name: 'Luma (contoh)', company: 'Luma Interior', amount: 1500000, status: 'Baru' }, { id: 'lead-2', name: 'Dira (contoh)', company: 'Dira Studio', amount: 850000, status: 'Proposal' }],
    projects: [{ id: 'project-1', name: config.scenario === 'construction' ? 'Renovasi ruang Luma' : 'Identitas Luma', owner: 'Dira (contoh)', budget: 2500000, progress: 25, hours: 2, status: 'Berjalan' }],
    orders: [{ id: 'order-1', name: 'Pelanggan Luma (contoh)', productId: 'item-0', product: name[0], quantity: 10, amount: prices[0] * 10, returned: 0, status: 'Draf' }],
    invoices: [{ id: 'invoice-1', name: 'INV-RD-001', amount: 1500000, paid: 0, status: 'Belum dibayar' }, { id: 'invoice-2', name: 'INV-RD-002', amount: 850000, paid: 850000, status: 'Lunas' }],
    cash: [{ id: 'cash-1', name: 'Saldo awal contoh', amount: 2000000, direction: 'Masuk', status: 'Dicatat' }],
    journal: [{ id: 'journal-1', name: 'Saldo awal kas', debit: 2000000, credit: 2000000, status: 'Berimbang' }],
    employees: [{ id: 'employee-1', name: 'Dira (contoh)', salary: 4500000, overtime: 4, status: 'Aktif' }],
    production: [], inspections: [{ id: 'qc-1', name: 'Lot RD-01', result: 'Lulus', status: 'Dicatat' }],
    maintenance: [{ id: 'maintenance-1', name: 'Peralatan RD-01', schedule: '2026-10-15', status: 'Dijadwalkan' }],
    budgets: [{ id: 'budget-1', name: 'Operasional', amount: 2500000, spent: 300000, status: 'Dalam anggaran' }],
    taxes: [], documents: [{ id: 'document-1', name: 'Panduan operasional contoh', version: 1, status: 'Draf' }],
    approvals: [{ id: 'approval-1', name: 'Pembelian bahan contoh', amount: 500000, level: 0, status: 'Menunggu' }],
    tickets: [{ id: 'ticket-1', name: 'Periksa order RD-01', customer: 'Luma (contoh)', status: 'Terbuka' }],
    receipts: [], purchases: [{ id: 'purchase-1', name: 'PO-RD-001', productId: 'item-1', product: name[1], quantity: 20, status: 'Menunggu supplier' }],
    leave: [{ id: 'leave-1', name: 'Dira (contoh)', schedule: '2026-10-20', status: 'Menunggu' }],
    fleet: [{ id: 'fleet-1', name: 'RD Van 01', driver: 'Luma (contoh)', route: 'Gudang - Bandung', status: 'Dijadwalkan' }],
    contracts: [{ id: 'contract-1', name: 'Vendor kemasan RD', amount: 500000, schedule: '2026-12-31', status: 'Aktif', billed: false }],
    risks: [{ id: 'risk-1', name: 'Periksa pemisahan akses', owner: 'Dira (contoh)', status: 'Perlu ditinjau' }],
    users: [{ id: 'user-1', name: 'Admin RD (contoh)', role: 'Admin', status: 'Aktif' }], integrationEvents: [],
    sector: config.scenario === 'healthcare' ? [{ id: 'sector-1', name: 'Pasien Luma (fiktif)', detail: 'Dokter Dira (fiktif)', amount: 150000, status: 'Menunggu' }] : config.scenario === 'education' ? [{ id: 'sector-1', name: 'Siswa Luma (fiktif)', detail: 'Kelas desain', amount: 450000, status: 'Belum dibayar' }] : config.scenario === 'agribusiness' ? [{ id: 'sector-1', name: 'Blok A', detail: 'Kopi', amount: 1000000, yield: 0, status: 'Budidaya' }] : config.scenario === 'property' ? [{ id: 'sector-1', name: 'Unit Luma 01', detail: 'Tipe 45', amount: 650000000, status: 'Tersedia' }] : [], kitchen: [] };
  if (config.scenario === 'property') state.sector.forEach(row => { row.paid = 0; row.progress = 0; });
  return enrichDemoState(state,config);
}

export function validState(state, config) {
  if (!state || state.version !== VERSION || state.id !== config.id || !Number.isSafeInteger(state.sequence) || state.sequence < 100 || !['Admin','Operator','Pembaca'].includes(state.role) || typeof state.cart !== 'object' || state.cart === null) return false;
  const seed = seedState(config);
  const numberFields = new Set(['price','stock','secondary','amount','quantity','returned','paid','salary','overtime','slip','progress','hours','budget','debit','credit','material','spent','base','version','level','yield']);
  for (const [key, value] of Object.entries(seed)) {
    if (!Array.isArray(value)) continue;
    if (!Array.isArray(state[key]) || state[key].length > 1000 || state[key].some(row => !row || typeof row !== 'object' || typeof row.id !== 'string')) return false;
    for (const row of state[key]) for (const [field, cell] of Object.entries(row)) {
      if (numberFields.has(field) && (typeof cell !== 'number' || !Number.isFinite(cell) || cell < 0)) return false;
      if (cell === null || typeof cell === 'object') return false;
      if (typeof cell === 'string' && cell.length > 3000) return false;
    }
  }
  for (const spec of Object.values(moduleSpecs)) {
    if (state[spec.collection].some(row => spec.columns.some(([field]) => !Object.hasOwn(row, field)))) return false;
  }
  if (state.invoices.some(row => row.paid > row.amount) || state.orders.some(row => !state.inventory.some(item => item.id === row.productId))) return false;
  if (!config.modules.includes(state.selectedModule) || typeof state.shiftClosed !== 'boolean' || Array.isArray(state.cart)) return false;
  if (!Object.entries(state.cart).every(([id, quantity]) => state.inventory.some(row => row.id === id && quantity <= row.stock) && Number.isSafeInteger(quantity) && quantity > 0)) return false;
  return state.inventory.length === seed.inventory.length && state.inventory.every((row, index) => row.id === seed.inventory[index].id && Number.isSafeInteger(row.stock) && Number.isSafeInteger(row.secondary) && Number.isFinite(row.price));
}

const positive = (value, label = 'Nilai', integer = false) => { const n = Number(value); if (!Number.isFinite(n) || n <= 0 || n > 1e12 || integer && !Number.isSafeInteger(n)) throw new Error(label + ' harus lebih dari nol' + (integer ? ' dan berupa bilangan bulat.' : '.')); return n; };
const text = (value, label = 'Nama') => { const clean = String(value || '').trim(); if (!clean || clean.length > 160) throw new Error(label + ' wajib diisi, maksimal 160 karakter.'); return clean; };
const enumValue = (value, allowed) => { if (!allowed.includes(value)) throw new Error('Pilihan tidak tersedia.'); return value; };
const date = value => { if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value)) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error('Tanggal tidak valid.'); return value; };
export function executeDemo(state, action, config) {
  const s = structuredClone(state);
  const data = action.data || {};
  const nextId = prefix => prefix + '-' + ++s.sequence;
  const find = (collection, id) => { const row = s[collection].find(item => item.id === id); if (!row) throw new Error('Data contoh tidak ditemukan.'); return row; };
  const add = (collection, row) => { if (s[collection].length >= 200) throw new Error('Batas 200 data contoh tercapai. Reset demo untuk mulai lagi.'); row.id = nextId(collection); s[collection].push(row); return row; };
  const invoice = (name, amount) => add('invoices', { name, amount, paid: 0, status: 'Belum dibayar' });
  let message = 'Data contoh diperbarui.';
  if (s.role === 'Pembaca' && !['role','cart-add','cart-remove','module'].includes(action.type)) throw new Error('Role Pembaca hanya melihat data dalam simulasi.');
  switch (action.type) {
    case 'module': s.selectedModule = enumValue(data.module, config.modules); break;
    case 'role': s.role = enumValue(data.role, ['Admin','Operator','Pembaca']); message = 'Role simulasi: ' + s.role; break;
    case 'lead': add('leads', { name: text(data.name), company: text(data.company, 'Usaha'), amount: positive(data.amount), status: 'Baru' }); break;
    case 'advance-lead': { const row = find('leads', data.id), stages = ['Baru','Dihubungi','Proposal','Menang']; if (row.status === 'Menang') throw new Error('Lead sudah menang.'); row.status = stages[stages.indexOf(row.status) + 1]; break; }
    case 'project': add('projects', { name: text(data.name), owner: text(data.owner, 'Penanggung jawab'), budget: positive(data.budget), progress: 0, hours: 0, status: 'Berjalan' }); break;
    case 'progress': { const row = find('projects', data.id); if (row.progress >= 100) throw new Error('Proyek sudah selesai.'); row.progress = Math.min(100, row.progress + 25); row.hours += 2; row.status = row.progress === 100 ? 'Selesai' : 'Berjalan'; break; }
    case 'project-invoice': { const row = find('projects', data.id); if (row.progress < 100 || row.invoiced) throw new Error('Termin hanya bisa dibuat sekali setelah proyek selesai.'); invoice('Termin ' + row.name, row.budget); row.invoiced = true; break; }
    case 'order': { const item = find('inventory', data.productId), qty = positive(data.quantity, 'Jumlah', true); add('orders', { name: text(data.name), productId: item.id, product: item.name, quantity: qty, amount: qty * item.price, returned: 0, status: 'Draf' }); break; }
    case 'ship': { const row = find('orders', data.id); if (row.status !== 'Draf') throw new Error('Order sudah diproses.'); const item = find('inventory', row.productId); if (item.stock < row.quantity) throw new Error('Stok tidak cukup untuk pengiriman.'); item.stock -= row.quantity; row.status = 'Dikirim'; invoice('INV ' + row.id, row.amount); break; }
    case 'return': { const row = find('orders', data.id); if (row.status !== 'Dikirim' || row.returned >= row.quantity) throw new Error('Tidak ada unit yang dapat diretur.'); const inv = s.invoices.find(item => item.name === 'INV ' + row.id); if (!inv || inv.paid > 0) throw new Error('Retur demo hanya untuk invoice belum dibayar. Refund/nota kredit memerlukan scope terpisah.'); const item = find('inventory', row.productId); item.stock++; row.returned++; inv.amount -= item.price; if (inv.amount === 0) inv.status = 'Ditutup setelah retur'; break; }
    case 'receive': { const item = find('inventory', data.productId), qty = positive(data.quantity, 'Jumlah', true); item.stock += qty; add('purchases', { name: 'PO-RD-' + (s.sequence + 1), productId: item.id, product: item.name, quantity: qty, status: 'Diterima' }); break; }
    case 'transfer': { const item = find('inventory', data.id); if (item.stock < 5) throw new Error('Transfer memerlukan minimal lima unit di gudang utama.'); item.stock -= 5; item.secondary += 5; message = 'Lima unit dipindahkan ke gudang kedua.'; break; }
    case 'produce': { const qty = positive(data.quantity, 'Jumlah', true), material = s.inventory[1], output = s.inventory[0]; if (material.stock < qty * 2) throw new Error('Bahan tidak cukup. BOM contoh memerlukan dua unit bahan per hasil.'); material.stock -= qty * 2; output.stock += qty; add('production', { name: text(data.name), quantity: qty, material: qty * 2, status: 'Selesai' }); break; }
    case 'journal': { const amount = positive(data.amount); add('journal', { name: text(data.name), debit: amount, credit: amount, status: 'Berimbang' }); break; }
    case 'pay': { const inv = find('invoices', data.id); if (inv.paid >= inv.amount) throw new Error('Invoice sudah lunas.'); const amount = inv.amount - inv.paid; inv.paid = inv.amount; inv.status = 'Lunas'; add('cash', { name: 'Bayar ' + inv.name, amount, direction: 'Masuk', status: 'Dicatat' }); add('journal', { name: 'Pelunasan ' + inv.name, debit: amount, credit: amount, status: 'Berimbang' }); break; }
    case 'payment': {
      const inv=find('invoices',data.id),amount=positive(data.amount,'Nilai pembayaran',true);
      if(amount>inv.amount-inv.paid)throw new Error('Pembayaran melebihi sisa tagihan.');
      inv.paid+=amount;inv.status=inv.paid===inv.amount?'Lunas':'Dibayar sebagian';
      add('cash',{name:'Pembayaran '+inv.name,amount,direction:'Masuk',status:'Dicatat'});
      add('journal',{name:'Pembayaran '+inv.name,debit:amount,credit:amount,status:'Berimbang'});
      message='Pembayaran dicatat. Sisa tagihan Rp'+(inv.amount-inv.paid).toLocaleString('id-ID');break;
    }
    case 'transfer-quantity': {
      const item=find('inventory',data.productId),quantity=positive(data.quantity,'Jumlah',true);
      const direction=enumValue(data.direction,['Ke gudang kedua','Ke gudang utama']);
      if(direction==='Ke gudang kedua'){if(quantity>item.stock)throw new Error('Stok gudang utama tidak cukup.');item.stock-=quantity;item.secondary+=quantity;}
      else{if(quantity>item.secondary)throw new Error('Stok gudang kedua tidak cukup.');item.secondary-=quantity;item.stock+=quantity;}
      message=quantity+' unit dipindahkan. Total stok tetap.';break;
    }
    case 'project-time': {
      const row=find('projects',data.id),hours=positive(data.hours,'Jam kerja');row.hours+=hours;
      message=hours+' jam dicatat untuk '+row.name;break;
    }
    case 'harvest': {
      if(config.scenario!=='agribusiness')throw new Error('Pencatatan ini untuk budidaya.');
      const row=find('sector',data.id),quantity=positive(data.quantity,'Hasil panen');row.yield+=quantity;row.status='Panen tercatat';
      message='Panen '+quantity+' kg dicatat untuk '+row.name;break;
    }
    case 'employee': { const overtime = Number(data.overtime || 0); if (!Number.isFinite(overtime) || overtime < 0 || overtime > 160) throw new Error('Jam lembur harus 0-160.'); add('employees', { name: text(data.name), salary: positive(data.salary), overtime, status: 'Aktif' }); break; }
    case 'payroll': { const row = find('employees', data.id); if (row.payrollDone) throw new Error('Slip periode contoh ini sudah dibuat.'); row.payrollDone = true; row.slip = row.salary + row.overtime * 25000; message = 'Slip contoh ' + row.name + ': Rp' + row.slip.toLocaleString('id-ID'); break; }
    case 'inspection': add('inspections', { name: text(data.name), result: enumValue(data.result, ['Lulus','Gagal']), status: 'Dicatat' }); break;
    case 'maintenance': add('maintenance', { name: text(data.name), schedule: date(data.schedule), status: 'Dijadwalkan' }); break;
    case 'maintenance-done': find('maintenance', data.id).status = 'Selesai'; break;
    case 'budget': add('budgets', { name: text(data.name), amount: positive(data.amount), spent: 0, status: 'Dalam anggaran' }); break;
    case 'expense': { const row = find('budgets', data.id); row.spent += 100000; row.status = row.spent > row.amount ? 'Melebihi anggaran' : 'Dalam anggaran'; break; }
    case 'cash': add('cash', { name: text(data.name), amount: positive(data.amount), direction: enumValue(data.direction, ['Masuk','Keluar']), status: 'Dicatat' }); break;
    case 'tax': { const base = positive(data.base); add('taxes', { name: text(data.name), base, amount: Math.round(base * .11), status: 'Simulasi' }); break; }
    case 'document': { const name = text(data.name), old = s.documents.find(row => row.name.toLowerCase() === name.toLowerCase()); if (old) old.version++; else add('documents', { name, version: 1, status: 'Draf' }); break; }
    case 'approval': add('approvals', { name: text(data.name), amount: positive(data.amount), level: 0, status: 'Menunggu' }); break;
    case 'approve': { const row = find('approvals', data.id); if (row.level >= 2) throw new Error('Permintaan sudah disetujui.'); if (row.level === 1 && s.role !== 'Admin') throw new Error('Tahap kedua memerlukan role Admin simulasi.'); row.level++; row.status = row.level === 2 ? 'Disetujui' : 'Menunggu Admin'; break; }
    case 'ticket': add('tickets', { name: text(data.name), customer: text(data.customer), status: 'Terbuka' }); break;
    case 'resolve': find('tickets', data.id).status = 'Selesai'; break;
    case 'supplier-ship': { const row = find('purchases', data.id); if (row.status !== 'Menunggu supplier') throw new Error('PO sudah diproses.'); row.status = 'Dalam pengiriman'; break; }
    case 'supplier-receive': { const row = find('purchases', data.id); if (row.status !== 'Dalam pengiriman') throw new Error('PO belum dikirim atau sudah diterima.'); row.status = 'Diterima'; find('inventory', row.productId).stock += row.quantity; break; }
    case 'leave': add('leave', { name: text(data.name), schedule: date(data.schedule), status: 'Menunggu' }); break;
    case 'leave-approve': find('leave', data.id).status = 'Disetujui'; break;
    case 'fleet': add('fleet', { name: text(data.name), driver: text(data.driver), route: text(data.route), status: 'Dijadwalkan' }); break;
    case 'dispatch': { const row = find('fleet', data.id); if (row.status !== 'Dijadwalkan') throw new Error('Penugasan sudah berjalan.'); row.status = 'Dalam perjalanan'; break; }
    case 'arrive': { const row = find('fleet', data.id); if (row.status !== 'Dalam perjalanan') throw new Error('Penugasan belum dikirim atau sudah sampai.'); row.status = 'Sampai'; break; }
    case 'contract': add('contracts', { name: text(data.name), amount: positive(data.amount), schedule: date(data.schedule), status: 'Aktif', billed: false }); break;
    case 'bill-contract': { const row = find('contracts', data.id); if (row.billed) throw new Error('Tagihan periode contoh sudah dibuat.'); invoice('Kontrak ' + row.name, row.amount); row.billed = true; break; }
    case 'risk': add('risks', { name: text(data.name), owner: text(data.owner), status: 'Perlu ditinjau' }); break;
    case 'risk-done': find('risks', data.id).status = 'Ditinjau'; break;
    case 'user': add('users', { name: text(data.name), role: enumValue(data.role, ['Admin','Operator','Pembaca']), status: 'Aktif' }); break;
    case 'integration': { const name = text(data.name); if (s.integrationEvents.some(row => row.name === name)) { message = 'Event duplikat dikenali. Stok tidak diubah.'; break; } const qty = positive(data.quantity, 'Jumlah', true); s.inventory[0].stock += qty; add('integrationEvents', { name, quantity: qty, status: 'Diproses satu kali' }); break; }
    case 'cart-add': { if (s.shiftClosed) throw new Error('Buka shift baru sebelum membuat transaksi.'); const item = find('inventory', data.id), qty = (s.cart[item.id] || 0) + 1; if (qty > item.stock) throw new Error('Jumlah keranjang melebihi stok.'); s.cart[item.id] = qty; break; }
    case 'cart-remove': { const item = find('inventory', data.id); if (s.cart[item.id] > 1) s.cart[item.id]--; else delete s.cart[item.id]; break; }
    case 'checkout': { const rows = Object.entries(s.cart).map(([id, quantity]) => ({ item: find('inventory', id), quantity })); if (!rows.length) throw new Error('Keranjang masih kosong.'); if (s.shiftClosed) throw new Error('Shift sudah ditutup.'); const name = text(data.name || 'Pelanggan contoh'), table = text(data.table || 'Counter 1'); for (const row of rows) if (row.item.stock < row.quantity) throw new Error('Stok tidak cukup.'); let total = 0; for (const row of rows) { row.item.stock -= row.quantity; total += row.item.price * row.quantity; add('orders', { name, productId: row.item.id, product: row.item.name, quantity: row.quantity, amount: row.item.price * row.quantity, returned: 0, status: 'Dikirim' }); } add('receipts', { name: 'STR-RD-' + (s.sequence + 1), amount: total, table, detail: rows.map(row=>row.quantity+' x '+row.item.name+' @ Rp'+row.item.price.toLocaleString('id-ID')).join('; '), status: 'Pembayaran simulasi' }); add('cash', { name: 'Penjualan simulasi', amount: total, direction: 'Masuk', status: 'Dicatat' }); if (config.scenario === 'food') add('kitchen', { name: table, detail: rows.map(row => row.quantity + ' ' + row.item.name).join(', '), status: 'Antre' }); s.cart = {}; message = 'Transaksi simulasi selesai. Stok dan struk diperbarui; tidak ada pembayaran nyata.'; break; }
    case 'close-shift': if (Object.keys(s.cart).length) throw new Error('Selesaikan atau kosongkan keranjang sebelum menutup shift.'); s.shiftClosed = true; message = 'Shift contoh ditutup. Rekap struk tetap tersedia.'; break;
    case 'open-shift': s.shiftClosed = false; message = 'Shift baru dibuka untuk simulasi.'; break;
    case 'cook': { const row = find('kitchen', data.id); row.status = row.status === 'Antre' ? 'Dimasak' : 'Siap'; break; }
    case 'sector-add': { const amount = positive(data.amount); add('sector', { name: text(data.name), detail: text(data.detail), amount, yield: 0, paid: 0, progress: 0, status: config.scenario === 'healthcare' ? 'Menunggu' : config.scenario === 'education' ? 'Belum dibayar' : config.scenario === 'agribusiness' ? 'Budidaya' : 'Tersedia' }); break; }
    case 'sector-expense': { if (config.scenario !== 'agribusiness') throw new Error('Biaya ini khusus demo budidaya.'); const row = find('sector', data.id); row.amount += 100000; add('cash', { name: 'Biaya ' + row.name, amount: 100000, direction: 'Keluar', status: 'Dicatat' }); break; }
    case 'sector-progress': { if (config.scenario !== 'property') throw new Error('Progres ini khusus demo properti.'); const row = find('sector', data.id); if (row.status !== 'Dibooking' || row.progress >= 100) throw new Error('Booking diperlukan atau progres sudah selesai.'); row.progress = Math.min(100, row.progress + 25); break; }
    case 'sector-payment': { if (config.scenario !== 'property') throw new Error('Cicilan ini khusus demo properti.'); const row = find('sector', data.id); if (row.status !== 'Dibooking' || row.paid >= row.amount) throw new Error('Booking diperlukan atau cicilan sudah lunas.'); const amount = Math.min(row.amount - row.paid, Math.round(row.amount * .1)); row.paid += amount; add('cash', { name: 'Cicilan ' + row.name, amount, direction: 'Masuk', status: 'Dicatat' }); message = 'Cicilan contoh dicatat. Bukan pembayaran nyata; invoice booking terpisah dari cicilan.'; break; }
    case 'sector-next': { const row = find('sector', data.id); if (config.scenario === 'healthcare') { if (row.status === 'Menunggu') row.status = 'Dilayani'; else if (row.status === 'Dilayani') { row.status = 'Selesai'; invoice('Billing ' + row.name, row.amount); } else throw new Error('Kunjungan contoh sudah selesai.'); } else if (config.scenario === 'education') { if (row.status === 'Lunas') throw new Error('Tagihan contoh sudah dibayar.'); row.status = 'Lunas'; add('cash', { name: 'SPP ' + row.name, amount: row.amount, direction: 'Masuk', status: 'Dicatat' }); } else if (config.scenario === 'agribusiness') { row.yield += 100; row.status = 'Panen tercatat'; } else if (config.scenario === 'property') { if (row.status !== 'Tersedia') throw new Error('Unit sudah dibooking dalam simulasi.'); row.status = 'Dibooking'; invoice('Booking ' + row.name, Math.round(row.amount * .05)); } break; }
    default: throw new Error('Tindakan demo tidak tersedia.');
  }
  if (!['module','cart-add','cart-remove'].includes(action.type)) s.logs.unshift({ id: nextId('log'), name: action.type, detail: message, date: today });
  s.logs = s.logs.slice(0, 100);
  return { state: s, message };
}

export function totals(state) {
  return { invoiceTotal: state.invoices.reduce((n, row) => n + row.amount, 0), receivable: state.invoices.reduce((n, row) => n + row.amount - row.paid, 0), cash: state.cash.reduce((n, row) => n + (row.direction === 'Masuk' ? row.amount : -row.amount), 0), stock: state.inventory.reduce((n, row) => n + row.stock + row.secondary, 0), leads: state.leads.filter(row => row.status !== 'Menang').length, tasks: state.projects.filter(row => row.status !== 'Selesai').length };
}
