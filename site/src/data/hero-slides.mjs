import { catalog } from './catalog.mjs';
import { demos } from './demos.mjs';
import { commerceByKey } from './commerce.mjs';

const websiteArtwork = {
  landing: '/assets/photos/interior-hero.webp',
  portfolio: '/assets/artwork/studio-collage.webp',
  plus: '/assets/photos/renovasi-room.webp',
  profile: '/assets/photos/works-office.webp',
  custom: '/assets/artwork/mug-luma.webp',
};

export const heroSlides = demos.map(demo => {
  const product = catalog.products.find(item => item.id === demo.productId);
  const industry = catalog.industries.find(item => item.id === demo.industryId);
  const commerce = commerceByKey(demo.id);
  return {
    id: demo.id,
    name: demo.name,
    title: demo.title,
    category: demo.subtitle,
    kind: demo.kind,
    route: demo.route,
    cover: demo.image,
    artwork: websiteArtwork[demo.id] || commerce?.hero || demo.image,
    screenshot: !websiteArtwork[demo.id] && !commerce,
    productId: product.id,
    packageRoute: industry ? '/solusi/' + industry.id + '/' : '/layanan/' + product.id + '/',
    consultationRoute: '/konsultasi/?' + new URLSearchParams({ product: product.id, demo: demo.id }),
    price: industry ? { amount: industry.budgetIndication.min, max: industry.budgetIndication.max, mode: 'range' } : { ...product.price },
    priceLabel: industry ? 'Indikasi budget jasa / setelah discovery' : product.price.amount === null ? 'Scope dan harga dibahas bersama' : product.price.mode === 'starting' ? 'Harga awal untuk scope paket' : product.name + ' / sekali bayar',
  };
});
