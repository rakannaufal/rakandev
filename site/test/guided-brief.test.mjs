import test from 'node:test';
import assert from 'node:assert/strict';
import { scopeFor,scopeBriefLines } from '../src/lib/brief-builder.mjs';
import { estimateWebsite,briefText } from '../src/lib/pricing.mjs';
import { catalog } from '../src/data/catalog.mjs';
import { domainPlans,domainPricePolicy } from '../src/data/infrastructure.mjs';
import { demoConfig } from '../src/data/demos.mjs';
import { seedState,executeDemo,validState,totals } from '../src/lib/demo-state.mjs';

test('brief parts follow package scope and never charge included sections or pages twice',()=>{
  for(const [id,count] of [['landing',4],['portfolio',4],['plus',6],['profile',12]])assert.equal(scopeFor(id).sections.length,count);
  const plus=scopeFor('plus',{section:3});assert.equal(plus.sections.length,7);assert.equal(estimateWebsite(catalog,'plus',{section:3}).total,700000);
  const profile=scopeFor('profile',{page:3});assert.equal(profile.sections.length,13);assert.equal(estimateWebsite(catalog,'profile',{page:3}).total,900000);
  assert.equal(new Set(scopeFor('profile').sections.map(s=>s.id)).size,12);
  assert.equal(scopeFor('custom',{},['site-cms','site-shop']).features.length,2);
});
test('ERP feature briefs distinguish package limits from additional modules and custom choices',()=>{
  const pilot=scopeFor('erp-pilot',{},['sales','crm']);assert.ok(pilot.features.find(f=>f.id==='crm').included);assert.equal(pilot.features.find(f=>f.id==='sales').included,false);
  assert.equal(scopeFor('erp-custom').features.length,0);assert.equal(scopeFor('erp-zero').features.length,0);
  assert.equal(scopeFor('erp-custom',{},['pos','crm','bad']).features.length,2);
  const lines=scopeBriefLines({scopeAnswers:{sections:{opening:{brief:'Perkenalkan jasa renovasi',assets:'Foto tersedia'}},features:{}}},scopeFor('landing'));
  assert.ok(lines.some(x=>x.includes('Perkenalkan jasa renovasi')));assert.ok(lines.some(x=>x.includes('Bantu arahkan')));
  assert.match(briefText(catalog,{product:'portfolio',scopeAnswers:{sections:{},features:{}}},{productId:'portfolio',quantities:{}}),/3 putaran/);
});
test('domain prices include VAT and round upward to Rp5,000 without an additional service margin',()=>{
  assert.equal(domainPlans.length,20);assert.equal(domainPricePolicy.margin,0);assert.equal(domainPricePolicy.rounding,5000);assert.equal(domainPricePolicy.roundingDirection,'up');assert.equal(domainPricePolicy.promotionalRatesUsed,true);
  for(const plan of domainPlans){
    assert.equal(plan.registrationTax,Math.round(plan.registrationSubtotal*.11));
    for(const kind of ['registration','renewal']){
      assert.equal(plan[kind],plan[kind+'Subtotal']+plan[kind+'Tax']+plan[kind+'Rounding']);
      assert.equal(plan[kind]%5000,0);assert.ok(plan[kind+'Rounding']>=0&&plan[kind+'Rounding']<5000);
    }
  }
  const com=domainPlans.find(p=>p.tld==='com');assert.equal(com.registration,155000);assert.equal(com.registrationRounding,2930);assert.equal(com.renewal,235000);
  assert.equal(domainPlans.find(p=>p.tld==='my.id').registration,15000);assert.equal(domainPlans.find(p=>p.tld==='id').registration,245000);
});
test('partial payment updates cash, journal and outstanding balance, rejecting excess or duplicate payments',()=>{
  const config=demoConfig('erp-starter');let state=seedState(config);
  state=executeDemo(state,{type:'payment',data:{id:'invoice-1',amount:300000}},config).state;
  assert.equal(state.invoices[0].status,'Dibayar sebagian');assert.equal(state.invoices[0].paid,300000);assert.equal(totals(state).cash,2300000);
  assert.throws(()=>executeDemo(state,{type:'payment',data:{id:'invoice-1',amount:1200001}},config));assert.throws(()=>executeDemo(state,{type:'payment',data:{id:'invoice-1',amount:.5}},config));
  state=executeDemo(state,{type:'payment',data:{id:'invoice-1',amount:1200000}},config).state;
  assert.equal(state.invoices[0].status,'Lunas');assert.throws(()=>executeDemo(state,{type:'payment',data:{id:'invoice-1',amount:1}},config));assert.ok(validState(state,config));
});
test('variable stock transfers conserve inventory; timesheets and harvest use customer-entered quantities',()=>{
  const config=demoConfig('erp-operations');let state=seedState(config),total=totals(state).stock;
  for(const direction of ['Ke gudang kedua','Ke gudang utama'])state=executeDemo(state,{type:'transfer-quantity',data:{productId:'item-0',quantity:17,direction}},config).state;
  assert.equal(state.inventory[0].stock,100);assert.equal(totals(state).stock,total);
  assert.throws(()=>executeDemo(state,{type:'transfer-quantity',data:{productId:'item-0',quantity:999,direction:'Ke gudang utama'}},config));
  const pilot=demoConfig('erp-pilot');const time=executeDemo(seedState(pilot),{type:'project-time',data:{id:'project-1',hours:3}},pilot).state;assert.equal(time.projects[0].hours,5);
  const farm=demoConfig('industry-agribusiness');const harvest=executeDemo(seedState(farm),{type:'harvest',data:{id:'sector-2',quantity:45}},farm).state;assert.equal(harvest.sector[1].yield,45);assert.ok(validState(harvest,farm));
});
