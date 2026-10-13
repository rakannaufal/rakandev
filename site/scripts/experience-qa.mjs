import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium,expect } from '@playwright/test';
import { domainPlans } from '../src/data/infrastructure.mjs';

const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4321';
const only=process.env.QA_ONLY?new RegExp(process.env.QA_ONLY):null;
const browser=await chromium.launch({executablePath:process.env.QA_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce',acceptDownloads:true});
const page=await context.newPage(),checks=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
const visit=path=>page.goto(origin+path,{waitUntil:'networkidle'});
async function run(name,fn){if(only&&!only.test(name))return;try{await fn();checks.push({name,status:'passed'});console.log('PASS '+name);}catch(error){checks.push({name,status:'failed',error:error.message});console.error('FAIL '+name+': '+error.message);}}
async function imagesReady(){await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await document.fonts.ready;await Promise.all([...document.images].filter(img=>img.getAttribute('src')).map(img=>img.decode().catch(()=>{})));});await expect.poll(()=>page.evaluate(()=>[...document.images].filter(img=>img.getAttribute('src')&&(!img.complete||!img.naturalWidth)).map(img=>img.src)),{timeout:10000}).toEqual([]);}
async function fresh(path){await visit(path);await page.evaluate(()=>{sessionStorage.clear();localStorage.clear();});await visit(path);}
async function identity(){await page.locator('[name="name"]').fill('Rakan');await page.locator('[name="business"]').fill('Usaha Contoh');await page.locator('[name="contact"]').fill('contoh@example.com');await page.locator('[name="goal"]').fill('Website untuk memperkenalkan usaha dan menghubungi pelanggan.');}
async function stepThree(product='landing'){
  await fresh('/konsultasi/?product='+product);await identity();await page.locator('[data-brief-next]').first().click();await page.locator('[data-brief-next]').last().click();
}
const registryPattern=/https:\/\/rdap\./;
const mockRegistry=async route=>{
  const domain=decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1));
  if(domain==='taken.com'||domain.endsWith('.my.id'))await route.fulfill({contentType:'application/rdap+json',body:JSON.stringify({objectClassName:'domain',ldhName:domain})});
  else if(domain.endsWith('.net')||domain.startsWith('unknown'))await route.fulfill({status:429,contentType:'application/rdap+json',body:'{"errorCode":429}'});
  else await route.fulfill({status:404,contentType:'application/rdap+json',body:''});
};
await page.route(registryPattern,mockRegistry);

await run('supplied identity, three revisions, prices and public provider copy',async()=>{
  for(const group of ['01-PNG-Transparan','02-PNG-Latar-Putih'])for(const name of ['logo-horizontal','ikon-rd','teks-rakandev'])assert.ok(fs.readFileSync('../RakanDev-Logo-Assets/'+group+'/'+name+'.png').equals(fs.readFileSync('public/assets/brand/supplied/'+group+'/'+name+'.png')));
  assert.ok(fs.readFileSync('../RakanDev-Logo-Assets/favicon-source.png').equals(fs.readFileSync('public/assets/brand/supplied/favicon-source.png')));
  await fresh('/');await imagesReady();await expect(page.locator('.site-header .brand img')).toHaveAttribute('src','/assets/brand/rakandev-logo.webp');
  await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toHaveAttribute('href','/assets/brand/favicon-32.png?v=rd-20261013');
  assert.equal(await page.locator('.hero .button.primary').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(8, 98, 136)');
  await visit('/pricing/');await expect(page.locator('.price-card')).toHaveCount(3);assert.doesNotMatch(await page.locator('body').innerText(),/300 kata|5 gambar total|1 revisi kecil|Rumahweb|Domainesia|Hostinger|Cloudflare/);
  await expect(page.locator('.price-card').first()).toContainText('3 putaran revisi');await expect(page.locator('[data-domain-registration="com"]')).toHaveText('Rp155.000');
  for(const route of ['/konsultasi/','/demo/landing/','/demo/portfolio/','/demo/custom/','/ketentuan/']){await visit(route);assert.doesNotMatch(await page.locator('body').innerText(),/\bnara\b|Rumahweb|Domainesia|Hostinger|Cloudflare/i);}
});
await run('guided website brief, priced extras, per-package answers, resume, review and download',async()=>{
  await fresh('/konsultasi/?product=plus');await page.locator('[data-brief-next]').first().click();await expect(page.locator('[name="name"]')).toBeFocused();
  await identity();await page.locator('[data-brief-next]').first().click();await expect(page.locator('[data-section-brief]')).toHaveCount(6);
  await page.locator('[data-brief-example="opening"]').click();await page.locator('[data-section-brief="opening"]').fill('Pembuka khusus untuk Usaha Contoh.');
  await page.locator('[data-brief-extras]').evaluate(el=>el.open=true);await page.locator('[data-brief-addon="section"]').fill('1');await page.locator('[data-brief-addon="section"]').dispatchEvent('change');
  await expect(page.locator('[data-section-brief]')).toHaveCount(7);await expect(page.locator('[data-package-summary]')).toContainText('Rp700.000');
  await page.locator('[data-brief-back]').first().click();await page.locator('[name="product"]').selectOption('portfolio');await page.locator('[data-brief-next]').first().click();await expect(page.locator('[data-section-brief]')).toHaveCount(4);
  await page.locator('[data-section-brief="opening"]').fill('Portofolio desain saya.');await page.locator('[data-brief-back]').first().click();await page.locator('[name="product"]').selectOption('plus');await page.locator('[data-brief-next]').first().click();
  await expect(page.locator('[data-section-brief="opening"]')).toHaveValue('Pembuka khusus untuk Usaha Contoh.');await expect(page.locator('[data-section-brief]')).toHaveCount(7);
  await page.locator('[data-brief-next]').last().click();await expect(page.locator('[data-brief-step="3"]')).toBeVisible();await page.locator('[name="domainMode"]').selectOption('free');await page.locator('[name="hostingId"]').selectOption('free');await page.locator('[name="consent"]').check();await page.reload({waitUntil:'networkidle'});
  await expect(page.locator('[data-brief-step="3"]')).toBeVisible();await page.locator('button[type="submit"]').click();await expect(page.locator('[data-brief-step="4"]')).toBeVisible();await expect(page.locator('[data-brief-output]')).toHaveValue(/Pembuka khusus/);await expect(page.locator('[data-brief-output]')).toHaveValue(/Rp700.000/);await expect(page.locator('[data-brief-output]')).toHaveValue(/3 putaran/);
  const download=page.waitForEvent('download');await page.locator('[data-download-brief]').click();assert.equal((await download).suggestedFilename(),'brief-rakandev.txt');
  await page.locator('[data-copy-brief]').click();await expect(page.locator('[data-copy-status]')).not.toBeEmpty();
});
await run('profile pages and custom feature briefs follow the category',async()=>{
  await fresh('/konsultasi/?product=profile');await identity();await page.locator('[data-brief-next]').first().click();await expect(page.locator('[data-section-brief]')).toHaveCount(12);
  assert.deepEqual(await page.locator('.scope-outline summary small').allTextContents(),[...Array(4).fill('Beranda'),...Array(4).fill('Tentang'),...Array(4).fill('Karya / layanan')]);
  await page.locator('[data-brief-back]').first().click();await page.locator('[name="product"]').selectOption('custom');await page.locator('[data-brief-next]').first().click();await page.locator('[data-brief-module="site-cms"]').check();await page.locator('[data-brief-module="site-booking"]').check();
  await expect(page.locator('[data-feature-brief]')).toHaveCount(2);await page.locator('.feature-brief').first().evaluate(el=>el.open=true);await page.locator('[data-feature-brief="site-cms"]').fill('Admin dapat mengganti foto dan teks layanan.');await expect(page.locator('[data-package-summary]')).toContainText('Setelah konsultasi');
});
await run('ERP included features, additional feature brief and compatible hosting',async()=>{
  await fresh('/konsultasi/?product=erp-pilot');await identity();await page.locator('[data-brief-next]').first().click();await expect(page.locator('[data-brief-module="crm"]')).toBeChecked();await expect(page.locator('[data-brief-module="crm"]')).toBeDisabled();
  await page.locator('[data-brief-module="sales"]').check();await page.locator('.feature-brief:has([data-feature-brief="sales"])').evaluate(el=>el.open=true);await page.locator('[data-feature-brief="sales"]').fill('Pesanan masuk, stok diperiksa, faktur diterbitkan.');
  await expect(page.locator('.feature-brief:has([data-feature-brief="sales"])')).toContainText('proposal terpisah');await expect(page.locator('[data-package-summary]')).toContainText('Rp3.000.000');
  await page.locator('[data-brief-next]').last().click();await expect(page.locator('[name="hostingId"] option[value="free"]')).toBeDisabled();await page.locator('[name="consent"]').check();await page.locator('button[type="submit"]').click();await expect(page.locator('[data-brief-output]')).toHaveValue(/Pesanan masuk/);await expect(page.locator('[data-brief-output]')).toHaveValue(/dibahas terpisah/);
});
await run('domain check and cross icons, verified recommendations, selection and renewal',async()=>{
  await stepThree('portfolio');await page.locator('[name="domainMode"]').selectOption('custom');await page.locator('[name="domainName"]').fill('taken.com');await page.locator('[data-check-domain]').click();
  await expect(page.locator('[data-domain-result]')).toHaveAttribute('data-status','registered');await expect(page.locator('[data-domain-result]')).toContainText('Tidak tersedia');await expect(page.locator('[data-domain-result] .domain-status-icon path')).toHaveAttribute('d','m6 6 12 12M6 18 18 6');
  await expect(page.locator('[data-domain-suggestions]')).toHaveAttribute('aria-busy','false');await expect(page.locator('[data-domain-candidate]')).toHaveCount(6);await expect(page.locator('[data-domain-suggestions-status]')).toContainText('4 rekomendasi');
  await expect(page.locator('[data-domain-candidate="taken.my.id"] [data-use-domain]')).toHaveCount(0);await expect(page.locator('[data-domain-candidate="taken.net"] [data-use-domain]')).toHaveCount(0);await expect(page.locator('[data-domain-candidate]')).toHaveCount(6);
  await page.locator('[data-use-domain="taken.web.id"]').click();await expect(page.locator('[name="domainName"]')).toHaveValue('taken.web.id');await expect(page.locator('[data-domain-result] .domain-status-icon path')).toHaveAttribute('d','m5 12 4 4 10-10');await expect(page.locator('[data-infrastructure-summary] .infra-total dd')).toHaveText('Rp15.000');
  await expect(page.locator('[data-domain-result] .domain-price-breakdown')).toContainText('PPN 11%');await expect(page.locator('[data-domain-result] .domain-price-breakdown')).toContainText('Pembulatan ke atas');await expect(page.locator('[data-domain-result] .domain-price-total dd')).toHaveText('Rp15.000');
  await page.locator('[name="domainYears"]').selectOption('2');await expect(page.locator('[data-infrastructure-summary] .infra-total dd')).toHaveText('Rp80.000');await page.locator('[name="hostingId"]').selectOption('entry');await page.locator('[name="hostingMonths"]').selectOption('6');await expect(page.locator('[data-infrastructure-summary] .infra-total dd')).toHaveText('Rp230.000');
  await page.reload({waitUntil:'networkidle'});await expect(page.locator('[data-domain-result]')).toContainText('belum diperiksa ulang');await expect(page.locator('[name="hostingMonths"]')).toHaveValue('6');
});
await run('domain unknown, validation and stale-response cancellation',async()=>{
  await stepThree();await page.locator('[name="domainMode"]').selectOption('custom');await page.locator('[name="domainName"]').fill('unknown.com');await page.locator('[data-check-domain]').click();await expect(page.locator('[data-domain-result]')).toHaveAttribute('data-status','unknown');await expect(page.locator('[data-domain-suggestions]')).toHaveAttribute('aria-busy','false');await expect(page.locator('[data-use-domain]')).toHaveCount(0);
  await page.locator('[name="domainName"]').fill('https://wrong.com');await page.locator('[data-check-domain]').click();await expect(page.locator('#error-domainName')).toContainText('tanpa https');
  await page.locator('[name="domainName"]').fill('sample.it.com');await page.locator('[data-check-domain]').click();await expect(page.locator('[data-domain-result]')).toHaveAttribute('data-status','unknown');await expect(page.locator('[data-domain-result]')).toContainText('pemeriksaan tim');await expect(page.locator('[name="domainName"]')).not.toHaveAttribute('aria-invalid','true');await expect(page.locator('[data-domain-candidate]')).toHaveCount(6);
  let release;const gate=new Promise(resolve=>release=resolve);await page.route('https://rdap.verisign.com/com/v1/domain/slow.com',async route=>{await gate;try{await route.fulfill({status:404,contentType:'application/rdap+json',body:''});}catch{}});
  await page.locator('[name="domainName"]').fill('slow.com');await page.locator('[data-check-domain]').click();await expect(page.locator('[data-domain-result]')).toHaveAttribute('data-status','loading');await page.locator('[name="domainName"]').fill('changed.com');release();await expect(page.locator('[data-domain-result]')).toBeHidden();await expect(page.locator('[data-check-domain]')).toBeEnabled();
});
await run('detailed portfolio, interior project details and receipt export',async()=>{
  await fresh('/demo/portfolio/');await page.locator('[data-work-detail="0"]').click();await expect(page.locator('[data-work-case]')).toContainText('Tantangan');await expect(page.locator('[data-work-case]')).toContainText('Proses');await imagesReady();await page.locator('[data-work-next]').click();await expect(page.locator('#work-title')).toContainText('PULS');await imagesReady();await page.keyboard.press('Escape');await expect(page.locator('.work-dialog')).not.toBeVisible();
  await visit('/demo/landing/');await page.locator('[data-interior-project="2"]').first().click();await expect(page.locator('#interior-project-title')).toHaveText('Senja Space');await expect(page.locator('[data-interior-materials]')).toContainText('Batu terang');await imagesReady();await page.keyboard.press('Escape');
  await visit('/demo/custom/');await page.locator('[data-action="cart-add"]').first().click();await page.locator('[data-demo-form="checkout"] button').click();await expect(page.locator('.receipt-history')).toContainText('STR-RD-');await page.locator('.receipt-history details').evaluate(el=>el.open=true);const download=page.waitForEvent('download');await page.locator('[data-receipt-download]').click();assert.match((await download).suggestedFilename(),/^STR-RD-.*\.txt$/);
});
await run('ERP variable payment, transfer, timesheets and harvest update real state',async()=>{
  await fresh('/demo/erp-starter/?module=cash-bank');await page.locator('.demo-transaction-entry').evaluate(el=>el.open=true);await page.locator('[data-demo-form="payment"] [name="amount"]').fill('300000');await page.locator('[data-demo-form="payment"] button').click();
  const state=id=>page.evaluate(id=>JSON.parse(localStorage.getItem('rd:demo:v1:'+id)),id);
  assert.equal((await state('erp-starter')).invoices[0].paid,300000);await expect(page.locator('[data-demo-feedback]')).toContainText('1.200.000');
  await visit('/demo/erp-operations/?module=procurement-inventory');await page.locator('.demo-transaction-entry').evaluate(el=>el.open=true);await page.locator('[data-demo-form="transfer-quantity"] [name="quantity"]').fill('17');await page.locator('[data-demo-form="transfer-quantity"] button').click();assert.equal((await state('erp-operations')).inventory[0].stock,83);assert.equal((await state('erp-operations')).inventory[0].secondary,37);
  await visit('/demo/erp-pilot/?module=projects');await page.locator('.demo-transaction-entry').evaluate(el=>el.open=true);await page.locator('[data-demo-form="project-time"] [name="hours"]').fill('3');await page.locator('[data-demo-form="project-time"] button').click();assert.equal((await state('erp-pilot')).projects[0].hours,5);
  await visit('/demo/solusi/agribusiness/');await page.locator('.demo-transaction-entry').evaluate(el=>el.open=true);await page.locator('[data-demo-form="harvest"] [name="id"]').selectOption('sector-2');await page.locator('[data-demo-form="harvest"] [name="quantity"]').fill('45');await page.locator('[data-demo-form="harvest"] button').click();assert.equal((await state('industry-agribusiness')).sector[1].yield,45);
});
await run('live domain registries return registered records in the browser',async()=>{
  await page.unroute(registryPattern,mockRegistry);await stepThree();await page.locator('[name="domainMode"]').selectOption('owned');
  for(const domain of ['example.com','pandi.id']){await page.locator('[name="domainName"]').fill(domain);await page.locator('[data-check-domain]').click();await expect(page.locator('[data-domain-result]')).toHaveAttribute('data-status','registered',{timeout:16000});}
  await page.route(registryPattern,mockRegistry);
});
await run('responsive desktop and mobile visual batch, assets and all guided stages',async()=>{
  fs.mkdirSync('qa/screenshots',{recursive:true});const overflow=[];
  async function checkOverflow(label){const result=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.right>innerWidth+1;}).slice(0,8).map(el=>({tag:el.tagName,class:el.className,right:Math.round(el.getBoundingClientRect().right)}))}));if(result.scrollWidth>result.width+1)overflow.push({label,...result});}
  const routes=['/','/pricing/','/konsultasi/','/demo/landing/','/demo/portfolio/','/demo/plus/','/demo/profile/','/demo/profile/tentang/','/demo/profile/karya/','/demo/custom/','/demo/erp-pilot/'];
  for(const width of [360,390,768,1024,1440]){
    await page.setViewportSize({width,height:960});
    for(const route of routes){await visit(route);await imagesReady();await checkOverflow(route+' @'+width);if([390,1440].includes(width)&&['/','/pricing/','/konsultasi/','/demo/landing/','/demo/portfolio/'].includes(route))await page.screenshot({path:'qa/screenshots/experience-'+(route==='/'?'home':route.split('/').filter(Boolean).join('-'))+'-'+width+'.png',fullPage:true,animations:'disabled'});}
    await stepThree('portfolio');await page.locator('[data-brief-back]').last().click();await imagesReady();await checkOverflow('Brief contents @'+width);
    if([390,1440].includes(width))await page.screenshot({path:'qa/screenshots/experience-brief-content-'+width+'.png',fullPage:true,animations:'disabled'});
    await page.locator('[data-brief-next]').last().click();await page.locator('[name="domainMode"]').selectOption('custom');await page.locator('[name="domainName"]').fill('taken.com');await page.locator('[data-check-domain]').click();await expect(page.locator('[data-domain-suggestions]')).toHaveAttribute('aria-busy','false');await imagesReady();await checkOverflow('Domain alternatives @'+width);
    if([390,1440].includes(width))await page.screenshot({path:'qa/screenshots/experience-domain-'+width+'.png',fullPage:true,animations:'disabled'});
  }
  assert.deepEqual(overflow,[]);
});
const result={date:'2026-10-13',scope:process.env.QA_ONLY||'complete',identity:'supplied-png-2026-10-13',domainExtensions:domainPlans.length,checks,pageErrors:[...new Set(errors)]};
fs.writeFileSync(only?'qa/experience-followup-results.json':'qa/experience-results.json',JSON.stringify(result,null,2)+'\n');
await browser.close();console.log(JSON.stringify(result));if(errors.length||checks.some(x=>x.status==='failed'))process.exitCode=1;
