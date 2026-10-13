import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site, url }) => new Response('User-agent: *\nDisallow: /demo/\nSitemap: ' + new URL('/sitemap.xml', site || url.origin).href + '\n', { headers: { 'Content-Type': 'text/plain' } });
