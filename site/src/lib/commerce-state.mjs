import { commerceItems } from '../data/commerce.mjs';

export function commerceSeed(key){
  if(!commerceItems[key])throw new Error('Kategori tidak tersedia.');
  return {version:1,key,cart:[],orders:[],stock:Object.fromEntries(commerceItems[key].map(p=>[p.id,p.stock])),unavailable:{},moderation:{},events:[],downloads:[],blocks:[]};
}
const copy=s=>structuredClone(s);
const product=(state,id)=>commerceItems[state.key].find(p=>p.id===id);
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const dayAt=now=>new Date(now+7*60*60*1000).toISOString().slice(0,10);
const calendarDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const detailKeys=['name','contact','address','method','zone','date','slot','staff','paymentMode','level','note','table','coupon','participants'];
const detailLimit=k=>k==='participants'?2000:['note','address'].includes(k)?500:120;
const available=(s,id)=>!s.unavailable?.[id]&&(!s.moderation?.[id]||s.moderation[id]==='approved')&&s.stock[id]>0;
export function validCommerce(s,key){
  if(!object(s)||s.version!==1||s.key!==key||!Array.isArray(s.cart)||!Array.isArray(s.orders)||!Array.isArray(s.events)||!Array.isArray(s.downloads)||s.orders.length>100||s.cart.length>100||s.events.length>200||s.downloads.length>500)return false;
  const items=commerceItems[key];
  if(!items||!object(s.stock)||!items.every(p=>integer(s.stock[p.id],0,p.stock)))return false;
  if(s.unavailable&&(!object(s.unavailable)||!Object.entries(s.unavailable).every(([id,v])=>items.some(p=>p.id===id)&&typeof v==='boolean')))return false;
  if(s.moderation&&(!object(s.moderation)||!Object.entries(s.moderation).every(([id,v])=>key==='temu'&&items.some(p=>p.id===id)&&['pending','approved','rejected'].includes(v))))return false;
  if(!s.events.every(e=>typeof e==='string'&&e.length>0&&e.length<=150)||new Set(s.events).size!==s.events.length)return false;
  const lineOK=l=>{
    if(!object(l)||!items.some(p=>p.id===l.id)||!integer(l.quantity,1,key==='sela'?1:20))return false;
    try{return Number.isSafeInteger(linePrice(s,l));}catch{return false;}
  };
  if(!s.cart.every(lineOK))return false;
  const ids=new Set();
  const ordersOK=s.orders.every(o=>{
    if(!object(o)||typeof o.id!=='string'||o.id.length>100||ids.has(o.id)||!['pending','paid','expired','cancelled','refunded','review'].includes(o.payment)||!['new','preparing','ready','shipped','completed','cancelled'].includes(o.fulfillment)||!Array.isArray(o.lines)||!o.lines.length||o.lines.length>100||!o.lines.every(l=>lineOK(l)&&l.unit===linePrice(s,l))||!integer(o.created,0,Number.MAX_SAFE_INTEGER)||!integer(o.expires,o.created,Number.MAX_SAFE_INTEGER)||!object(o.details)||!Array.isArray(o.checkedIn))return false;
    if(!['subtotal','shipping','discount','grandTotal','total','balance'].every(k=>integer(o[k],0,100000000)))return false;
    if(o.subtotal!==o.lines.reduce((n,l)=>n+l.unit*l.quantity,0)||o.grandTotal!==o.subtotal+o.shipping-o.discount||o.grandTotal!==o.total+o.balance)return false;
    if(!Object.entries(o.details).every(([k,v])=>detailKeys.includes(k)&&typeof v==='string'&&v.length<=detailLimit(k))||!o.details.name||!o.details.contact||!['starter','automatic'].includes(o.details.level))return false;
    if(o.details.date&&!calendarDate(o.details.date))return false;
    if(key==='sela'&&(!['09:00','11:00','13:00','15:00'].includes(o.details.slot)||!['Mira','Adi','Tio'].includes(o.details.staff)||o.lines.length!==1||!o.details.date))return false;
    if(o.tracking!==undefined&&(typeof o.tracking!=='string'||o.tracking.length>100))return false;
    if(o.reschedule&&(!object(o.reschedule)||!calendarDate(o.reschedule.date)||!['09:00','11:00','13:00','15:00'].includes(o.reschedule.slot)))return false;
    const count=o.lines.reduce((n,l)=>n+l.quantity,0);
    if(!o.checkedIn.every(n=>key==='panggung'&&integer(n,1,count))||new Set(o.checkedIn).size!==o.checkedIn.length)return false;
    const seller=product(s,o.lines[0].id).merchant||null;
    if(o.merchant!==seller||o.lines.some(l=>(product(s,l.id).merchant||null)!==seller))return false;
    ids.add(o.id);return true;
  });
  if(!ordersOK)return false;
  for(const p of items){
    const reserved=s.orders.filter(o=>['pending','paid'].includes(o.payment)).reduce((n,o)=>n+o.lines.filter(l=>l.id===p.id).reduce((n,l)=>n+l.quantity,0),0);
    if(s.stock[p.id]!==p.stock-reserved)return false;
  }
  if(s.blocks&&(!Array.isArray(s.blocks)||s.blocks.length>100||!s.blocks.every(b=>object(b)&&calendarDate(b.date)&&['09:00','11:00','13:00','15:00'].includes(b.slot)&&['Semua','Mira','Adi','Tio'].includes(b.staff))))return false;
  return s.downloads.every(d=>object(d)&&typeof d.orderId==='string'&&ids.has(d.orderId)&&items.some(p=>p.id===d.productId)&&integer(d.time,0,Number.MAX_SAFE_INTEGER));
}

export function linePrice(state,line){
  const p=product(state,line.id);if(!p)throw new Error('Produk tidak tersedia.');
  const variantMax=p.variants?.length? p.variants.length-1 : state.key==='panggung'?2:state.key==='karya'?1:0;
  if(!integer(line.variant,0,variantMax)||!integer(line.extra,0,state.key==='saji'?2:0))throw new Error('Pilihan produk tidak valid.');
  const delta=state.key==='panggung'?line.variant*50000:state.key==='karya'?line.variant*25000:line.variant*(p.variantExtra||0);
  return p.price+delta+line.extra*5000;
}

export function addCommerce(state,id,{variant=0,extra=0,quantity=1}={}){
  const s=expireDueCommerce(state),p=product(s,id);if(!p||!available(s,id))throw new Error('Pilihan ini sedang habis.');
  if(!integer(quantity,1,20))throw new Error('Jumlah harus 1-20.');
  if(s.key==='sela'&&(quantity!==1||s.cart.length))throw new Error('Pilih satu layanan per reservasi. Hapus pilihan lama untuk mengganti.');
  if(s.key==='panggung'&&s.cart.some(l=>l.id!==id))throw new Error('Pilih satu acara per transaksi. Selesaikan atau hapus pilihan sebelumnya.');
  const candidate={id,variant:Number(variant),extra:Number(extra),quantity};linePrice(s,candidate);
  const existing=s.cart.find(l=>l.id===id&&l.variant===candidate.variant&&l.extra===candidate.extra);
  const total=s.cart.filter(l=>l.id===id).reduce((n,l)=>n+l.quantity,0)+quantity;
  if(total>s.stock[id]||total>20)throw new Error('Jumlah melebihi stok atau batas 20 per produk.');
  if(existing)existing.quantity+=quantity;else s.cart.push(candidate);
  return s;
}

export function changeCommerce(state,index,quantity){
  const s=copy(state),l=s.cart[index];if(!l)throw new Error('Isi keranjang berubah.');
  if(quantity===0){s.cart.splice(index,1);return s;}
  if(!integer(quantity,1,20))throw new Error('Jumlah harus 1-20.');
  if(s.key==='sela'&&quantity!==1)throw new Error('Satu layanan per reservasi.');
  const total=s.cart.filter((v,i)=>i!==index&&v.id===l.id).reduce((n,v)=>n+v.quantity,quantity);
  if(total>s.stock[l.id]||total>20)throw new Error('Jumlah melebihi stok yang tersedia.');
  l.quantity=quantity;return s;
}

export function commerceQuote(state,details={},merchant){
  const indexed=state.cart.map((line,index)=>({...line,index}));
  const lines=indexed.filter(l=>!merchant||product(state,l.id).merchant===merchant);
  const subtotal=lines.reduce((sum,l)=>sum+linePrice(state,l)*l.quantity,0);
  const delivery=['bekal','luma','temu'].includes(state.key)&&details.method==='delivery';
  const zones={bandung:15000,jakarta:25000,bogor:20000,depok:20000,tangerang:25000};
  if(delivery&&!Object.hasOwn(zones,details.zone))throw new Error('Pilih salah satu zona pengiriman.');
  const shipping=delivery?zones[details.zone]:0;
  const coupon=String(details.coupon||'').trim().toUpperCase(),code=state.key==='luma'?'HEMAT10':state.key==='karya'?'KARYA10':'';
  if(coupon&&(!code||details.level!=='automatic'||coupon!==code))throw new Error('Kode kupon tidak tersedia untuk pesanan ini.');
  const discount=coupon?Math.min(10000,Math.floor(subtotal*.1)):0;
  const grandTotal=subtotal+shipping-discount;
  const deposit=state.key==='sela'&&details.paymentMode==='deposit';
  return {lines,subtotal,shipping,discount,grandTotal,total:deposit?Math.ceil(grandTotal*.5):grandTotal,balance:deposit?grandTotal-Math.ceil(grandTotal*.5):0};
}

const minutes=t=>Number(t.split(':')[0])*60+Number(t.split(':')[1]);
function assertSchedule(s,details,lines,now){
  if(details.date&&(!calendarDate(details.date)||details.date<dayAt(now)))throw new Error('Pilih tanggal yang valid, hari ini atau setelahnya.');
  if(s.key==='sela'){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(details.date||'')||!['09:00','11:00','13:00','15:00'].includes(details.slot)||!['Mira','Adi','Tio'].includes(details.staff))throw new Error('Pilih tanggal, jam dan staf.');
    if(lines.length!==1||lines[0].quantity!==1)throw new Error('Booking memuat satu layanan per reservasi.');
    const begin=minutes(details.slot),end=begin+product(s,lines[0].id).duration;
    if(end>17*60)throw new Error('Durasi layanan melewati jam tutup 17.00.');
    if(details.level==='automatic'&&(s.blocks||[]).some(b=>b.date===details.date&&(b.staff==='Semua'||b.staff===details.staff)&&begin<minutes(b.slot)+120&&end+30>minutes(b.slot)))throw new Error('Jadwal diblok pengelola. Pilih slot lain.');
    if(details.level==='automatic'&&s.orders.some(o=>(o.payment==='paid'||o.payment==='pending'&&o.details.level==='automatic')&&o.details.date===details.date&&(o.details.staff===details.staff||o.lines[0].id===lines[0].id)&&begin<minutes(o.details.slot)+product(s,o.lines[0].id).duration+30&&end+30>minutes(o.details.slot)))throw new Error('Slot sedang dipesan. Pilih waktu lain.');
  }
  if(s.key==='bekal'&&lines.some(l=>product(s,l.id).preorder)){
    if(!calendarDate(details.date)||details.date<=dayAt(now))throw new Error('Pre-order minimal H-1. Pilih tanggal setelah hari ini.');
    if(details.level==='automatic'){
      const committed=s.orders.filter(o=>o.details.date===details.date&&['pending','paid'].includes(o.payment)).reduce((n,o)=>n+o.lines.filter(l=>product(s,l.id).preorder).reduce((n,l)=>n+l.quantity,0),0);
      if(committed+lines.filter(l=>product(s,l.id).preorder).reduce((n,l)=>n+l.quantity,0)>12)throw new Error('Kuota pre-order 12 paket pada tanggal ini tidak mencukupi. Pilih tanggal atau jumlah lain.');
    }
  }
  if(s.key==='panggung'){
    if(new Set(lines.map(l=>l.id)).size!==1)throw new Error('Pesan satu acara per transaksi.');
    if(details.level==='starter'&&lines[0].id!==commerceItems.panggung[0].id)throw new Error('Starter memuat satu acara. Ganti ke paket otomatis untuk acara lainnya.');
    const names=String(details.participants||'').trim().split('\n').filter(n=>n.trim());
    if(names.length!==lines.reduce((n,l)=>n+l.quantity,0))throw new Error('Isi satu nama untuk setiap tiket.');
    if(product(s,lines[0].id).date<dayAt(now))throw new Error('Acara telah lewat. Pilih acara yang masih aktif.');
  }
}

export function checkoutCommerce(state,details={},merchant,now=Date.now()){
  const s=expireDueCommerce(state,now),q=commerceQuote(s,details,merchant);
  if(!q.lines.length)throw new Error('Keranjang masih kosong.');
  if(s.orders.length>=100)throw new Error('Batas 100 pesanan demo tercapai. Unduh laporan, lalu reset demo.');
  if(!String(details.name||'').trim()||!String(details.contact||'').trim())throw new Error('Isi nama dan kontak pemesan.');
  if(!['starter','automatic'].includes(details.level))throw new Error('Paket pembayaran tidak valid.');
  if(details.method==='delivery'&&!String(details.address||'').trim())throw new Error('Isi alamat pengiriman.');
  if(s.key==='saji'&&details.method==='table'&&!integer(Number(details.table),1,20))throw new Error('Nomor meja harus 1-20.');
  if(s.key==='temu'&&new Set(q.lines.map(l=>product(s,l.id).merchant)).size!==1)throw new Error('Pilih satu toko untuk checkout ini.');
  assertSchedule(s,details,q.lines,now);
  const quantities={};for(const l of q.lines)quantities[l.id]=(quantities[l.id]||0)+l.quantity;
  for(const[id,n]of Object.entries(quantities))if(!available(s,id)||n>s.stock[id])throw new Error('Stok berubah. Periksa keranjang.');
  const cleanDetails=Object.fromEntries(Object.entries(details).filter(([k,v])=>detailKeys.includes(k)&&typeof v==='string').map(([k,v])=>[k,v.trim().slice(0,detailLimit(k))]));
  if(cleanDetails.participants)cleanDetails.participants=cleanDetails.participants.split('\n').map(n=>n.trim()).filter(Boolean).join('\n');
  const order={id:s.key.toUpperCase()+'-'+now.toString(36).toUpperCase()+'-'+(s.orders.length+1),created:now,expires:now+15*60*1000,payment:'pending',fulfillment:'new',details:cleanDetails,merchant:product(s,q.lines[0].id).merchant||null,lines:q.lines.map(({index,...l})=>({...l,unit:linePrice(s,l)})),subtotal:q.subtotal,shipping:q.shipping,discount:q.discount,grandTotal:q.grandTotal,total:q.total,balance:q.balance,checkedIn:[]};
  for(const[id,n]of Object.entries(quantities))s.stock[id]-=n;
  const indices=new Set(q.lines.map(l=>l.index));s.cart=s.cart.filter((_,i)=>!indices.has(i));s.orders.unshift(order);
  return {state:s,order};
}

function release(s,o){for(const l of o.lines)s.stock[l.id]=Math.min(product(s,l.id).stock,s.stock[l.id]+l.quantity);}
export function expireCommerce(state,orderId){
  const s=copy(state),o=s.orders.find(o=>o.id===orderId);if(!o)throw new Error('Pesanan tidak ditemukan.');
  if(o.payment!=='pending')return s;
  o.payment='expired';o.fulfillment='cancelled';release(s,o);return s;
}
export function expireDueCommerce(state,now=Date.now()){
  let s=copy(state);
  for(const o of s.orders)if(o.payment==='pending'&&o.details.level==='automatic'&&now>=o.expires)s=expireCommerce(s,o.id);
  return s;
}
export function setCommerceAvailability(state,id){
  const s=copy(state);if(!product(s,id))throw new Error('Produk tidak tersedia.');
  s.unavailable||={};s.unavailable[id]=!s.unavailable[id];return s;
}
export function confirmCommerce(state,{orderId,amount,eventId,now=Date.now()}){
  const s=copy(state),o=s.orders.find(o=>o.id===orderId);if(!o)throw new Error('Pesanan tidak ditemukan.');
  if(amount!==o.total)throw new Error('Nominal pembayaran tidak cocok.');
  if(typeof eventId!=='string'||!eventId||eventId.length>150)throw new Error('ID notifikasi tidak valid.');
  if(s.events.includes(eventId)||o.payment==='paid')return s;
  if(['expired','cancelled'].includes(o.payment)||o.payment==='pending'&&o.details.level==='automatic'&&now>=o.expires){
    if(o.payment==='pending')release(s,o);
    o.payment='review';o.fulfillment='cancelled';s.events.push(eventId);return s;
  }
  if(o.payment!=='pending')throw new Error('Pesanan tidak dapat dilunasi pada status ini.');
  o.payment='paid';s.events.push(eventId);return s;
}
export function updateCommerceOrder(state,id,action,tracking=''){
  const s=copy(state),o=s.orders.find(o=>o.id===id);if(!o)throw new Error('Pesanan tidak ditemukan.');
  if(action==='refund'){
    if(o.payment!=='paid')throw new Error('Refund memerlukan pesanan yang dibayar.');
    if(o.checkedIn.length)throw new Error('Sebagian tiket sudah digunakan. Refund perlu ditinjau pengelola; kuota tiket tetap tercatat.');
    if(['shipped','completed'].includes(o.fulfillment))throw new Error('Pesanan sudah diserahkan. Retur/refund setelah pemenuhan perlu ditinjau; demo ini menangani refund sebelum penyerahan.');
    o.payment='refunded';o.fulfillment='cancelled';release(s,o);return s;
  }
  if(action==='cancel'){
    if(o.payment!=='pending')throw new Error('Pesanan lunas perlu ditinjau untuk refund.');
    o.payment='cancelled';o.fulfillment='cancelled';release(s,o);return s;
  }
  if(action==='tracking'){
    if(o.payment!=='paid'||!String(tracking).trim())throw new Error('Resi memerlukan pesanan lunas dan nomor resi.');
    o.tracking=String(tracking).trim().slice(0,100);o.fulfillment='shipped';return s;
  }
  const sequence=['new','preparing','ready','shipped','completed'];
  if(o.payment!=='paid'||o.fulfillment==='completed'||o.fulfillment==='cancelled')throw new Error('Bayar dahulu atau pesanan sudah selesai.');
  o.fulfillment=sequence[sequence.indexOf(o.fulfillment)+1];return s;
}
export function checkInCommerce(state,code){
  const s=copy(state),match=/^(.*)-T(\d+)$/.exec(String(code||'').trim().toUpperCase());
  const o=match&&s.orders.find(o=>o.id===match[1]);
  if(s.key!=='panggung'||!o||o.payment!=='paid'||o.details.level!=='automatic')throw new Error('Tiket otomatis tidak ditemukan atau belum dibayar.');
  const total=o.lines.reduce((n,l)=>n+l.quantity,0),number=Number(match[2]);
  if(!integer(number,1,total))throw new Error('Nomor tiket tidak valid.');
  if(o.checkedIn.includes(number))throw new Error('Tiket sudah digunakan.');
  o.checkedIn.push(number);return s;
}
export function canCommerceDownload(state,id,productId,now=Date.now()){
  const o=state.orders.find(o=>o.id===id);
  return state.key==='karya'&&o?.details.level==='automatic'&&o?.payment==='paid'&&o.created+24*60*60*1000>now&&o.lines.some(l=>l.id===productId);
}
export function blockCommerceSlot(state,{date,slot,staff},now=Date.now()){
  const s=copy(state);s.blocks||=[];
  if(s.key!=='sela'||!calendarDate(date)||date<dayAt(now)||!['09:00','11:00','13:00','15:00'].includes(slot)||!['Semua','Mira','Adi','Tio'].includes(staff))throw new Error('Isi tanggal, jam dan staf untuk blok jadwal.');
  if(s.blocks.length>=100)throw new Error('Batas blok demo tercapai.');
  if(!s.blocks.some(b=>b.date===date&&b.slot===slot&&b.staff===staff))s.blocks.push({date,slot,staff});return s;
}
export function requestCommerceSchedule(state,id,{date,slot},now=Date.now()){
  const s=copy(state),o=s.orders.find(o=>o.id===id);
  if(s.key!=='sela'||o?.payment!=='paid'||o.details.level!=='automatic'||['shipped','completed'].includes(o.fulfillment))throw new Error('Perubahan jadwal memerlukan reservasi otomatis yang lunas dan belum selesai.');
  if(!calendarDate(date)||date<=dayAt(now)||!['09:00','11:00','13:00','15:00'].includes(slot))throw new Error('Permintaan perubahan jadwal minimal H-1; pilih tanggal setelah hari ini.');
  o.reschedule={date,slot};return s;
}
export function approveCommerceSchedule(state,id,now=Date.now()){
  const s=expireDueCommerce(state,now),o=s.orders.find(o=>o.id===id);
  if(s.key!=='sela'||o?.payment!=='paid'||!o.reschedule)throw new Error('Permintaan perubahan tidak ditemukan.');
  const details={...o.details,...o.reschedule};
  assertSchedule({...s,orders:s.orders.filter(row=>row.id!==id)},details,o.lines,now);
  o.details=details;delete o.reschedule;return s;
}
export function moderateCommerceProduct(state,id,status){
  const s=copy(state);
  if(s.key!=='temu'||!product(s,id)||!['pending','approved','rejected'].includes(status))throw new Error('Pengajuan katalog tidak valid.');
  s.moderation||={};s.moderation[id]=status;return s;
}
export function commerceReport(state){
  const paid=state.orders.filter(o=>o.payment==='paid');
  return {paid:paid.length,revenue:paid.reduce((n,o)=>n+o.total,0),pending:state.orders.filter(o=>o.payment==='pending').length,refunds:state.orders.filter(o=>o.payment==='refunded').reduce((n,o)=>n+o.total,0)};
}
