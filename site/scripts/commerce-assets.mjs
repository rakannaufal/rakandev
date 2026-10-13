import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root=path.resolve('public/assets/commerce/photos');
const photos=[
  ['rice-bowl','photo-1511690743698-d9d85f2fbf38'],['grill','photo-1555939594-58d7cb561ad1'],
  ['salad','photo-1546069901-ba9599a7e63c'],['toast','photo-1525351484163-7529414344d8'],
  ['pancake','photo-1528207776546-365bb710ee93'],['dumpling','photo-1563245372-f21724e3856d'],
  ['pizza','photo-1565299624946-b28f40a0ae38'],['cookies','photo-1499636136210-6f4ee915583e'],
  ['cake','photo-1565958011703-44f9829ba187'],['coffee','photo-1509042239860-f550ce710b93'],
  ['drink','photo-1551024709-8f23befc6f87'],['bakery','photo-1509440159596-0249088772ff'],
  ['coffee-beans','photo-1447933601403-0c6688de566e'],['homeware','photo-1600210492486-724fe5c67fb0'],
  ['mug','photo-1514228742587-6b1558fcca3d'],['vase','photo-1578500494198-246f612d3b3d'],
  ['lamp','photo-1507473885765-e6ed057f782c'],['chair','photo-1598300042247-d088f8ab3a91'],
  ['plant','photo-1485955900006-10f4d324d411'],['linen','photo-1600369671236-e74521d4b6ad'],
  ['cup','photo-1495474472287-4d71bcdd2085'],['basket','photo-1586023492125-27b2c045efd7'],
  ['portrait','photo-1506794778202-cad84cf45f1d'],['workshop','photo-1516035069371-29a1b244cc32'],
  ['market','photo-1555529669-e69e7aa0ba9a'],
];
await fs.mkdir(root,{recursive:true});
const added=[],failures=[];
for(let i=0;i<photos.length;i+=4){
  await Promise.all(photos.slice(i,i+4).map(async([name,id])=>{
    try{
      const source=`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`;
      const file=path.join(root,name+'.webp');
      try{await fs.access(file);}catch{
        const r=await fetch(source,{signal:AbortSignal.timeout(30000)});
        if(!r.ok)throw new Error('HTTP '+r.status);
        await sharp(Buffer.from(await r.arrayBuffer())).rotate().resize(1400,1050,{fit:'cover'}).webp({quality:84}).toFile(file);
      }
      added.push({file:'/assets/commerce/photos/'+name+'.webp',source:'https://images.unsplash.com/'+id,dimensions:[1400,1050],purpose:'commerce-photography',provenance:'Unsplash photograph '+id,license:'Unsplash License: https://unsplash.com/license',date:'2026-10-13'});
      console.log(name+': ready');
    }catch(e){failures.push({name,error:e.message});}
  }));
}
const mf=path.resolve('public/assets/manifest.json'),manifest=JSON.parse(await fs.readFile(mf,'utf8'));
manifest.assets=manifest.assets.filter(a=>!added.some(b=>b.file===a.file));manifest.assets.push(...added);manifest.updated='2026-10-13';
await fs.writeFile(mf,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({photos:added.length,failures}));
if(failures.length)process.exitCode=1;
