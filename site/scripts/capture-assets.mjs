import { chromium, expect } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs';
import { demos } from '../src/data/demos.mjs';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4321';
const socialOnly=process.argv.includes('--social-only');
const browser=await chromium.launch({executablePath:process.env.QA_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1200,height:750},deviceScaleFactor:1,reducedMotion:'reduce'});
async function imagesReady(){
  await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await document.fonts.ready;await Promise.all([...document.images].filter(img=>img.getAttribute('src')).map(img=>img.decode().catch(()=>{})));});
  await expect.poll(()=>page.evaluate(()=>[...document.images].filter(img=>img.getAttribute('src')&&(!img.complete||!img.naturalWidth)).map(img=>img.src)),{timeout:12000}).toEqual([]);
}
const manifest=JSON.parse(fs.readFileSync('public/assets/manifest.json','utf8'));
manifest.assets=manifest.assets.filter(item=>item.purpose!=='social'&&(socialOnly||item.purpose!=='demo-cover'&&item.purpose!=='commerce-demo-cover'));
fs.mkdirSync('public/assets/demo-covers',{recursive:true});fs.mkdirSync('public/assets/social',{recursive:true});
for(const demo of socialOnly?[]:demos){await page.goto(origin+demo.route+'?embed=1',{waitUntil:'networkidle'});await imagesReady();
const missing=await page.evaluate(()=>[...document.images].filter(img=>img.getAttribute('src')&&!img.naturalWidth).map(img=>img.src));if(missing.length)throw new Error(demo.id+': '+missing.join(','));
const screenshot=await page.screenshot({animations:'disabled'});
const badge=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750"><rect x="1022" y="16" width="161" height="35" rx="7" fill="#086288"/><text x="1102" y="39" fill="white" text-anchor="middle" font-family="sans-serif" font-size="14">Demo RakanDev</text></svg>');
const file=demo.image.slice(1);await sharp(screenshot).composite([{input:badge}]).webp({quality:84}).toFile('public/'+file);
manifest.assets.push({file:demo.image,alt:'Tampilan demo '+demo.name,dimensions:[1200,750],purpose:'demo-cover',provenance:'Screenshot of working local demo '+demo.route+' with original RD badge',license:'RD original interface/artwork; embedded photography under Unsplash License; fonts OFL',date:'2026-10-13'});
console.log('Captured '+demo.id);}
await page.setViewportSize({width:1200,height:630});await page.goto(origin,{waitUntil:'networkidle'});await imagesReady();await page.screenshot({path:'public/assets/social/rakandev-og.png',animations:'disabled'});
manifest.assets.push({file:'/assets/social/rakandev-og.png',alt:'RakanDev: bikin usahamu layak dilirik, website Basic Rp300.000',dimensions:[1200,630],purpose:'social',provenance:'Screenshot composition of the redesigned RakanDev hero',license:'RD original interface/artwork; embedded photography under Unsplash License; fonts OFL',date:'2026-10-13'});
fs.writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');await browser.close();
