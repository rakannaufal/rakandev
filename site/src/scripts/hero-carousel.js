import { heroSlides } from '../data/hero-slides.mjs';
import { heroPrice } from '../lib/hero-carousel.mjs';

export function initializeHeroCarousel() {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root) return;
  const find = selector => root.querySelector(selector);
  const slides = [...root.querySelectorAll('[data-hero-slide]')];
  const backgrounds = [...root.querySelectorAll('[data-hero-background]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const play = find('[data-hero-play]');
  let index = 0, timer, request = 0, playing = !reducedMotion.matches;
  let focused = false, hovered = false, visible = true, touching = false;
  let explicitPlayback = false;

  const canAdvance = () => playing && (explicitPlayback || (!focused && !hovered)) && !touching && visible && !document.hidden;

  function schedule() {
    clearTimeout(timer);
    if (canAdvance()) {
      timer = setTimeout(() => show(index + 1), 8000);
    }
  }
  function syncPlayback() {
    play.setAttribute('aria-label', playing ? 'Jeda pergantian demo otomatis' : 'Putar demo otomatis');
    play.title = play.getAttribute('aria-label');
    find('[data-hero-play-label]').textContent = playing ? 'Jeda' : 'Putar';
    find('[data-hero-pause-icon]').innerHTML = playing
      ? '<path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
      : '<path d="m9 5 10 7-10 7V5Z" fill="currentColor"/>';
    schedule();
  }
  async function ready(target) {
    const images = [...slides[target].querySelectorAll('img'), backgrounds[target]];
    for (const image of images) {
      if (image.dataset.src) { image.src = image.dataset.src; image.removeAttribute('data-src'); }
      image.loading = 'eager';
    }
    await Promise.all(images.map(image => image.decode()));
  }
  async function show(next) {
    const target = (next + heroSlides.length) % heroSlides.length;
    const currentRequest = ++request;
    clearTimeout(timer);
    if (target === index) { root.removeAttribute('aria-busy'); schedule(); return; }
    root.setAttribute('aria-busy', 'true');
    try {
      await ready(target);
      // Ignore image loads superseded by a visibility change.
      if (currentRequest !== request) return;
      if (!canAdvance()) return;
      const slide = heroSlides[target];
      slides[index].hidden = true;
      backgrounds[index].classList.remove('is-active');
      index = target;
      slides[index].hidden = false;
      backgrounds[index].classList.add('is-active');
      root.dataset.activeDemo = slide.id;
      root.dataset.priceMode = slide.price.mode;
      find('[data-hero-price-label]').textContent = slide.priceLabel;
      find('[data-hero-price]').textContent = heroPrice(slide);
      find('[data-hero-package]').href = slide.packageRoute;
      find('[data-hero-demo]').href = slide.route;
      find('[data-hero-consult]').href = slide.consultationRoute;
      find('[data-hero-message]').hidden = true;
    } catch {
      if (currentRequest !== request) return;
      playing = false;
      const message = find('[data-hero-message]');
      message.textContent = 'Gambar demo berikutnya belum dapat dimuat. Muat ulang halaman untuk mencoba lagi.';
      message.hidden = false;
      syncPlayback();
    } finally {
      if (currentRequest === request) { root.removeAttribute('aria-busy'); schedule(); }
    }
  }

  play.hidden = false;
  root.dataset.activeDemo = heroSlides[0].id;
  play.addEventListener('click', () => {
    playing = !playing;
    // An explicit start works while the playback control still has focus.
    explicitPlayback = playing;
    syncPlayback();
  });
  root.addEventListener('focusin', event => {
    focused = true;
    if (!event.target.closest('[data-hero-play]')) explicitPlayback = false;
    schedule();
  });
  root.addEventListener('focusout', event => {
    focused = root.contains(event.relatedTarget);
    if (!focused) explicitPlayback = false;
    schedule();
  });
  root.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; explicitPlayback = false; schedule(); }
  });
  root.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  root.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') { touching = true; schedule(); }
  });
  const finishTouch = () => { touching = false; schedule(); };
  document.addEventListener('pointerup', finishTouch);
  document.addEventListener('pointercancel', finishTouch);
  document.addEventListener('visibilitychange', () => {
    // Discard image loads started by autoplay while the tab was visible.
    if (document.hidden) {
      request++;
      root.removeAttribute('aria-busy');
    }
    schedule();
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { playing = false; syncPlayback(); } });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.15 }).observe(root);
  }
  syncPlayback();
}
