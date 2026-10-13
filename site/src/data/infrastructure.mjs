export const checkedAt = '2026-10-13';
// Round upward only after VAT; keep the adjustment visible in every breakdown.
export const domainPricePolicy = { margin: 0, taxRate: .11, rounding: 5000, roundingDirection: 'up', promotionalRatesUsed: true };
const taxFor = value => Math.round(value * domainPricePolicy.taxRate);
const domainWithTax = value => Math.ceil((value + taxFor(value)) / domainPricePolicy.rounding) * domainPricePolicy.rounding;
const domainCosts = [
  ['com',137000,209000],['id',219000,249000],['my.id',9900,35000],['web.id',9900,55000],['biz.id',9900,70000],
  ['net',168000,249000],['org',269000,269000],['co.id',295000,300000],['online',29900,639000],['cloud',44900,529000],
  ['site',29900,669000],['store',68000,949000],['xyz',79900,399000],['space',45900,729000],['it.com',75000,550000],
  ['tech',68000,1119000],['sch.id',48900,55000],['asia',79900,239000],['icu',109000,409000],['pw',55000,459000],
];
export const domainPlans = domainCosts.map(([tld,cost,renewalCost])=>({
  tld, registration: domainWithTax(cost), renewal: domainWithTax(renewalCost), referenceCost: cost,
  registrationSubtotal: cost, registrationTax: taxFor(cost), registrationRounding: domainWithTax(cost)-cost-taxFor(cost),
  renewalSubtotal: renewalCost, renewalTax: taxFor(renewalCost), renewalRounding: domainWithTax(renewalCost)-renewalCost-taxFor(renewalCost), promotional: cost<renewalCost,
  note: ['co.id','sch.id'].includes(tld)
    ? 'Pendaftaran mengikuti persyaratan dokumen usaha atau lembaga. Subtotal + PPN 11% dibulatkan ke atas per Rp5.000; tanpa tambahan margin jasa.'
    : 'Subtotal + PPN 11% dibulatkan ke atas per Rp5.000; tanpa tambahan margin jasa. Tarif pendaftaran saat ini dapat berupa promo; perpanjangan memakai tarif terpisah.',
}));

export const hostingPlans = [
  { id: 'free', name: 'Static gratis', monthly: 0, renewalMonthly: 0, promoMonthly: null, specs: ['Alamat subdomain gratis + HTTPS', '500 build/bulan, 20.000 file', 'Maksimal 25 MiB per file', 'Aset statis; backend/database terpisah'], fit: 'Landing page / portofolio / profil / katalog Starter statis. Domain custom juga didukung.', note: 'Tanpa email bisnis atau server database. Trafik statis tidak dipatok dari jumlah user; Fungsi server mengikuti kuota layanan gratis. Syarat layanan dapat berubah.' },
  { id: 'entry', name: 'Hosting ringan', monthly: 25000, renewalMonthly: 25000, promoMonthly: 15000, specs: ['1 GB storage', 'CPU hingga 1 core; RAM 512 MB', '10 entry process; resource shared', 'SSL, database, email; backup mingguan'], fit: 'Website kecil dengan kebutuhan email atau CMS ringan.', note: 'CPU shared, bukan 1 core dedicated; batas pemakaian CPU harian 20%. Promo tahun pertama Rp15.000/bln, syarat checkout berlaku.' },
  { id: 'small', name: 'Hosting bisnis', monthly: 50000, renewalMonthly: 50000, promoMonthly: 17900, specs: ['Storage mengikuti batas 250.000 inode', 'CPU hingga 1 core; RAM 1 GB', '15 entry process; resource shared', 'SSL, database, email, backup bersyarat'], fit: 'Profil bisnis atau CMS dengan konten yang bertambah.', note: 'CPU harian 40%; guaranteed RAM 512 MB. Backup mingguan hanya untuk pemakaian <5 GB dan <75.000 inode. Promo awal Rp17.900/bln.' },
  { id: 'medium', name: 'Hosting berkembang', monthly: 90000, renewalMonthly: 90000, promoMonthly: 29900, specs: ['Storage mengikuti batas 250.000 inode', 'CPU hingga 1,5 core; RAM 2 GB', '20 entry process; resource shared', 'SSL, cache, database, email'], fit: 'CMS atau toko kecil; kapasitas perlu diuji terhadap beban nyata.', note: 'CPU harian 60%; guaranteed RAM 1 GB. Backup mingguan hanya untuk pemakaian <5 GB dan <75.000 inode. Promo awal Rp29.900/bln. ERP dan trafik berat perlu evaluasi server khusus.' },
  { id: 'owned', name: 'Sudah punya hosting', monthly: null, renewalMonthly: null, specs: [], fit: 'Kompatibilitas dan sisa kapasitas diperiksa saat konsultasi.' },
  { id: 'custom', name: 'Server / hosting custom', monthly: null, renewalMonthly: null, specs: [], fit: 'VPS, cloud, database, banyak pengguna aktif, atau ERP. Tulis kebutuhan resource dan lokasi server.' },
  { id: 'later', name: 'Bantu pilih hosting', monthly: null, renewalMonthly: null, specs: [], fit: 'Rekomendasi mengikuti fungsi website, beban, dukungan, dan anggaran.' },
];
export const hostingTerms = [1, 3, 6, 12, 24];
export const staticProducts = ['landing', 'portfolio', 'plus', 'profile', 'saji', 'bekal', 'luma', 'sela', 'karya', 'panggung', 'temu'];
