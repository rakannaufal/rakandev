import { catalog } from './catalog.mjs';
import { commerceByKey } from './commerce.mjs';

export const webThemes = {
  landing: { brand: 'RD Interior', category: 'Interior & ruang tinggal', title: 'Ruang yang terasa seperti kamu.', intro: 'Interior hangat untuk hidup yang lebih nyaman. Dari sudut kecil sampai rumah pertama, setiap detail punya cerita.', tone: 'interior', image: 'interior-01', price: 'Mulai Rp300.000', sections: ['Layanan', 'Karya', 'Kontak'] },
  portfolio: { brand: 'RD Studio', category: 'Desainer independen', title: 'Ide baik, jadi karya yang berarti.', intro: 'Identitas, visual, dan cerita untuk brand yang punya sesuatu untuk disampaikan.', tone: 'studio', image: 'studio-poster', price: 'Mulai Rp300.000', sections: ['Tentang', 'Karya', 'Kontak'] },
  plus: { brand: 'RD Renovasi', category: 'Renovasi rumah', title: 'Rumah lama. Cerita baru.', intro: 'Renovasi yang dimulai dari mendengarkan. Kita susun ruang yang lebih cocok untuk keseharianmu.', tone: 'renovasi', image: 'renovasi-hasil', price: 'Rp650.000', sections: ['Layanan', 'Proses', 'Karya', 'FAQ', 'Kontak'] },
  profile: { brand: 'RD Works', category: 'Profil usaha', title: 'Membangun ruang. Merawat kepercayaan.', intro: 'Tim contoh yang mempertemukan strategi, desain, dan pelaksanaan untuk proyek yang terarah.', tone: 'works', image: 'works-project', price: 'Rp750.000', sections: [] },
  custom: { brand: 'RD Shop', category: 'Toko online custom', title: 'Benda sederhana. Hari yang lebih baik.', intro: 'Koleksi benda pilihan untuk meja, rumah, dan rutinitas kecilmu. Semua transaksi di sini adalah simulasi.', tone: 'shop', image: 'product-01', price: 'Setelah konsultasi', sections: ['Koleksi', 'Keranjang'] },
};

export const industrySettings = {
  retail: { brand: 'RD Mart', focus: 'Kasir & stok', module: 'pos', entity: 'Barang', items: ['Kopi Nusantara', 'Granola Madu', 'Teh Melati'], prices: [35000, 28000, 18000], scenario: 'retail', flow: ['Pilih barang', 'Bayar simulasi', 'Cek stok'] },
  distributor: { brand: 'RD Distribusi', focus: 'Order sampai piutang', module: 'sales', entity: 'Produk grosir', items: ['Kopi 1 kg', 'Kemasan 100 pcs', 'Sirup 1 liter'], prices: [125000, 85000, 65000], scenario: 'distributor', flow: ['Buat order', 'Kirim barang', 'Catat pembayaran'] },
  manufacturing: { brand: 'RD Manufaktur', focus: 'BOM, produksi & QC', module: 'manufacturing', entity: 'Produk', items: ['Kursi Luma', 'Kayu panel', 'Kain linen'], prices: [850000, 95000, 70000], scenario: 'manufacturing', flow: ['Buat work order', 'Pakai bahan', 'Inspeksi hasil'] },
  construction: { brand: 'RD Konstruksi', focus: 'RAB, progres & termin', module: 'projects', entity: 'Material', items: ['Panel kayu', 'Semen', 'Cat dinding'], prices: [150000, 65000, 120000], scenario: 'construction', flow: ['Susun anggaran', 'Catat progres', 'Tagihkan termin'] },
  services: { brand: 'RD Agency', focus: 'CRM, tugas & jam kerja', module: 'crm', entity: 'Layanan', items: ['Desain brand', 'Konten bulanan', 'Konsultasi'], prices: [1500000, 750000, 350000], scenario: 'services', flow: ['Tambah lead', 'Pindahkan pipeline', 'Kerjakan proyek'] },
  'food-beverage': { brand: 'RD Kopi', focus: 'Order meja & dapur', module: 'pos', entity: 'Menu', items: ['Kopi susu', 'Toast keju', 'Matcha latte'], prices: [24000, 32000, 28000], scenario: 'food', flow: ['Order meja', 'Proses di dapur', 'Tutup bill'] },
  healthcare: { brand: 'RD Klinik', focus: 'Antrean & billing', module: 'sector', entity: 'Layanan', items: ['Konsultasi umum', 'Pemeriksaan dasar', 'Konsultasi lanjutan'], prices: [150000, 75000, 125000], scenario: 'healthcare', flow: ['Daftar pasien contoh', 'Panggil antrean', 'Buat tagihan'] },
  education: { brand: 'RD Belajar', focus: 'Siswa & tagihan', module: 'sector', entity: 'Program', items: ['Kelas desain', 'Kelas bahasa', 'Kelas coding'], prices: [450000, 350000, 650000], scenario: 'education', flow: ['Daftarkan siswa', 'Buat tagihan', 'Simulasikan pembayaran'] },
  agribusiness: { brand: 'RD Tumbuh', focus: 'Budidaya & panen', module: 'sector', entity: 'Komoditas', items: ['Kopi', 'Cabai', 'Sayuran'], prices: [45000, 32000, 18000], scenario: 'agribusiness', flow: ['Pilih blok', 'Catat biaya', 'Catat hasil panen'] },
  logistics: { brand: 'RD Kirim', focus: 'Manifest & pengiriman', module: 'fleet', entity: 'Layanan', items: ['Pengiriman kota', 'Pengiriman antarkota', 'Pengiriman khusus'], prices: [25000, 75000, 150000], scenario: 'logistics', flow: ['Buat penugasan', 'Kirim manifest', 'Konfirmasi sampai'] },
  property: { brand: 'RD Properti', focus: 'Unit, booking & progres', module: 'sector', entity: 'Unit', items: ['Luma 01', 'Luma 02', 'Luma 03'], prices: [650000000, 725000000, 850000000], scenario: 'property', flow: ['Lihat unit', 'Booking simulasi', 'Catat cicilan'] },
  ecommerce: { brand: 'RD Commerce', focus: 'Order & stok online', module: 'ecommerce', entity: 'Produk', items: ['Mug Luma', 'Lampu Senja', 'Tote Harian'], prices: [85000, 245000, 125000], scenario: 'ecommerce', flow: ['Pilih produk', 'Checkout simulasi', 'Pantau order'] },
};

export const productModules = {
  'erp-pilot': ['crm', 'projects', 'cash-bank', 'analytics', 'documents', 'administration'],
  'erp-starter': ['sales', 'accounting', 'cash-bank', 'analytics', 'administration'],
  'erp-operations': ['sales', 'procurement-inventory', 'accounting', 'cash-bank', 'approval', 'analytics', 'administration'],
  'erp-custom': catalog.erpModules.map(item => item.id),
  'erp-zero': ['crm', 'projects', 'documents', 'approval', 'analytics', 'administration', 'integrations'],
};

export const demos = [
  ...catalog.products.filter(item => item.commerce?.level !== 'automatic').map(item => ({ id: item.id, productId: item.id, name: commerceByKey(item.id)?.brand || webThemes[item.id]?.brand || (item.id === 'erp-discovery' ? 'RD Discovery' : 'RD ' + item.name.replace(/^ERP /, '')), title: item.name, kind: item.commerce ? 'commerce' : item.kind, route: item.demo.route, image: '/assets/demo-covers/' + item.id + '.webp', subtitle: commerceByKey(item.id)?.category || webThemes[item.id]?.category || (item.id === 'erp-discovery' ? 'Contoh hasil audit proses' : 'Sistem operasional dengan data contoh') })),
  ...catalog.industries.map(item => ({ id: 'industry-' + item.id, industryId: item.id, productId: 'erp-custom', name: industrySettings[item.id].brand, title: item.name, kind: 'industry', route: item.demo.route, image: '/assets/demo-covers/solusi-' + item.id + '.webp', subtitle: industrySettings[item.id].focus })),
];

export function demoConfig(id) {
  if (id.startsWith('industry-')) {
    const industryId = id.slice(9), industry = catalog.industries.find(item => item.id === industryId), settings = industrySettings[industryId];
    if (!industry || !settings) throw new Error('Demo usaha tidak tersedia.');
    const modules = [...new Set([settings.module, ...industry.referenceCoreModuleIds, ...industry.referenceOptionalModuleIds])];
    return { id, ...settings, industryId, modules, productId: 'erp-custom', returnRoute: '/solusi/' + industryId + '/' };
  }
  const product = catalog.products.find(item => item.id === id);
  if (!product) throw new Error('Demo tidak tersedia.');
  const modules = productModules[id] || [];
  const preferred = id === 'erp-pilot' ? 'crm' : id === 'erp-starter' ? 'sales' : 'procurement-inventory';
  return { id, brand: demos.find(item => item.id === id).name, focus: product.name, module: modules.includes(preferred) ? preferred : modules[0], modules, productId: id, returnRoute: '/layanan/' + id + '/', items: ['Mug Luma', 'Bahan kemasan', 'Tote Harian'], prices: [85000, 25000, 125000], scenario: 'standard', flow: ['Pilih modul', 'Coba alur', 'Lihat laporan'] };
}
