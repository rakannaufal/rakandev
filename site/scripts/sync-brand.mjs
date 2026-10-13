import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source=fileURLToPath(new URL('../../brand/',import.meta.url));
const site=fileURLToPath(new URL('../',import.meta.url));
const supplied=fileURLToPath(new URL('../../RakanDev-Logo-Assets/',import.meta.url));

export async function suppliedLogo(name='logo-horizontal'){
  return sharp(path.join(supplied,'01-PNG-Transparan',name+'.png')).trim().png().toBuffer();
}

async function syncSuppliedIdentity(destination,assets){
  for(const group of ['01-PNG-Transparan','02-PNG-Latar-Putih']){
    const target=path.join(destination,'supplied',group);
    await fs.mkdir(target,{recursive:true});
    for(const name of ['logo-horizontal','ikon-rd','teks-rakandev']){
      await fs.copyFile(path.join(supplied,group,name+'.png'),path.join(target,name+'.png'));
      const metadata=await sharp(path.join(target,name+'.png')).metadata();
      assets.push({file:'/assets/brand/supplied/'+group+'/'+name+'.png',alt:name,dimensions:[metadata.width,metadata.height],purpose:'brand',provenance:'Supplied RakanDev-Logo-Assets / '+group+'/'+name+'.png',license:'User-supplied brand asset',date:'2026-10-13'});
    }
  }
  for(const [name,alias,width]of [['logo-horizontal','rakandev-logo',840],['ikon-rd','rakandev-symbol',320],['teks-rakandev','rakandev-signature',840]]){
    const input=await suppliedLogo(name);
    const output=await sharp(input).resize({width,withoutEnlargement:true}).webp({lossless:true}).toFile(path.join(destination,alias+'.webp'));
    assets.push({file:'/assets/brand/'+alias+'.webp',alt:'RakanDev',dimensions:[output.width,output.height],purpose:'brand',provenance:'Lossless WebP export of supplied '+name+'.png; transparent padding trimmed',license:'User-supplied brand asset',date:'2026-10-13'});
  }
  const faviconSource=path.join(supplied,'favicon-source.png');
  await fs.copyFile(faviconSource,path.join(destination,'supplied','favicon-source.png'));
  const faviconMaster=await sharp(faviconSource).trim({threshold:10}).png().toBuffer();
  const faviconMetadata=await sharp(faviconSource).metadata();
  assets.push({file:'/assets/brand/supplied/favicon-source.png',alt:'RD',dimensions:[faviconMetadata.width,faviconMetadata.height],purpose:'brand',provenance:'Exact favicon image supplied by user on 2026-10-13',license:'User-supplied brand asset',date:'2026-10-13'});
  for(const [filename,size]of [['favicon-32.png',32],['favicon-192.png',192],['apple-touch-icon.png',180]]){
    await sharp(faviconMaster).resize(size-4,size-4,{fit:'contain',background:'#ffffff'}).extend({top:2,bottom:2,left:2,right:2,background:'#ffffff'}).png().toFile(path.join(destination,filename));
    const existing=assets.find(asset=>asset.file==='/assets/brand/'+filename);
    const entry={file:'/assets/brand/'+filename,alt:'Ikon RakanDev',dimensions:[size,size],purpose:'brand',provenance:'Favicon image supplied by user on 2026-10-13; whitespace trimmed, aspect ratio preserved',license:'User-supplied brand asset',date:'2026-10-13'};
    if(existing)Object.assign(existing,entry);else assets.push(entry);
  }
  await fs.copyFile(path.join(supplied,'palet-warna.json'),path.join(destination,'supplied-palette.json'));
}

export async function syncBrand(manifest){
  const identity=JSON.parse(await fs.readFile(path.join(source,'manifest.json'),'utf8'));
  const destination=path.join(site,'public/assets/brand');
  const styles=path.join(site,'src/styles/brand');
  await fs.mkdir(destination,{recursive:true});await fs.mkdir(path.join(styles,'fonts'),{recursive:true});
  await fs.copyFile(path.join(source,'design-system.css'),path.join(styles,'design-system.css'));
  await fs.copyFile(path.join(source,'tokens.json'),path.join(destination,'tokens.json'));
  const assets=[];
  async function copyLogo(filename,alias=filename){
    const original=path.join(source,'logos',filename),output=path.join(destination,alias);
    await fs.copyFile(original,output);
    const metadata=await sharp(output).metadata();
    assets.push({file:'/assets/brand/'+alias,alt:alias.includes('mark')?'Monogram RD menyatu':'RakanDev',dimensions:[metadata.width,metadata.height],purpose:'brand',provenance:'Exact export from RakanDev Brand Kit '+identity.version+' / '+filename,license:'Original RD composition; lettering under SIL Open Font License 1.1',date:'2026-10-13'});
  }
  for(const filename of await fs.readdir(path.join(source,'logos')))if(/\.(svg|png)$/.test(filename))await copyLogo(filename);
  const aliases={
    'rd-mark-plum.svg':'rakandev-mark-primary.svg','rd-mark-ink.svg':'rakandev-mark-primary.svg','rd-mark-white.svg':'rakandev-mark-white.svg',
    'rakandev-wordmark-plum.svg':'rakandev-horizontal-primary.svg','rakandev-wordmark-ink.svg':'rakandev-horizontal-primary.svg',
    'rd-mark.png':'rakandev-mark-primary.png','rakandev-wordmark.png':'rakandev-horizontal-primary.png',
  };
  for(const [alias,filename]of Object.entries(aliases))await copyLogo(filename,alias);
  for(const filename of await fs.readdir(path.join(source,'fonts'))){
    await fs.copyFile(path.join(source,'fonts',filename),path.join(styles,'fonts',filename));
    if(filename.endsWith('.txt'))await fs.copyFile(path.join(source,'fonts',filename),path.join(site,'public/assets/licenses',filename));
  }
  const icons=path.join(site,'public/assets/icons');
  for(const filename of await fs.readdir(icons))if(filename.endsWith('.svg')){
    const file=path.join(icons,filename),content=await fs.readFile(file,'utf8');
    await fs.writeFile(file,content.replace(/#202733/gi,'#086288'));
  }
  for(const filename of await fs.readdir(path.join(source,'icons')))await fs.copyFile(path.join(source,'icons',filename),path.join(icons,filename));
  await syncSuppliedIdentity(destination,assets);
  manifest.assets=manifest.assets.filter(asset=>asset.purpose!=='brand');manifest.assets.push(...assets);
  manifest.identityVersion='supplied-png-2026-10-13';manifest.identityPalette=identity.palette;
  await fs.writeFile(path.join(destination,'identity.json'),JSON.stringify({brand:identity.brand,version:manifest.identityVersion,palette:identity.palette,source:'RakanDev-Logo-Assets',preferredLogo:'/assets/brand/rakandev-logo.webp',preferredSymbol:'/assets/brand/rakandev-symbol.webp'},null,2)+'\n');
  return manifest.identityVersion;
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const filename=path.join(site,'public/assets/manifest.json'),manifest=JSON.parse(await fs.readFile(filename,'utf8'));
  const version=await syncBrand(manifest);await fs.writeFile(filename,JSON.stringify(manifest,null,2)+'\n');console.log('Integrated RakanDev Brand Kit '+version);
}
