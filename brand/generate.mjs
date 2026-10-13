import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(new URL('../site/package.json', import.meta.url));
const sharp = require('sharp');
const lettering = JSON.parse(await fs.readFile(path.join(root, 'source/wordmark-path.json'), 'utf8'));
const monogram = JSON.parse(await fs.readFile(path.join(root, 'source/monogram-path.json'), 'utf8'));
if ([lettering.mainPath, lettering.accentPath, monogram.path, monogram.microPath].some(value => /NaN|Infinity/.test(value))) throw new Error('Non-finite coordinates in logo source.');
const colors = { primary: '#086288', blue: '#4D8DBA', cream: '#FFEFC4', white: '#FFFFFF' };

const svg = (content, width, height, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}"><title>${label}</title>${content}</svg>\n`;
// R's diagonal also forms D's stem. Both counters cut through one solid outline.
const mark = (color, micro = false) => `<path transform="${monogram.transform}" fill="${color}" fill-rule="evenodd" d="${micro ? monogram.microPath : monogram.path}"/>`;
// Lettering is baked into paths so SVG and PNG exports need no installed font.
const wordWidth = Math.ceil(lettering.bounds.x2 - lettering.bounds.x1 + 24);
const word = color => `<g transform="translate(${12 - lettering.bounds.x1} ${94 - lettering.bounds.y2})"><path d="${lettering.mainPath}" fill="${color}"/><path d="${lettering.accentPath}" fill="${color}"/></g>`;
const logo = (type, variant) => {
  const color = colors[variant];
  if (type === 'mark') return svg(mark(color), 128, 128, 'RakanDev - monogram RD menyatu, satu warna');
  if (type === 'wordmark') return svg(word(color), wordWidth, 112, 'RakanDev - logo teks satu warna');
  if (type === 'horizontal') return svg(`${mark(color)}<g transform="translate(152 8)">${word(color)}</g>`, wordWidth + 152, 128, 'RakanDev - logo horizontal satu warna');
  return svg(`<g transform="translate(${(wordWidth - 192) / 2} 8) scale(1.5)">${mark(color)}</g><g transform="translate(0 202)">${word(color)}</g>`, wordWidth, 314, 'RakanDev - logo vertikal satu warna');
};

const assets = [];
await fs.mkdir(path.join(root, 'logos'), { recursive: true });
for (const variant of Object.keys(colors)) {
  for (const type of ['mark', 'wordmark', 'horizontal', 'stacked']) {
    const name = `rakandev-${type}-${variant}`;
    const master = logo(type, variant);
    await fs.writeFile(path.join(root, 'logos', name + '.svg'), master);
    const width = type === 'mark' ? 1024 : 2400;
    await sharp(Buffer.from(master)).resize({ width }).png().toFile(path.join(root, 'logos', name + '.png'));
    const { width: w, height: h, hasAlpha } = await sharp(path.join(root, 'logos', name + '.png')).metadata();
    assets.push({ name, svg: `logos/${name}.svg`, png: `logos/${name}.png`, dimensions: [w, h], transparent: hasAlpha, variant, type });
  }
}
const micro = svg(mark(colors.primary, true), 128, 128, 'RakanDev - monogram mikro menyatu');
await fs.writeFile(path.join(root, 'logos/rakandev-mark-micro.svg'), micro);
const favicon = svg(`<rect width="128" height="128" rx="29" fill="${colors.primary}"/><g transform="translate(8 8) scale(.875)">${mark(colors.cream, true)}</g>`, 128, 128, 'RakanDev - ikon aplikasi');
await fs.writeFile(path.join(root, 'logos/favicon.svg'), favicon);
for (const [name, size] of [['favicon-16', 16], ['favicon-32', 32], ['apple-touch-icon', 180], ['icon-512', 512]]) {
  await sharp(Buffer.from(favicon)).resize(size, size).png().toFile(path.join(root, 'logos', name + '.png'));
}

await fs.mkdir(path.join(root, 'fonts'), { recursive: true });
const fonts = [['caveat', 700], ['manrope', 400], ['manrope', 500], ['manrope', 600]];
for (const [family, weight] of fonts) {
  const name = `${family}-latin-${weight}-normal.woff2`;
  const source = path.join(root, 'source', name);
  await fs.copyFile(source, path.join(root, 'fonts', name));
}
for (const family of ['caveat', 'manrope']) {
  const source = path.join(root, 'source', `${family}-OFL.txt`);
  await fs.copyFile(source, path.join(root, 'fonts', `${family}-OFL.txt`));
}
await fs.mkdir(path.join(root, 'icons'), { recursive: true });
for (const name of ['arrow-right', 'checkmark', 'download', 'landing', 'portfolio', 'profile', 'custom', 'finance', 'people', 'analytics', 'platform']) {
  const icon = await fs.readFile(path.join(root, `../site/public/assets/icons/${name}.svg`), 'utf8');
  await fs.writeFile(path.join(root, 'icons', `${name}.svg`), icon.replaceAll('#202733', colors.primary));
}
await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify({ brand: 'RakanDev', version: '4.0.0', created: '2026-10-13', monogram: monogram.concept, palette: ['#086288', '#4D8DBA', '#97D7FF', '#FFEFC4'], letteringSource: lettering.source, assets }, null, 2) + '\n');
const css = await fs.readFile(path.join(root, 'design-system.css'), 'utf8');
const tokens = { $description: 'RakanDev Design System 4.0 - CSS values with explicit types.', color: {}, typography: {}, spacing: {}, radius: {}, layout: {}, motion: {}, effect: {} };
for (const [, name, value] of css.matchAll(/--rd-([a-z0-9-]+):\s*([^;]+);/g)) {
  let group = tokens.layout;
  let type = 'string';
  let tokenValue = value.trim();
  if (tokenValue.startsWith('#')) { group = tokens.color; type = 'color'; }
  else if (name.startsWith('font-')) { group = tokens.typography; type = 'fontFamily'; tokenValue = tokenValue.split(',').map(v => v.trim().replaceAll("'", '')); }
  else if (name.startsWith('text-')) group = tokens.typography;
  else if (name.startsWith('space-')) group = tokens.spacing;
  else if (name.startsWith('radius-')) group = tokens.radius;
  else if (name.startsWith('duration-') || name === 'ease') group = tokens.motion;
  else if (name === 'shadow') group = tokens.effect;
  if (/^[\d.]+rem$/.test(tokenValue)) { type = 'dimension'; tokenValue = { value: parseFloat(tokenValue), unit: 'rem' }; }
  if (/^\d+ms$/.test(tokenValue)) { type = 'duration'; tokenValue = { value: parseFloat(tokenValue), unit: 'ms' }; }
  if (name === 'ease') { type = 'cubicBezier'; tokenValue = [.16, 1, .3, 1]; }
  group[name] = { $type: type, $value: tokenValue, $description: `CSS variable --rd-${name}` };
}
await fs.writeFile(path.join(root, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');
console.log(`Generated ${assets.length} logo variants, transparent PNGs, micro mark, app icons, local fonts, and UI icons.`);
