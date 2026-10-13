import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { catalog } from '../src/data/catalog.mjs';
import { demos } from '../src/data/demos.mjs';
import { heroSlides } from '../src/data/hero-slides.mjs';
import { heroPrice, renderHeroCarousel } from '../src/lib/hero-carousel.mjs';
import { allRoutes, demoCatalog, pricingPage, renderMarketing } from '../src/lib/render.mjs';
import { estimateWebsite, briefText } from '../src/lib/pricing.mjs';

test('marketing pages render customer copy without unresolved template values', () => {
  assert.match(demoCatalog(), /30 contoh website dan sistem usaha/);
  for (const route of ['', ...allRoutes().filter(route => !route.startsWith('demo/'))]) {
    const html = renderMarketing(route);
    const visible = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, '');
    assert.doesNotMatch(visible, /\$\{[^}]+\}|\b(?:undefined|NaN)\b/, route);
  }
});

test('Basic quotes, deposits and consultation summaries keep the requested Rp300,000 price', () => {
  const sourceCatalog = JSON.parse(fs.readFileSync(new URL('../src/data/catalog.json', import.meta.url)));
  const planningCatalog = JSON.parse(fs.readFileSync(new URL('../../planning/catalog.json', import.meta.url)));
  for (const id of ['landing', 'portfolio']) {
    for (const source of [catalog, sourceCatalog, planningCatalog]) {
      assert.equal(source.products.find(product => product.id === id).price.amount, 300000);
    }
    const quote = estimateWebsite(catalog, id);
    assert.equal(quote.deposit, 150000);
    const brief = briefText(catalog, { product: id }, { productId: id, quantities: {} });
    assert.match(brief, /Estimasi sekali bayar: Rp300\.000/);
    assert.match(brief, /DP indikatif: Rp150\.000/);
  }
  assert.match(pricingPage(), /data-estimate-total>Rp300\.000/);
  assert.match(pricingPage(), /data-estimate-deposit>Rp150\.000/);
  assert.equal(catalog.products.find(product => product.id === 'saji').price.amount, 500000);
});

test('every carousel demo advertises its own package and honest pricing mode', () => {
  assert.deepEqual(heroSlides.map(slide => slide.id), demos.map(demo => demo.id));
  for (const slide of heroSlides) {
    const demo = demos.find(item => item.id === slide.id);
    const query = new URL(slide.consultationRoute, 'https://local.test').searchParams;
    assert.equal(query.get('demo'), demo.id);
    assert.equal(query.get('product'), demo.productId);
    if (demo.kind === 'industry') {
      const sector = catalog.industries.find(item => item.id === demo.industryId);
      assert.equal(slide.price.amount, sector.budgetIndication.min);
      assert.equal(slide.price.max, sector.budgetIndication.max);
      assert.match(slide.priceLabel, /Indikasi budget/);
      assert.equal(slide.packageRoute, '/solusi/' + sector.id + '/');
    } else {
      const product = catalog.products.find(item => item.id === demo.productId);
      assert.deepEqual(slide.price, product.price);
      assert.equal(slide.packageRoute, '/layanan/' + product.id + '/');
    }
  }
  assert.equal(heroPrice(heroSlides.find(slide => slide.id === 'custom')), 'Setelah konsultasi');
  assert.equal(heroPrice(heroSlides.find(slide => slide.id === 'erp-pilot')), 'Mulai Rp3.000.000');
  const fallback = renderHeroCarousel();
  assert.match(fallback, /data-hero-demo href="\/demo\/landing\/"/);
  assert.match(fallback, /data-hero-price>Rp300\.000/);
  assert.equal((fallback.match(/data-hero-slide=/g) || []).length, 30);
  assert.equal((fallback.match(/aria-roledescription="slide"/g) || []).length, 30);
  assert.doesNotMatch(fallback, /data-hero-choice|data-hero-controls|data-hero-previous|data-hero-next|data-hero-position/);
});
