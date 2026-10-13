import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { allRoutes } from '../src/lib/render.mjs';
import { demos } from '../src/data/demos.mjs';
const root=path.resolve('dist'),errors=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const files=walk(root),html=files.filter(file=>file.endsWith('.html'));
for(const route of ['',...allRoutes()])assert.ok(fs.existsSync(path.join(root,route,'index.html')),route);
for(const file of html){const text=fs.readFileSync(file,'utf8'),route=path.relative(root,file).replace(/index\.html$/,'');assert.ok(text.includes('lang="id"'),route);assert.ok(/<title>.+<\/title>/.test(text),route);assert.ok(text.includes('name="description"'),route);
  const content=text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]*>/g,'');
  if(/\$\{[^}]+\}|\b(?:undefined|NaN)\b/.test(content))errors.push(route+': unrendered value in page content');
  for(const match of text.matchAll(/(?:href|src)="([^"<>]+)"/g)){const value=match[1].replaceAll('&amp;','&');if(!value.startsWith('/'))continue;const url=new URL(value,'https://local.test');let target=path.join(root,decodeURIComponent(url.pathname));if(url.pathname.endsWith('/'))target=path.join(target,'index.html');if(!fs.existsSync(target)){errors.push(route+': missing '+value);continue;}if(url.hash&&target.endsWith('.html')){const targetText=fs.readFileSync(target,'utf8');if(!targetText.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'))errors.push(route+': missing anchor '+value);}}
  if(route.startsWith('demo/'))assert.ok(text.includes('noindex, nofollow'),route);
}
for(const file of files.filter(file=>file.endsWith('.css'))){for(const match of fs.readFileSync(file,'utf8').matchAll(/url\(["']?(\/assets\/[^)'"\s]+)["']?\)/g))if(!fs.existsSync(path.join(root,match[1])))errors.push('CSS missing '+match[1]);}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapPaths=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
for(const demo of demos)assert.ok(!sitemapPaths.includes(demo.route),'Demo included in sitemap: '+demo.route);
for(const file of files.filter(file=>/\.(html|js|json)$/.test(file)))assert.ok(!/sourceAssumedHours|sourceHash|hourlyRate|api\/leads|clientops-token|CLIENTOPS_/i.test(fs.readFileSync(file,'utf8')),'Internal source exposed: '+file);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(JSON.stringify({htmlPages:html.length,demoEntries:demos.length,internalLinks:'passed',assets:'passed',metadata:'passed',renderedContent:'passed',sitemap:'passed',privateSourceScan:'passed'}));
