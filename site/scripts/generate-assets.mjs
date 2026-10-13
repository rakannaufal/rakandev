import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { catalog } from '../src/data/catalog.mjs';
import { syncBrand } from './sync-brand.mjs';

const root = path.resolve('public/assets');
const entries = [];
const ink = '#086288', plum = '#086288', orange = '#FFEFC4', blue = '#97D7FF';
const svg = (body, w = 800, h = 600) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const line = body => `<g fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
function write(file, body, alt, dimensions, purpose) {
  const output = path.join(root, file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, body);
  entries.push({ file: '/assets/' + file, alt, dimensions, purpose, provenance: 'Original RakanDev vector artwork, authored for this project', license: 'Project-owned original artwork', date: '2026-10-13' });
  return output;
}
const doodles = {
  'highlight-website': ['<path d="m4 12 53-5 54 3 56-4 66 4-3 20-64-2-57 6-51-3-57 3Z" fill="' + orange + '"/>', 240, 40],
  'highlight-bisnismu': ['<path d="m2 12 65-4 57 2 59-5 69 7-5 18-65-1-61 5-49-4-65 3Z" fill="' + orange + '"/>', 255, 40],
  'underline-blue': ['<path d="M5 9Q108 1 235 9M12 16Q126 11 226 17" fill="none" stroke="' + blue + '" stroke-width="5" stroke-linecap="round"/>', 240, 24],
  'price-arrow': ['<path d="M5 8c64-1 125 18 104 70-8 17-23 21-39 9m-2-17 1 19 21 4" fill="none" stroke="' + ink + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', 140, 115],
  'hero-divider': ['<path d="M0 50Q260 3 600 43T1200 30V120H0Z" fill="#F6F5F7"/>', 1200, 120],
};
for (const [name, [body, w, h]] of Object.entries(doodles)) write('doodles/' + name + '.svg', (name==='hero-divider'?svg(body,w,h).replace('<svg ', '<svg preserveAspectRatio="none" '):svg(body,w,h)), '', [w, h], 'decoration');
const shapes = {
  window: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.1m3 0h.1M7 13h6m-6 3h10"/>',
  portfolio: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M8 5V3h8v2M7 10h10M7 14h4m3 0h3M7 17h10"/>',
  building: '<path d="M4 21V5h10v16M14 9h6v12M2 21h20M7 8h4m-4 4h4m-4 4h4m6-4h.1m0 4h.1M8 21v-2h3v2"/>',
  custom: '<path d="m4 17 12-12 3 3-12 12-4 1 1-4ZM14 7l3 3M4 7h5M4 11h2M12 20h8"/>',
  book: '<path d="M4 4h7v16H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM13 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7V4ZM6 8h2m-2 4h2m8-4h3m-3 4h3"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-16a3 3 0 0 1 0 6m2 3c2 1 3 3 3 7"/>',
  bag: '<path d="M4 8h16l1 13H3L4 8Zm4 0V6a4 4 0 0 1 8 0v2m-8 4h.1m7.9 0h.1"/>',
  box: '<path d="m3 7 9-4 9 4v11l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v11M7 5l9 4"/>',
  gear: '<path d="m10 2 4 0 1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1 1-3Z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M5 3h14v18H5V3ZM9 7h6m-7 5 2 2 5-5m-6 9h6"/>',
  chart: '<path d="M3 3v18h18M7 16v-4m5 4V7m5 9v-6M6 7l5-4 6 3 4-4"/>',
  sliders: '<path d="M4 3v8m0 4v6M12 3v2m0 4v12M20 3v12m0 4v2M1 11h6M9 5h6m2 10h6"/>',
  money: '<rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="12" cy="12" r="3"/><path d="M5 9h.1M19 15h.1"/>',
  doc: '<path d="M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8m-8 4h8m-8 3h4"/>',
  heart: '<path d="M12 21 3 12C-2 5 8 0 12 7c4-7 14-2 9 5l-9 9Z"/>',
  truck: '<path d="M2 5h12v12H2V5Zm12 4h5l3 5v3h-8M17 9v5h5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
  link: '<path d="m9 15 6-6M8 17l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2-1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 11h18M7 15h3m4 0h3m-10 3h3"/>',
  shield: '<path d="m12 2 9 4v7c0 6-9 10-9 10S3 19 3 13V6l9-4Zm-5 10 3 3 7-7"/>',
};
const iconShapes = { landing: 'window', portfolio: 'portfolio', profile: 'building', custom: 'custom', plus: 'window', finance: 'book', people: 'people', customers: 'bag', 'supply-chain': 'box', operations: 'gear', controls: 'check', analytics: 'chart', platform: 'sliders', accounting: 'book', 'hr-payroll': 'people', sales: 'bag', 'procurement-inventory': 'box', manufacturing: 'gear', crm: 'people', projects: 'calendar', quality: 'check', maintenance: 'gear', budget: 'money', 'cash-bank': 'money', tax: 'doc', documents: 'doc', approval: 'check', 'after-sales': 'heart', pos: 'money', ecommerce: 'bag', 'customer-portal': 'people', 'supplier-portal': 'box', 'employee-portal': 'people', fleet: 'truck', contracts: 'doc', compliance: 'shield', administration: 'sliders', integrations: 'link', sector: 'building' };
for (const [name, shape] of Object.entries(iconShapes)) write(`icons/${name}.svg`, svg(`<g fill="none" stroke="${ink}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${shapes[shape]}</g>`, 24, 24), '', [24, 24], 'ui-icon');
const utility = { 'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>', search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>', menu: '<path d="M3 6h18M3 12h18M3 18h18"/>', play: '<path d="m8 4 12 8-12 8V4Z"/>', reset: '<path d="M3 9a9 9 0 1 1 0 6M3 3v6h6"/>', checkmark: '<path d="m4 12 5 5 11-11"/>', download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>', cart: '<path d="M2 3h3l3 13h11l3-9H6M9 21h.1M18 21h.1"/>', copy: '<rect x="7" y="7" width="14" height="14" rx="2"/><path d="M3 16V3h13"/>' };
for (const [name, shape] of Object.entries(utility)) write(`icons/${name}.svg`, svg(`<g fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shape}</g>`, 24, 24), '', [24, 24], 'ui-icon');

const laptop = `<rect x="180" y="200" width="320" height="210" rx="15" fill="#FFF"/><path d="M173 203q160-9 334-2l-6 209-317 3ZM153 425h385l-32 23H173Z"/><rect x="208" y="229" width="267" height="146" rx="5" fill="#EAF7FF" stroke="none"/><path d="M234 254h84m-84 20h170m-170 20h130"/><rect x="234" y="317" width="62" height="28" rx="6" fill="${plum}" stroke="none"/><path d="M454 411 488 433"/>`;
const plant = `<path d="M605 466v-164m0 64c-50 2-72-36-66-62 46-2 64 23 66 62m0-12c51 0 79-26 74-52-46-6-67 16-74 52m-27 111 6 64h43l6-64Z"/><path d="M605 399c-20-4-45-26-38-49 25 0 36 21 38 49" fill="#B5CDB8"/>`;
write('illustrations/website-usaha.svg', svg(`<rect width="800" height="600" fill="#FAF8F4"/><path d="M151 452q209-32 379 0" fill="none" stroke="${orange}" stroke-width="13" stroke-linecap="round" opacity=".55"/>${line(laptop + plant + '<path d="m90 200 40-20 20 40-40 20ZM96 116q38-15 71 0M522 175q47-44 68-20m-12-8 12 8-3 15"/><circle cx="100" cy="349" r="23" fill="#FFF1DF"/>')}`), 'Ilustrasi original laptop dengan sketsa website dan tanaman', [800, 600], 'illustration');
const blocks = `<rect x="103" y="221" width="190" height="160" rx="18" fill="#FFF1DF"/><rect x="305" y="115" width="180" height="168" rx="18" fill="#E8F3FC"/><rect x="312" y="301" width="190" height="167" rx="18" fill="#EAF7FF"/><rect x="519" y="222" width="176" height="162" rx="18" fill="#E7F4EC"/><g transform="translate(154 257) scale(4)">${shapes.book}</g><g transform="translate(350 151) scale(4)">${shapes.box}</g><g transform="translate(362 337) scale(4)">${shapes.chart}</g><g transform="translate(558 254) scale(4)">${shapes.people}</g><path d="M134 162q58-47 109-15m-12-11 13 11-4 14M577 435q45 16 71-6"/>`;
write('illustrations/modul-tersusun.svg', svg(`<rect width="800" height="600" fill="#FAF8F4"/>${line(blocks)}`), 'Ilustrasi modul keuangan, stok, tim, dan laporan yang saling terhubung', [800, 600], 'illustration');
const humans = `<path d="M165 482V298q60-71 120 0v97M561 484V300q63-59 116 0v182"/><circle cx="228" cy="230" r="44" fill="#EAD5C5"/><circle cx="620" cy="230" r="44" fill="#EAD5C5"/><path d="M188 220q-1-59 66-27l13 27m-51 22h.1m24 0h.1m-25 23q12 8 24-1M581 224q-1-57 75-27m-49 42h.1m23 0h.1m-19 22q10 5 17-1M252 326l103 47m241-48-74 52M327 371l14-4 12 11m153 4 15-8 14 9"/><path d="M113 419h576m-536 0v109m492-109v109"/><path d="m290 392 49-58 68 58ZM393 394l53-61 74 60" fill="#FFF1DF"/><path d="M169 307q39-30 86 0v77h-77Z" fill="${plum}" stroke="none"/><path d="M574 306q47-25 85 0v75h-85Z" fill="#C3D6EA" stroke="none"/><path d="M368 253q42-39 73 0m-16-12 16 12-14 10"/>`;
write('illustrations/kolaborasi.svg', svg(`<rect width="800" height="600" fill="#FAF8F4"/>${line(humans)}`), 'Dua figur berkolaborasi menyusun sketsa proyek', [800, 600], 'illustration');
function interior(index) {
  const colors = ['#D7B994', '#BCC6B5', '#C3B5A5'];
  return svg(`<defs><pattern id="grain" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 10h28" stroke="#F4EFE7" stroke-width="1"/></pattern></defs><rect width="1000" height="750" fill="#F1EAE0"/><path d="M0 0h1000v526H0Z" fill="#F8F5EF"/><path d="m0 526 260-60h740v284H0Z" fill="${colors[index]}"/><path d="M0 526h1000M260 0v466" stroke="#D8CDBD" stroke-width="2"/><rect x="345" y="78" width="380" height="282" rx="2" fill="#D0DCDB"/><path d="M470 79v281m128-281v281m-252-153h380" stroke="#FFFDF7" stroke-width="10"/><path d="M344 79h55v282h-55m327-282h55v282h-55" fill="#ECE2D1"/><ellipse cx="563" cy="624" rx="284" ry="78" fill="#E9DED0"/><rect x="256" y="405" width="418" height="160" rx="30" fill="${index === 1 ? '#798E7D' : '#CCB89F'}"/><rect x="282" y="379" width="364" height="109" rx="28" fill="${index === 1 ? '#94A894' : '#DECAB3'}"/><path d="M460 390v106" stroke="#B5A18A" stroke-width="3"/><rect x="241" y="465" width="61" height="104" rx="19" fill="${index === 1 ? '#94A894' : '#DECAB3'}"/><rect x="626" y="465" width="61" height="104" rx="19" fill="${index === 1 ? '#94A894' : '#DECAB3'}"/><path d="M290 566v17m341-17v17" stroke="#624936" stroke-width="8"/><ellipse cx="530" cy="569" rx="118" ry="35" fill="#7B5941"/><path d="M458 580v65m153-65v65" stroke="#6B4C34" stroke-width="8"/><ellipse cx="530" cy="558" rx="118" ry="33" fill="#A6825E"/><rect x="519" y="512" width="28" height="34" rx="7" fill="#EFE7D8"/><path d="M533 512v-42m0 16 19-15m-19 29-21-21" fill="none" stroke="#59705A" stroke-width="4"/><path d="M828 528V259m-24 268 9 51h38l10-51Z" stroke="#6B7054" stroke-width="6" fill="#AD8665"/><g fill="#869979"><ellipse cx="807" cy="307" rx="22" ry="48" transform="rotate(-32 807 307)"/><ellipse cx="847" cy="347" rx="22" ry="53" transform="rotate(35 847 347)"/><ellipse cx="804" cy="418" rx="22" ry="42" transform="rotate(-35 804 418)"/></g><path d="M107 139v312m-52-233h106l-23-54H76Z" fill="#8E745D" stroke="#6F5743" stroke-width="3"/><rect width="1000" height="750" fill="url(#grain)" opacity=".35"/>`, 1000, 750);
}
for (let i = 0; i < 3; i++) write(`demo-content/interior-0${i + 1}.svg`, interior(i), 'Ruang interior ilustratif original dengan sofa, cahaya jendela, dan tanaman', [1000, 750], 'demo-content');
write('demo-content/renovasi-hasil.svg', interior(1), 'Ilustrasi ruangan sesudah renovasi, contoh fiktif RD', [1000, 750], 'demo-content');
write('demo-content/renovasi-detail.svg', svg('<rect width="800" height="600" fill="#EDE6DB"/><path d="M0 70h800m-800 120h800m-800 120h800m-800 120h800" stroke="#CEBFA9" stroke-width="3"/><path d="m140 435 305-262 140 161-305 262Z" fill="#B88C62"/><path d="m297 360 215-144" stroke="#76583E" stroke-width="5"/><rect x="450" y="385" width="180" height="55" rx="14" fill="#627D78"/><path d="M629 412h80" stroke="#627D78" stroke-width="26"/><circle cx="210" cy="182" r="80" fill="#F9AE2D"/><path d="M132 173h155m-136-11q22-83 74-46l39 59" fill="none" stroke="#D98D14" stroke-width="10"/>'), 'Ilustrasi material dan alat renovasi RD', [800, 600], 'demo-content');
write('demo-content/works-project.svg', interior(2), 'Ilustrasi ruang kerja untuk profil usaha RD Works', [1000, 750], 'demo-content');
write('demo-content/works-service.svg', fs.readFileSync(path.join(root, 'illustrations/kolaborasi.svg')), 'Ilustrasi proses kolaborasi RD Works', [800, 600], 'demo-content');
const art = [
  ['studio-poster', '#EF6A45', '<circle cx="400" cy="271" r="150" fill="#F6CE6B"/><path d="m212 442 380-303-14 273Z" fill="#274A47"/><path d="M216 487h367m-337 30h305" stroke="#FDF2DB" stroke-width="8"/>'],
  ['studio-packaging', '#C5D4BA', '<path d="m200 203 190-61 201 82-197 71Z" fill="#F3ECE0"/><path d="m200 203 194 92v236l-194-91Z" fill="#D4C5A7"/><path d="m394 295 197-71v238l-197 69Z" fill="#AAB690"/><circle cx="486" cy="363" r="46" fill="#F6AE2E"/><path d="m463 389 22-73 21 75" fill="none" stroke="#274A47" stroke-width="5"/>'],
  ['studio-website', '#EDE5DC', '<rect x="116" y="105" width="568" height="390" rx="12" fill="#FFFBF5"/><path d="M116 145h568" stroke="#DBD0C1" stroke-width="2"/><circle cx="142" cy="125" r="5" fill="#086288"/><path d="M160 125h53m211 0h220M166 219h180m-180 26h148m-148 36h185" stroke="#274A47" stroke-width="8"/><rect x="168" y="317" width="114" height="34" rx="4" fill="#086288"/><path d="m445 196 151 80-18 100-149-59Z" fill="#F9AE2D"/><circle cx="503" cy="276" r="64" fill="#97D7FF"/>'],
];
for (const [name, color, body] of art) write(`demo-content/${name}.svg`, svg(`<rect width="800" height="600" fill="${color}"/>${body}`), 'Karya desain original RakanDev untuk demo portofolio: ' + name, [800, 600], 'demo-content');
const objects = [
  '<path d="M268 191h223v212q-3 74-111 70-110-4-112-70V191Z" fill="#D3B9A0"/><path d="M488 229h34c93 0 93 128 0 128h-33" fill="none" stroke="#C3A78B" stroke-width="28"/><ellipse cx="380" cy="191" rx="111" ry="24" fill="#EEDBC8"/><ellipse cx="380" cy="193" rx="87" ry="15" fill="#75604F"/>',
  '<path d="M318 247h153l43 89H274Z" fill="#D7AE66"/><path d="M393 336v133m-62 0h125" stroke="#52504B" stroke-width="15"/><path d="m392 92-74 155h153L392 92Z" fill="#F0D4A3"/>',
  '<path d="M278 210h236l25 276H258l20-276Z" fill="#C8CFB7"/><path d="M321 222v-63c0-75 153-75 153 0v63" fill="none" stroke="#98A385" stroke-width="14"/><path d="M305 267h172m-172 26h118" stroke="#8B9878" stroke-width="3"/>',
  '<rect x="260" y="147" width="255" height="350" rx="11" fill="#A87561"/><rect x="280" y="157" width="240" height="326" rx="9" fill="#F6EBDA"/><rect x="260" y="147" width="242" height="336" rx="10" fill="#C89C85"/><path d="M292 147v336m139-336v336" stroke="#986D59" stroke-width="6"/>',
  '<path d="M293 248q42-31 193 0l-9 201q-76 69-175 0l-9-201Z" fill="#B9C6BA"/><ellipse cx="389" cy="247" rx="97" ry="29" fill="#8DA18F"/><path d="M391 246V140m0 62c-103-18-130-70-113-101 86-3 111 50 113 101m0-11c74 7 125-56 100-85-77 0-93 42-100 85" fill="#718F6A" stroke="#587653" stroke-width="5"/>',
  '<ellipse cx="395" cy="399" rx="150" ry="68" fill="#AD8962"/><ellipse cx="395" cy="368" rx="151" ry="64" fill="#D2B493"/><path d="M318 359q74-37 154 0m-109 39 126-18" stroke="#B2926F" stroke-width="3" fill="none"/>',
];
for (let i = 0; i < objects.length; i++) write(`demo-content/product-0${i + 1}.svg`, svg(`<rect width="800" height="600" fill="#F4F0EA"/><ellipse cx="397" cy="505" rx="155" ry="19" fill="#D9D2C7" opacity=".6"/>${objects[i]}`), ['Mug keramik Luma', 'Lampu meja Senja', 'Tote Harian', 'Notebook Catatan', 'Pot tanaman Teduh', 'Piring kayu Bulat'][i] + ', ilustrasi produk original RD', [800, 600], 'demo-content');

// Raster exports keep the authored art local and efficient in all demo templates.
for (const entry of [...entries].filter(entry => ['demo-content', 'illustration'].includes(entry.purpose))) {
  const file = entry.file.replace('/assets/', ''), out = file.replace('.svg', '.webp');
  await sharp(path.join(root, file)).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(root, out));
  entries.push({ ...entry, file: '/assets/' + out, provenance: 'WebP export of original RakanDev vector artwork' });
}
for (const module of catalog.erpModules) if (!fs.existsSync(path.join(root, 'icons', module.id + '.svg'))) throw new Error('Missing module icon: ' + module.id);
const manifest = { brand: 'RakanDev', created: '2026-10-13', assets: entries };
await syncBrand(manifest);
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Created ' + manifest.assets.length + ' brand, icon, doodle, illustration, and demo assets.');
