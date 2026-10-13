import { infrastructureErrors, infrastructureBrief } from './infrastructure.mjs';
import { scopeFor, scopeBriefLines } from './brief-builder.mjs';
export const rupiah = value => value === null ? 'Setelah konsultasi' : 'Rp' + new Intl.NumberFormat('id-ID').format(value);

export function estimateWebsite(catalog, productId, quantities = {}) {
  const product = catalog.products.find(item => item.id === productId && item.kind === 'website');
  if (!product) throw new Error('Paket website tidak tersedia.');
  const extras = [], included = catalog.packageInclusions[productId] || {};
  let recurring = 0;
  for (const addon of catalog.websiteAddons) {
    const count = Number(quantities[addon.id] || 0);
    if (!Number.isSafeInteger(count) || count < 0 || count > 100) throw new Error('Jumlah tambahan harus 0-100.');
    if (!count) continue;
    const chargeable = Math.max(0, count - (included[addon.id] || 0));
    const total = addon.price.amount * chargeable;
    extras.push({ id: addon.id, name: addon.name, count, included: Math.min(count, included[addon.id] || 0), chargeable, total, billing: addon.price.billing });
    if (addon.price.billing === 'monthly') recurring += total;
  }
  const total = product.price.amount === null ? null : product.price.amount + extras.filter(item => item.billing === 'once').reduce((sum, item) => sum + item.total, 0);
  return { productId, base: product.price.amount, extras, total, deposit: total === null ? null : Math.ceil(total * catalog.pricingRules.websiteDepositRatio), recurring };
}

export function validateBrief(data) {
  const errors = {};
  if (!String(data.name || '').trim()) errors.name = 'Tulis nama kamu.';
  if (!String(data.business || '').trim()) errors.business = 'Tulis nama usaha atau proyekmu.';
  const contact = String(data.contact || '').trim();
  if (!contact) errors.contact = 'Isi email atau nomor WhatsApp yang bisa dihubungi.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?[0-9\s()-]{8,24}$/.test(contact)) errors.contact = 'Periksa format email atau nomor WhatsApp.';
  if (String(data.goal || '').trim().length < 10) errors.goal = 'Ceritakan kebutuhanmu, minimal 10 karakter.';
  if (!data.consent) errors.consent = 'Setujui penggunaan informasi ini untuk konsultasi.';
  return {...errors,...infrastructureErrors(data)};
}

export function briefText(catalog, data, selection = {}) {
  const product = catalog.products.find(item => item.id === data.product);
  const lines = ['Brief konsultasi RakanDev', '', 'Nama: ' + String(data.name || '').trim(), 'Usaha/proyek: ' + String(data.business || '').trim(), 'Kontak: ' + String(data.contact || '').trim(), 'Layanan: ' + (product?.name || 'Bantu pilih layanan'), 'Demo pilihan: ' + (data.demo || 'Belum dipilih'), 'Kebutuhan: ' + String(data.goal || '').trim()];
  if (data.budget) lines.push('Anggaran: ' + data.budget);
  if (data.deadline) lines.push('Target: ' + data.deadline);
  if (selection.productId === data.product && product?.kind === 'website') {
    const quote = estimateWebsite(catalog, data.product, selection.quantities);
    for (const item of quote.extras) lines.push(item.name + ': ' + item.count + (item.included ? ' (' + item.included + ' termasuk paket)' : '') + ' - ' + rupiah(item.total) + (item.billing === 'monthly' ? '/bulan' : ''));
    lines.push('Estimasi sekali bayar: ' + rupiah(quote.total), 'DP indikatif: ' + rupiah(quote.deposit), 'Pemeliharaan opsional: ' + rupiah(quote.recurring) + '/bulan');
  } else if (product) lines.push('Harga acuan: ' + (product.price.mode === 'starting' ? 'Mulai ' : '') + rupiah(product.price.amount));
  if (product?.kind==='erp'&&selection.moduleIds?.length) lines.push('Modul yang ingin dibahas: ' + selection.moduleIds.map(id => catalog.erpModules.find(item => item.id === id)?.name).filter(Boolean).join(', '));
  if(data.scopeAnswers)lines.push(...scopeBriefLines(data,scopeFor(data.product,selection.quantities,selection.moduleIds)));
  if(product&&product.id!=='erp-discovery')lines.push('Revisi: 3 putaran penyesuaian dalam scope yang disepakati.');
  if(data.domainMode||data.hostingId)lines.push(infrastructureBrief(data));
  lines.push('', 'Domain, hosting berbayar, lisensi, dan biaya provider terpisah. Scope, biaya final, serta jadwal dikonfirmasi sebelum pembayaran.');
  return lines.join('\n');
}
