import type { APIRoute } from 'astro';
import { allRoutes } from '../lib/render.mjs';
export const GET: APIRoute = ({ site, url }) => {
  const base = site || new URL(url.origin);
  const routes = ['', ...allRoutes().filter(route => route !== 'demo' && !route.startsWith('demo/'))];
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + routes.map(route => '<url><loc>' + new URL('/' + (route ? route + '/' : ''), base).href + '</loc></url>').join('') + '</urlset>', { headers: { 'Content-Type': 'application/xml' } });
};
