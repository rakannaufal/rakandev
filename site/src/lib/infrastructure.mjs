import { domainPlans, hostingPlans, hostingTerms, staticProducts, checkedAt } from '../data/infrastructure.mjs';
import { registryEndpoints } from '../data/rdap-registries.mjs';
export { registryEndpoints } from '../data/rdap-registries.mjs';

export function normalizeDomain(value) {
  const domain=String(value||'').trim().toLowerCase().replace(/\.$/,'');
  if(domain.length>253 || !domain.includes('.') || !domain.split('.').every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) throw new Error('Tulis domain lengkap tanpa https, spasi, atau path. Contoh: namabisnis.com.');
  return domain;
}
export function domainPlan(value) {
  return domainPlans.toSorted((a,b)=>b.tld.length-a.tld.length).find(plan=>value.endsWith('.'+plan.tld));
}
export function domainRegistration(plan, date=new Date()) {
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(p=>[p.type,p.value]));
  const localDate=`${parts.year}-${parts.month}-${parts.day}`;
  return plan.effective&&localDate>=plan.effective.date?plan.effective.registration:plan.registration;
}
export function estimateInfrastructure(data, date=new Date()) {
  const mode=['free','custom','owned','later'].includes(data.domainMode)?data.domainMode:'later';
  const host=hostingPlans.find(p=>p.id===data.hostingId)||hostingPlans.find(p=>p.id==='later');
  const years=[1,2,3].includes(Number(data.domainYears))?Number(data.domainYears):1;
  const months=hostingTerms.includes(Number(data.hostingMonths))?Number(data.hostingMonths):12;
  let domain='',plan=null,registration=null,domainCost=mode==='free'?0:null,domainSubtotal=null,domainTax=null,domainRounding=null;
  if(mode==='custom'||mode==='owned'){
    try{domain=normalizeDomain(data.domainName);plan=domainPlan(domain)||null;}catch{}
  }
  if(mode==='custom'&&plan){
    registration=domainRegistration(plan,date);
    domainCost=years===1?registration:plan.renewal===null?null:registration+plan.renewal*(years-1);
    if(domainCost!==null){
      domainSubtotal=plan.registrationSubtotal+plan.renewalSubtotal*(years-1);
      domainTax=plan.registrationTax+plan.renewalTax*(years-1);
      domainRounding=plan.registrationRounding+plan.renewalRounding*(years-1);
    }
  }
  const hostingCost=host.monthly===null?null:host.monthly*months;
  return {checkedAt,mode,domain,plan,years,months,host,registration,domainCost,domainSubtotal,domainTax,domainRounding,hostingCost,knownSubtotal:(domainCost||0)+(hostingCost||0),total:domainCost===null||hostingCost===null?null:domainCost+hostingCost,renewalDomain:plan?.renewal??null,renewalHosting:host.renewalMonthly===null?null:host.renewalMonthly*12,freeCompatible:staticProducts.includes(data.product)};
}
export function infrastructureErrors(data) {
  const errors={};
  if(['custom','owned'].includes(data.domainMode)){
    try{normalizeDomain(data.domainName);}catch(e){errors.domainName=e.message;}
  }
  if(data.hostingId==='free'&&!staticProducts.includes(data.product))errors.hostingId='Hosting gratis untuk landing, portofolio, profil atau katalog Starter statis. Pilih bantuan hosting untuk kebutuhan aplikasi/ERP.';
  if(data.domainMode==='free'&&data.hostingId!=='free')errors.hostingId='Alamat gratis mengikuti hosting statis gratis. Untuk hosting berbayar, pilih domain custom atau domain yang sudah dimiliki.';
  return errors;
}

// Fixed registry endpoints from IANA's RDAP bootstrap, never a URL supplied by the visitor.

export function registryUrl(value){
  const domain=normalizeDomain(value),suffix=domain.split('.').at(-1),base=registryEndpoints[suffix];
  const labels=domain.split('.');
  if(domain.endsWith('.it.com'))throw Object.assign(new Error('Ekstensi .it.com perlu pemeriksaan tim sebelum pendaftaran. Pilih ekstensi lain untuk cek otomatis.'),{code:'unsupported'});
  if(labels.length!==2&&!(suffix==='id'&&labels.length===3&&['co','web','my','biz','or','sch','ac','ponpes'].includes(labels[1])))throw new Error('Periksa nama domain utama, bukan subdomain seperti www.namabisnis.com.');
  if(!base)throw Object.assign(new Error('Ekstensi ini belum mendukung pemeriksaan langsung. Tim membantu memastikan ketersediaannya.'),{code:'unsupported'});
  return {domain,url:base+'domain/'+encodeURIComponent(domain),registry:suffix==='id'?'PANDI':suffix==='com'||suffix==='net'?'Verisign':suffix==='org'?'Public Interest Registry':'Radix'};
}
export async function checkDomain(value,{fetcher=fetch,signal,timeout=12000}={}){
  const target=registryUrl(value);
  const timeSignal=AbortSignal.timeout(timeout);
  const combined=signal?AbortSignal.any([signal,timeSignal]):timeSignal;
  try{
    const response=await fetcher(target.url,{signal:combined,headers:{Accept:'application/rdap+json, application/json'}});
    const body=await response.text();
    const data=body.trim()?JSON.parse(body):null;
    const common={domain:target.domain,registry:target.registry,source:target.url,checkedAt:new Date().toISOString()};
    // Verisign returns an empty RDAP 404 for unregistered .com names.
    const emptyRdap404=!body.trim()&&response.headers.get('content-type')?.split(';')[0].trim()==='application/rdap+json';
    if(response.status===404&&(Number(data?.errorCode)===404||emptyRdap404))return {...common,status:'not-found',message:'Belum tercatat di registry. Kandidat untuk didaftarkan; konfirmasi ketersediaan dan harga di registrar.'};
    if(response.ok&&data?.objectClassName==='domain'&&String(data.ldhName||'').toLowerCase()===target.domain)return {...common,status:'registered',message:'Sudah terdaftar. Jika domain ini milikmu, pilih “Sudah punya domain”.'};
    return {...common,status:'unknown',message:response.status===429?'Registry membatasi permintaan. Coba lagi beberapa saat.':'Registry belum memberi hasil yang dapat dipastikan. Periksa melalui registrar.'};
  }catch(error){
    if(signal?.aborted)throw error;
    return {domain:target.domain,registry:target.registry,status:'unknown',source:target.url,checkedAt:new Date().toISOString(),message:'Nama ini belum dapat diverifikasi saat ini. Coba cek ulang atau pertimbangkan pilihan nama lainnya.'};
  }
}

export function suggestDomainNames(value, limit=6){
  const domain=normalizeDomain(value),labels=domain.split('.');
  const indonesianZone=labels.at(-1)==='id'&&labels.length===3&&['co','web','my','biz','or','sch','ac','ponpes'].includes(labels[1]);
  if(labels.length!==2&&!indonesianZone&&!(labels.length===3&&domain.endsWith('.it.com')))throw new Error('Gunakan nama domain utama untuk mencari alternatif.');
  const name=labels[0];
  const candidates=['id','com','web.id','my.id','net'].map(tld=>name+'.'+tld);
  candidates.push(name+'studio.com',name+'digital.com',name+'.online',name+'.site');
  return [...new Set(candidates)].filter(candidate=>{
    if(candidate===domain)return false;
    try{registryUrl(candidate);return true;}catch{return false;}
  }).slice(0,Math.max(0,Math.min(8,Number(limit)||0)));
}

export async function checkDomainSuggestions(value,{fetcher=fetch,signal,onResult=()=>{},limit=6,concurrency=2,timeout=8000}={}){
  const names=suggestDomainNames(value,limit),results=new Array(names.length);
  let cursor=0;
  async function worker(){
    while(cursor<names.length){
      signal?.throwIfAborted();
      const index=cursor++;
      const result=await checkDomain(names[index],{fetcher,signal,timeout});
      signal?.throwIfAborted();
      results[index]=result;onResult(result);
    }
  }
  // A small pool avoids flooding registries while every suggestion gets a real result.
  await Promise.all(Array.from({length:Math.min(names.length,Math.max(1,Math.min(3,Number(concurrency)||2)))},worker));
  return results;
}

export function infrastructureBrief(data){
  const q=estimateInfrastructure(data),money=n=>n===null?'Perlu konfirmasi':'Rp'+new Intl.NumberFormat('id-ID').format(n);
  const modes={free:'Subdomain gratis dari layanan hosting',custom:'Domain custom baru',owned:'Sudah punya domain',later:'Bantu pilih domain'};
  const lines=['','Domain & hosting', 'Domain: '+modes[q.mode]+(q.domain?' / '+q.domain:'')];
  if(q.mode==='custom'){
    lines.push('Durasi domain: '+q.years+' tahun');
    if(q.plan)lines.push('Subtotal domain: '+money(q.domainSubtotal),'PPN domain 11%: '+money(q.domainTax),'Pembulatan ke atas: '+money(q.domainRounding));
    lines.push('Acuan biaya domain periode awal: '+money(q.domainCost),'Perpanjangan domain per tahun: '+money(q.renewalDomain));
    if(q.plan)lines.push('Rincian perpanjangan: subtotal '+money(q.plan.renewalSubtotal)+' + PPN 11% '+money(q.plan.renewalTax)+' + pembulatan '+money(q.plan.renewalRounding));
  }
  if(data.domainCheck&&data.domainCheck.domain===q.domain&&['registered','not-found','unknown'].includes(data.domainCheck.status))lines.push('Cek registry terakhir: '+({registered:'Terdaftar','not-found':'Belum tercatat; konfirmasi registrar',unknown:'Belum terverifikasi'}[data.domainCheck.status])+' / '+data.domainCheck.checkedAt);
  lines.push('Hosting: '+q.host.name);
  if(q.host.id!=='free')lines.push('Durasi hosting yang diinginkan: '+q.months+' bulan (siklus tagihan mengikuti provider)');
  if(q.host.specs.length)lines.push('Spesifikasi acuan: '+q.host.specs.join('; '));
  lines.push('Biaya hosting periode awal, tarif reguler: '+money(q.hostingCost),'Hosting 12 bulan berikutnya, acuan reguler: '+money(q.renewalHosting));
  if(data.traffic)lines.push('Perkiraan kunjungan / pemakaian: '+data.traffic);
  if(data.hostingNeeds)lines.push('Kebutuhan server: '+data.hostingNeeds);
  lines.push('Biaya online yang sudah dapat dihitung: '+money(q.knownSubtotal)+(q.total===null?' + komponen yang belum dikonfirmasi':''),'Acuan harga dicek '+checkedAt+'. Domain: subtotal + PPN 11%, dibulatkan ke atas per Rp5.000, tanpa tambahan margin jasa. Hosting sebelum pajak. Harga final dan promo dikonfirmasi saat pembayaran. Tidak ada pembelian otomatis.');
  return lines.join('\n');
}
