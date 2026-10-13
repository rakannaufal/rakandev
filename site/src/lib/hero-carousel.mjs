import { heroSlides } from '../data/hero-slides.mjs';
import { rupiah } from './pricing.mjs';
import { esc, icon } from './utils.mjs';

export function heroPrice(slide) {
  if (slide.price.mode === 'range') return rupiah(slide.price.amount) + ' - ' + rupiah(slide.price.max);
  return (slide.price.mode === 'starting' ? 'Mulai ' : '') + rupiah(slide.price.amount);
}

export function renderHeroCarousel() {
  const first = heroSlides[0];
  return `<section class="hero hero-carousel" data-hero-carousel data-price-mode="${first.price.mode}" role="region" aria-roledescription="karusel" aria-labelledby="hero-title">
    <div class="hero-carousel-backgrounds" aria-hidden="true">${heroSlides.map((slide, i) => `<img data-hero-background="${esc(slide.id)}" class="${i === 0 ? 'is-active' : ''}" ${i ? 'data-src' : 'src'}="${slide.cover}" width="1200" height="750" alt="" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async">`).join('')}</div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <h1 id="hero-title">Bikin usahamu<br><span class="rd-swash">layak dilirik.</span></h1>
        <p class="hero-description">Desain yang punya karakter. Pilih contoh, coba alurnya, temukan paket untuk usahamu.</p>
        <div class="hero-actions"><a class="button primary" data-hero-consult href="${esc(first.consultationRoute)}">Konsultasi kebutuhan ${icon('arrow-right', 18)}</a><a class="button secondary" data-hero-demo href="${first.route}">Coba demo ini ${icon('arrow-right', 18)}</a></div>
        <div class="hero-price"><span data-hero-price-label>${esc(first.priceLabel)}</span><strong data-hero-price>${esc(heroPrice(first))}</strong><a data-hero-package href="${first.packageRoute}">Lihat isi paket ${icon('arrow-right', 18)}</a></div>
      </div>
      <div class="hero-art hero-carousel-art" data-hero-stage aria-live="off">${heroSlides.map((slide, i) => `<article class="hero-carousel-slide ${slide.screenshot ? 'is-screenshot' : ''}" data-hero-slide="${esc(slide.id)}" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${heroSlides.length}: ${esc(slide.name)}" ${i ? 'hidden' : ''}>
        <a class="hero-carousel-work" href="${slide.route}" aria-label="Coba demo ${esc(slide.name)}"><figure><div class="hero-carousel-work-image"><img ${i ? 'data-src' : 'src'}="${slide.artwork}" width="${slide.screenshot ? 1200 : 1400}" height="${slide.screenshot ? 750 : 1050}" alt="${esc(slide.screenshot ? 'Tampilan demo ' + slide.name : 'Foto atau artwork pada demo ' + slide.name)}" loading="${i ? 'lazy' : 'eager'}" ${i ? '' : 'fetchpriority="high"'} decoding="async"></div><figcaption><div><span>${esc(slide.category)}</span><b>${esc(slide.name)}</b></div><span class="hero-carousel-work-arrow">${icon('arrow-right', 24)}</span></figcaption></figure></a>
        <div class="hero-carousel-preview"><img ${i ? 'data-src' : 'src'}="${slide.cover}" width="1200" height="750" alt="" loading="${i ? 'lazy' : 'eager'}"><span>${esc(slide.title)}</span></div>
      </article>`).join('')}
        <span class="hero-carousel-signature" aria-hidden="true">dibuat dengan perhatian</span>
        <button type="button" class="hero-carousel-pause" data-hero-play aria-label="Jeda pergantian demo otomatis" title="Jeda pergantian demo otomatis" hidden><svg data-hero-pause-icon width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span class="sr-only" data-hero-play-label>Jeda</span></button>
      </div>
    </div>
    <p class="hero-carousel-message" data-hero-message role="status" hidden></p>
  </section>`;
}
