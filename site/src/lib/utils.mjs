export const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const icon = (name, size = 24) => `<img src="/assets/icons/${esc(name)}.svg" width="${size}" height="${size}" alt="" aria-hidden="true">`;
export const button = (label, href, secondary = false) => `<a class="button ${secondary ? 'secondary' : 'primary'}" href="${esc(href)}">${esc(label)}${icon('arrow-right', 18)}</a>`;
export const note = text => `<p class="note">${esc(text)}</p>`;
export const list = items => `<ul class="check-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
export const heading = (title, description = '', label = '') => `<section class="page-heading container">${label ? `<p class="kicker">${esc(label)}</p>` : ''}<h1>${esc(title)}</h1>${description ? `<p class="lede">${esc(description)}</p>` : ''}</section>`;
export const consult = (id = '', demo = '') => '/konsultasi/?' + new URLSearchParams({ ...(id ? { product: id } : {}), ...(demo ? { demo } : {}) }).toString();
