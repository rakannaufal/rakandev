import test from 'node:test';
import assert from 'node:assert/strict';
import { commerceOffers, commerceItems } from '../src/data/commerce.mjs';
import { catalog } from '../src/data/catalog.mjs';
import { scopeFor, scopeBriefLines } from '../src/lib/brief-builder.mjs';
import { staticProducts } from '../src/data/infrastructure.mjs';
import { estimateWebsite } from '../src/lib/pricing.mjs';
import { commerceSeed, validCommerce, addCommerce, changeCommerce, commerceQuote, checkoutCommerce,
  confirmCommerce, expireCommerce, expireDueCommerce, updateCommerceOrder, setCommerceAvailability,
  checkInCommerce, canCommerceDownload, blockCommerceSlot, requestCommerceSchedule,
  approveCommerceSchedule, moderateCommerceProduct } from '../src/lib/commerce-state.mjs';

const now=Date.now();
const future=days=>new Date(now+days*86400000).toISOString().slice(0,10);
const details={name:'Pelanggan contoh',contact:'contoh@example.com',level:'automatic',method:'pickup'};
const paid=(state,order,time=now)=>confirmCommerce(state,{orderId:order.id,amount:order.total,eventId:'paid-'+order.id,now:time});

test('seven offers start at 500k, separate automation, retain three revisions and guided scope',()=>{
  assert.equal(commerceOffers.length,7);
  assert.equal(Math.min(...commerceOffers.map(o=>o.starter)),500000);
  for(const o of commerceOffers)for(const level of ['starter','automatic']){
    const id=o.key+(level==='automatic'?'-qris':'');
    const p=catalog.products.find(p=>p.id===id),scope=scopeFor(id);
    assert.equal(p.price.amount,o[level]);assert.equal(p.limits.revisions,3);
    assert.ok(scope.isWebsite);assert.equal(scope.sections.length,level==='automatic'?4:3);
    assert.match(scopeBriefLines({},scope).join('\n'),/Batas paket:/);
    assert.equal(staticProducts.includes(id),level==='starter');
    assert.equal(estimateWebsite(catalog,id).total,o[level]);
  }
});

test('cart variants, toppings, quantity and totals stay independent of the input state',()=>{
  const original=commerceSeed('saji');let s=addCommerce(original,'bowl',{quantity:2,extra:1});
  s=addCommerce(s,'bowl',{extra:2});assert.equal(s.cart.length,2);
  assert.equal(commerceQuote(s).subtotal,125000);assert.equal(original.cart.length,0);
  s=changeCommerce(s,0,1);assert.equal(commerceQuote(s).subtotal,85000);
  assert.throws(()=>addCommerce(s,'bowl',{extra:3}));assert.throws(()=>addCommerce(s,'bowl',{quantity:21}));
});

test('last stock cannot be oversold; hiding and restoring a product never overwrites reservations',()=>{
  let s=addCommerce(commerceSeed('luma'),'mug',{quantity:20});let r=checkoutCommerce(s,details,undefined,now);s=r.state;
  assert.equal(s.stock.mug,4);s=setCommerceAvailability(s,'mug');assert.throws(()=>addCommerce(s,'mug'));
  s=setCommerceAvailability(s,'mug');assert.equal(s.stock.mug,4);
  s=addCommerce(s,'mug',{quantity:4});r=checkoutCommerce(s,details,undefined,now+1);s=r.state;
  assert.equal(s.stock.mug,0);assert.throws(()=>addCommerce(s,'mug'));
  s=expireCommerce(s,r.order.id);assert.equal(s.stock.mug,4);assert.ok(validCommerce(s,'luma'));
});

test('payment verifies amount, is idempotent, and late payment cannot reclaim released stock',()=>{
  const r=checkoutCommerce(addCommerce(commerceSeed('saji'),'bowl'),details,undefined,now);
  assert.throws(()=>confirmCommerce(r.state,{orderId:r.order.id,amount:1,eventId:'bad',now}));
  let s=paid(r.state,r.order);s=paid(s,r.order);
  assert.equal(s.events.length,1);assert.equal(s.orders[0].payment,'paid');assert.equal(s.stock.bowl,23);
  let late=expireDueCommerce(r.state,r.order.expires);assert.equal(late.stock.bowl,24);
  late=paid(late,r.order,r.order.expires+1);assert.equal(late.orders[0].payment,'review');assert.equal(late.stock.bowl,24);
  assert.ok(validCommerce(late,'saji'));
});

test('starter confirmations remain manual; cancellation and refund release inventory once',()=>{
  const r=checkoutCommerce(addCommerce(commerceSeed('saji'),'bowl'),{...details,level:'starter'},undefined,now);
  let s=expireDueCommerce(r.state,r.order.expires+1);assert.equal(s.orders[0].payment,'pending');
  s=paid(s,r.order,r.order.expires+1);s=updateCommerceOrder(s,r.order.id,'refund');assert.equal(s.stock.bowl,24);
  assert.throws(()=>updateCommerceOrder(s,r.order.id,'refund'));assert.ok(validCommerce(s,'saji'));
  const cancelled=updateCommerceOrder(r.state,r.order.id,'cancel');assert.equal(cancelled.stock.bowl,24);
  assert.throws(()=>updateCommerceOrder(cancelled,r.order.id,'cancel'));
});

test('delivery and coupons use explicit prices and invalid coupons fail',()=>{
  const s=addCommerce(commerceSeed('luma'),'mug',{quantity:2});
  const q=commerceQuote(s,{...details,method:'delivery',zone:'jakarta',coupon:'hemat10'});
  assert.equal(q.subtotal,170000);assert.equal(q.shipping,25000);assert.equal(q.discount,10000);assert.equal(q.total,185000);
  assert.throws(()=>commerceQuote(s,{...details,coupon:'SALAH'}));
  assert.throws(()=>commerceQuote(s,{...details,method:'delivery',zone:'unknown'}));
  assert.throws(()=>checkoutCommerce(s,{...details,method:'delivery',zone:'jakarta'},undefined,now));
});

test('manual shipment tracking is attached to a paid order without changing its invoice',()=>{
  const r=checkoutCommerce(addCommerce(commerceSeed('luma'),'mug'),details,undefined,now);
  assert.throws(()=>updateCommerceOrder(r.state,r.order.id,'tracking','RD123'));
  const s=updateCommerceOrder(paid(r.state,r.order),r.order.id,'tracking','Kurir contoh / RD123');
  assert.equal(s.orders[0].tracking,'Kurir contoh / RD123');assert.equal(s.orders[0].total,85000);
  assert.equal(s.orders[0].fulfillment,'shipped');assert.ok(validCommerce(s,'luma'));
  assert.throws(()=>updateCommerceOrder(s,r.order.id,'refund'));
});

test('booking enforces one service, duration, staff conflicts, blocked slots, deposit and reschedule approval',()=>{
  const booking={...details,date:future(2),slot:'09:00',staff:'Mira',paymentMode:'deposit'};
  const r=checkoutCommerce(addCommerce(commerceSeed('sela'),'studio'),booking,undefined,now);
  assert.equal(r.order.total,125000);assert.equal(r.order.balance,125000);
  assert.throws(()=>addCommerce(addCommerce(commerceSeed('sela'),'studio'),'studio'));
  let s=paid(r.state,r.order);
  assert.throws(()=>checkoutCommerce(addCommerce(s,'studio'),booking,undefined,now+1));
  assert.throws(()=>checkoutCommerce(addCommerce(s,'workspace'),{...booking,slot:'15:00'},undefined,now+1));
  s=blockCommerceSlot(s,{date:future(3),slot:'11:00',staff:'Semua'},now);
  assert.throws(()=>checkoutCommerce(addCommerce(s,'portrait'),{...booking,date:future(3),slot:'11:00'},undefined,now+1));
  s=requestCommerceSchedule(s,r.order.id,{date:future(4),slot:'13:00'},now);
  assert.equal(s.orders[0].details.date,booking.date);
  s=approveCommerceSchedule(s,r.order.id,now);assert.equal(s.orders[0].details.date,future(4));
  assert.equal(s.orders[0].reschedule,undefined);assert.ok(validCommerce(s,'sela'));
});

test('pre-order rejects invalid dates, H-0, and daily production above 12 packs',()=>{
  const s=addCommerce(commerceSeed('bekal'),'bread-box',{quantity:12});
  for(const date of ['2026-02-30',future(0)])assert.throws(()=>checkoutCommerce(s,{...details,date},undefined,now));
  const r=checkoutCommerce(s,{...details,date:future(2)},undefined,now);
  assert.throws(()=>checkoutCommerce(addCommerce(r.state,'bread-box'),{...details,date:future(2)},undefined,now+1));
  const next=checkoutCommerce(addCommerce(r.state,'bread-box'),{...details,date:future(3)},undefined,now+1);assert.ok(validCommerce(next.state,'bekal'));
});

test('marketplace checks out one seller, retains the rest, then moderates listings',()=>{
  const a=commerceItems.temu[0],b=commerceItems.temu.find(p=>p.merchant!==a.merchant);
  let s=addCommerce(addCommerce(commerceSeed('temu'),a.id),b.id);
  assert.throws(()=>checkoutCommerce(s,details,undefined,now));
  const r=checkoutCommerce(s,details,a.merchant,now);s=r.state;
  assert.equal(r.order.merchant,a.merchant);assert.equal(s.cart.length,1);assert.equal(s.cart[0].id,b.id);
  s=moderateCommerceProduct(s,b.id,'pending');assert.throws(()=>checkoutCommerce(s,details,b.merchant,now+1));
  s=moderateCommerceProduct(s,b.id,'approved');const approved=checkoutCommerce(s,details,b.merchant,now+1);
  assert.ok(validCommerce(approved.state,'temu'));
});

test('digital access requires automatic paid order, purchased file and unexpired link',()=>{
  const r=checkoutCommerce(addCommerce(commerceSeed('karya'),'content'),details,undefined,now);
  assert.equal(canCommerceDownload(r.state,r.order.id,'content',now),false);
  const s=paid(r.state,r.order);assert.equal(canCommerceDownload(s,r.order.id,'content',now),true);
  assert.equal(canCommerceDownload(s,r.order.id,'brief',now),false);
  assert.equal(canCommerceDownload(s,r.order.id,'content',now+86400000),false);
  const starter=checkoutCommerce(addCommerce(commerceSeed('karya'),'content'),{...details,level:'starter'},undefined,now);
  assert.equal(canCommerceDownload(paid(starter.state,starter.order),starter.order.id,'content',now),false);
  assert.equal(commerceItems.karya[0].fileContent.trim().split('\n').length,31);
});

test('tickets keep participant names and refuse unpaid or duplicate check-in',()=>{
  const r=checkoutCommerce(addCommerce(commerceSeed('panggung'),'puls',{quantity:2}),{...details,participants:' Mira \n Adi '},undefined,now);
  assert.equal(r.order.details.participants,'Mira\nAdi');const code=r.order.id+'-T1';
  assert.throws(()=>checkInCommerce(r.state,code));let s=paid(r.state,r.order);s=checkInCommerce(s,code);
  assert.throws(()=>checkInCommerce(s,code));assert.throws(()=>checkInCommerce(s,r.order.id+'-T3'));
  assert.ok(validCommerce(s,'panggung'));
});

test('a used ticket cannot refund its whole order or release event capacity',()=>{
  const seed=commerceSeed('panggung');
  const r=checkoutCommerce(addCommerce(seed,'puls',{quantity:2}),{...details,participants:'Mira\nAdi'},undefined,now);
  const confirmed=paid(r.state,r.order);
  const refunded=updateCommerceOrder(confirmed,r.order.id,'refund');
  assert.equal(refunded.stock.puls,seed.stock.puls);
  assert.throws(()=>checkInCommerce(refunded,r.order.id+'-T1'));
  const checked=checkInCommerce(confirmed,r.order.id+'-T1');
  assert.throws(()=>updateCommerceOrder(checked,r.order.id,'refund'),/sudah digunakan/);
  assert.equal(checked.stock.puls,seed.stock.puls-2);
  assert.equal(checked.orders[0].payment,'paid');
  assert.ok(validCommerce(checked,'panggung'));
});

test('restore rejects malformed money, participants, variants, event IDs and inflated inventory',()=>{
  const r=checkoutCommerce(addCommerce(commerceSeed('luma'),'mug'),details,undefined,now);
  assert.ok(validCommerce(r.state,'luma'));
  const mutations=[s=>s.orders[0].total='85000',s=>delete s.orders[0].subtotal,s=>s.orders[0].lines[0].unit=-1,s=>s.orders[0].details.name={},s=>s.orders[0].lines[0].variant=99,s=>s.events=[{}],s=>s.downloads=[{bad:true}],s=>s.stock.mug=24,s=>s.orders[0].checkedIn=[1]];
  for(const mutate of mutations){const s=structuredClone(r.state);mutate(s);assert.equal(validCommerce(s,'luma'),false);}
});
