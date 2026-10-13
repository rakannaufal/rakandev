import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(new URL('../site/package.json', import.meta.url));
const { chromium, expect } = require('@playwright/test');
const browser = await chromium.launch({ executablePath: process.env.QA_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1040 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
const fonts = await page.evaluate(() => [...document.fonts].map(font => ({ family: font.family, weight: font.weight, status: font.status })));
if (fonts.length !== 4 || fonts.some(font => font.status !== 'loaded' || !['Caveat', 'Manrope'].includes(font.family))) throw new Error('Brand fonts: ' + JSON.stringify(fonts));
const images = await page.evaluate(() => [...document.images].filter(image => !image.naturalWidth).map(image => image.src));
if (images.length || errors.length) throw new Error(JSON.stringify({ images, errors }));
await page.locator('#identity').screenshot({ path: path.join(root, 'rakandev-preview.png'), animations: 'disabled' });
await page.emulateMedia({ media: 'print' });
const layout = await page.evaluate(() => [...document.querySelectorAll('.sheet')].map(sheet => {
  const footer = sheet.querySelector('.sheet-foot').getBoundingClientRect();
  const elements = [...sheet.querySelectorAll('h1,h2,h3,p,img,table,.type-row,.file-row,.space-row,.radius-row,.micro-row')];
  return { id: sheet.id, clipped: elements.filter(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.height > 0 && bounds.bottom > footer.top - 10;
  }).map(element => element.textContent.trim().slice(0, 90) || element.getAttribute('alt')) };
}));
if (layout.some(sheet => sheet.clipped.length)) throw new Error('Print content meets footer: ' + JSON.stringify(layout));
const pdfRoot = path.resolve(root, '../output/pdf');
await fs.mkdir(pdfRoot, { recursive: true });
await page.pdf({ path: path.join(pdfRoot, 'rakandev-design-system.pdf'), printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
await page.emulateMedia({ media: 'screen' });
const mobile = [];
for (const width of [360, 390, 760]) {
  await page.setViewportSize({ width, height: 844 });
  const data = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(image => !image.naturalWidth).length }));
  mobile.push(data);
  if (data.content > width || data.brokenImages) throw new Error('Mobile layout: ' + JSON.stringify(data));
}
await page.setViewportSize({ width: 390, height: 844 });
await page.locator('#identity').screenshot({ path: path.join(root, 'rakandev-preview-mobile.png'), animations: 'disabled' });
await page.locator('#example-form button').click();
if (!(await page.locator('#business-error').isVisible())) throw new Error('Empty field did not show error.');
await page.locator('#business').fill('Studio Nara');
await page.locator('#example-form button').click();
if ((await page.locator('#form-status').textContent()) !== 'Nama usaha sudah lengkap.') throw new Error('Valid field failed.');
for (const size of [16, 24, 32, 64]) {
  await page.locator('#logo-size').fill(String(size));
  const result = await page.locator('#micro-logo').evaluate(image => ({ width: image.getBoundingClientRect().width, src: image.getAttribute('src') }));
  if (Math.abs(result.width - size) > .1 || result.src.includes('micro') !== (size < 24)) throw new Error('Logo size switch failed: ' + JSON.stringify(result));
}
await page.locator('[data-color="#086288"]').click();
await expect(page.locator('#toast')).toContainText('#086288');
await page.locator('[data-demo-action]').first().click();
await expect(page.locator('#toast')).toContainText('Interaksi berjalan');
await browser.close();
const result = { desktop: 'passed', fonts, printLayout: layout, mobile, interactions: ['form empty and valid', 'logo micro/primary switch', 'swatch feedback', 'button feedback'], pageErrors: errors };
await fs.writeFile(path.join(root, 'verification.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
