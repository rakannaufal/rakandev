import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDomain, registryUrl, checkDomain, checkDomainSuggestions, suggestDomainNames, estimateInfrastructure, infrastructureErrors, domainPlan, domainRegistration } from '../src/lib/infrastructure.mjs';
import { providerPricing } from '../src/lib/infrastructure-ui.mjs';
import { briefText } from '../src/lib/pricing.mjs';
import { catalog } from '../src/data/catalog.mjs';
test('domain checks only use valid registration names and fixed official registry hosts',()=>{
  assert.equal(normalizeDomain('  EXAMPLE.COM. '),'example.com');
  for(const input of ['https://example.com','example.com/path','a b.id','-abc.id','a..id','x'.repeat(64)+'.com','localhost','<img>.id'])assert.throws(()=>normalizeDomain(input));
  assert.equal(registryUrl('pandi.id').url,'https://rdap.pandi.id/rdap/domain/pandi.id');
  assert.equal(registryUrl('example.web.id').registry,'PANDI');
  assert.throws(()=>registryUrl('www.example.com'));assert.throws(()=>registryUrl('example.invalid'));
});
test('RDAP distinguishes registrations, not-found candidates, HTML blocks, errors and mismatched records',async()=>{
  const fetcher=(status,data)=>async()=>new Response(JSON.stringify(data),{status});
  assert.equal((await checkDomain('example.com',{fetcher:fetcher(200,{objectClassName:'domain',ldhName:'EXAMPLE.COM'})})).status,'registered');
  const candidate=await checkDomain('unused.com',{fetcher:fetcher(404,{errorCode:404})});assert.equal(candidate.status,'not-found');assert.match(candidate.message,/konfirmasi/);
  assert.equal((await checkDomain('unused.com',{fetcher:async()=>new Response(null,{status:404,headers:{'content-type':'application/rdap+json'}})})).status,'not-found');
  assert.equal((await checkDomain('unused.com',{fetcher:async()=>new Response(null,{status:404})})).status,'unknown');
  for(const [status,data]of [[404,{}],[200,{}],[200,{objectClassName:'domain',ldhName:'other.com'}],[429,{errorCode:429}],[500,{errorCode:500}]])assert.equal((await checkDomain('example.com',{fetcher:fetcher(status,data)})).status,'unknown');
  assert.equal((await checkDomain('example.com',{fetcher:async()=>new Response('<html>blocked</html>',{status:404})})).status,'unknown');
  assert.equal((await checkDomain('example.com',{fetcher:async()=>{throw new Error('network');}})).status,'unknown');
});
test('cancelled checks propagate cancellation instead of writing an unknown result',async()=>{
  const c=new AbortController();c.abort();await assert.rejects(checkDomain('example.com',{signal:c.signal,fetcher:async(_,{signal})=>{signal.throwIfAborted();}}));
});
test('free static hosting and custom domain can coexist; regular hosting never silently applies promo',()=>{
  const base={product:'portfolio',domainMode:'free',hostingId:'free',hostingMonths:'12'};
  assert.equal(estimateInfrastructure(base).total,0);assert.deepEqual(infrastructureErrors(base),{});
  const custom={...base,domainMode:'custom',domainName:'rdexample.com',domainYears:'2'};
  const before=estimateInfrastructure(custom,new Date('2026-10-13T00:00:00Z'));assert.equal(before.domainCost,390000);assert.equal(before.hostingCost,0);
  assert.equal(before.domainSubtotal,346000);assert.equal(before.domainTax,38060);assert.equal(before.domainRounding,5940);assert.equal(before.domainCost,before.domainSubtotal+before.domainTax+before.domainRounding);
  const after=estimateInfrastructure(custom,new Date('2026-10-15T00:00:00Z'));assert.equal(after.domainCost,390000);
  assert.equal(domainRegistration(domainPlan('rdexample.com'),new Date('2026-10-14T16:59:59Z')),155000);
  assert.equal(domainRegistration(domainPlan('rdexample.com'),new Date('2026-10-14T17:00:00Z')),155000);
  assert.match(providerPricing(),/data-domain-registration="com"/);
  assert.equal(estimateInfrastructure({...custom,hostingId:'entry',hostingMonths:'6'}).hostingCost,150000);
  assert.equal(estimateInfrastructure({...custom,hostingId:'small',hostingMonths:'24'}).hostingCost,1200000);
  assert.ok(infrastructureErrors({...base,hostingId:'entry'}).hostingId);
  assert.ok(infrastructureErrors({...base,product:'erp-pilot'}).hostingId);
});
test('unknown renewal or infrastructure requires confirmation, never a misleading zero total',()=>{
  const q=estimateInfrastructure({domainMode:'custom',domainName:'myname.dev',domainYears:'2',hostingId:'custom'});
  assert.equal(q.domainCost,null);assert.equal(q.total,null);
  const one=estimateInfrastructure({domainMode:'custom',domainName:'myname.web.id',domainYears:'1',hostingId:'entry',hostingMonths:'1'});
  assert.equal(one.total,40000);assert.equal(one.renewalDomain,65000);
  assert.equal(estimateInfrastructure({domainMode:'owned',domainName:'example.com',hostingId:'owned'}).total,null);
});
test('consultation preserves duration, source, specifications and actual domain result separately from jasa',()=>{
  const data={name:'Rakan',business:'Contoh',contact:'rakan@example.com',goal:'Landing page usaha.',consent:true,product:'landing',domainMode:'custom',domainName:'example.com',domainYears:'1',hostingId:'entry',hostingMonths:'6',traffic:'2.000 kunjungan/bulan',hostingNeeds:'Server Indonesia',domainCheck:{domain:'example.com',status:'registered',checkedAt:'2026-10-13T00:00:00Z'}};
  const text=briefText(catalog,data);assert.match(text,/Harga acuan: Rp300\.000/);assert.match(text,/6 bulan/);assert.match(text,/Rp150.000/);assert.match(text,/Spesifikasi acuan/);assert.match(text,/Terdaftar/);assert.match(text,/Server Indonesia/);
  assert.match(text,/Subtotal domain: Rp137.000/);assert.match(text,/PPN domain 11%: Rp15.070/);assert.match(text,/Pembulatan ke atas: Rp2.930/);assert.match(text,/Rp155.000/);
  assert.doesNotMatch(text,/Rumahweb|Hostinger|Cloudflare|undefined/);
  const stale=briefText(catalog,{...data,domainCheck:{...data.domainCheck,domain:'different.com'}});assert.doesNotMatch(stale,/Cek registry terakhir/);
});
test('domain alternatives are distinct registrable names, respect label limits and exclude the requested domain',()=>{
  const names=suggestDomainNames('rakandev.com');
  assert.equal(names.length,6);assert.equal(new Set(names).size,6);assert.ok(!names.includes('rakandev.com'));
  assert.ok(names.includes('rakandev.id'));assert.ok(names.includes('rakandevstudio.com'));
  assert.ok(suggestDomainNames('rakandev.web.id').includes('rakandev.com'));
  assert.ok(suggestDomainNames('x'.repeat(63)+'.com').every(name=>name.split('.')[0].length<=63));
  assert.throws(()=>suggestDomainNames('www.rakandev.com'));assert.throws(()=>suggestDomainNames('https://bad.com'));
  for(const name of names)assert.doesNotThrow(()=>registryUrl(name));
});
test('domain alternatives retain real statuses, use a bounded pool and report each result',async()=>{
  let active=0,peak=0;const seen=[];
  const fetcher=async url=>{
    active++;peak=Math.max(peak,active);await new Promise(resolve=>setTimeout(resolve,5));active--;
    const name=decodeURIComponent(url.split('/').at(-1));
    return name.endsWith('.id')?new Response('{"errorCode":404}',{status:404}):new Response(JSON.stringify({objectClassName:'domain',ldhName:name}));
  };
  const results=await checkDomainSuggestions('rakandev.com',{fetcher,concurrency:2,onResult:result=>seen.push(result.domain)});
  assert.equal(results.length,6);assert.equal(seen.length,6);assert.equal(peak,2);
  assert.deepEqual(results.map(result=>result.domain),suggestDomainNames('rakandev.com'));
  assert.equal(results.filter(result=>result.status==='not-found').length,3);
  const unknown=await checkDomainSuggestions('rakandev.com',{limit:2,fetcher:async()=>new Response('{"errorCode":429}',{status:429})});assert.ok(unknown.every(result=>result.status==='unknown'));
});
test('aborting suggestions prevents pending results from being reported',async()=>{
  const controller=new AbortController();let reported=0;
  await assert.rejects(checkDomainSuggestions('rakandev.com',{signal:controller.signal,fetcher:async()=>{controller.abort();return new Response('{"errorCode":404}',{status:404});},onResult:()=>reported++}));
  assert.equal(reported,0);
});
