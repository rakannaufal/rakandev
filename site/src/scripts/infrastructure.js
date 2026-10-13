import { hostingPlans, domainPlans, staticProducts } from '../data/infrastructure.mjs';
import { checkDomain, checkDomainSuggestions, suggestDomainNames, normalizeDomain, registryUrl, estimateInfrastructure, domainRegistration, domainPlan } from '../lib/infrastructure.mjs';
import { infrastructureSummary, domainPriceBreakdown } from '../lib/infrastructure-ui.mjs';
import { esc } from '../lib/utils.mjs';

export function domainStatusIcon(status){
  const paths=status==='not-found'?'<path d="m5 12 4 4 10-10"/>':status==='registered'?'<path d="m6 6 12 12M6 18 18 6"/>':'<path d="M12 7v6m0 4h.01"/>';
  return `<svg class="domain-status-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

export function refreshDomainPrices(root=document, date=new Date()){
  for(const node of root.querySelectorAll('[data-domain-registration]')){
    const plan=domainPlans.find(p=>p.tld===node.dataset.domainRegistration);
    if(plan)node.textContent='Rp'+new Intl.NumberFormat('id-ID').format(domainRegistration(plan,date));
  }
}

export function initializeInfrastructure(form,{initialCheck,onChange}){
  const field=name=>form.elements[name];
  const one=selector=>form.querySelector(selector);
  const resultBox=one('[data-domain-result]'),button=one('[data-check-domain]');
  const suggestionsBox=one('[data-domain-suggestions]'),suggestionsList=one('[data-domain-suggestions-list]'),suggestionsStatus=one('[data-domain-suggestions-status]');
  let domainCheck=null,controller=null,requestId=0;
  let alternatives=new Map();
  const read=()=>Object.fromEntries(['product','domainMode','domainName','domainYears','hostingId','hostingMonths'].map(n=>[n,field(n).value]));
  function showResult(result,restored=false){
    const labels={registered:'Tidak tersedia', 'not-found':'Tersedia menurut cek registry', unknown:'Belum dapat diperiksa'};
    resultBox.hidden=false;resultBox.dataset.status=result.status;
    const stamp=new Date(result.checkedAt).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
    const plan=domainPlan(result.domain);
    resultBox.innerHTML=`<div class="domain-result-title">${domainStatusIcon(result.status)}<div><b>${labels[result.status]}</b><strong>${esc(result.domain)}</strong></div></div><p>${result.status==='not-found'?'Nama belum tercatat. Bisa diajukan untuk pendaftaran; konfirmasi akhir dilakukan sebelum pembayaran.':esc(result.message)}</p>${plan&&result.status==='not-found'?domainPriceBreakdown(plan):''}<p class="domain-time">${restored?'Hasil tersimpan, belum diperiksa ulang. ':''}Pemeriksaan ${esc(stamp)}</p>`;
  }
  function invalidate(){
    requestId++;controller?.abort();domainCheck=null;
    alternatives.clear();suggestionsBox.hidden=true;suggestionsBox.removeAttribute('aria-busy');suggestionsList.replaceChildren();
    resultBox.hidden=true;button.disabled=false;button.textContent='Cek domain';
    one('#error-domainName').textContent='';field('domainName').removeAttribute('aria-invalid');
  }
  function update(){
    const data=read(),eligible=staticProducts.includes(data.product);
    field('hostingId').querySelector('[value="free"]').disabled=!eligible;
    if(data.hostingId==='free'&&!eligible){field('hostingId').value='later';data.hostingId='later';}
    one('[data-domain-controls]').hidden=!['custom','owned'].includes(data.domainMode);
    one('[data-free-domain-note]').hidden=data.domainMode!=='free';
    one('[data-domain-term]').hidden=data.domainMode!=='custom';
    const plan=hostingPlans.find(p=>p.id===data.hostingId)||hostingPlans.at(-1);
    one('[data-hosting-term]').hidden=plan.id==='free';
    one('[data-hosting-fit]').textContent=plan.fit+(eligible?'':' Hosting statis gratis perlu layanan website statis.');
    one('[data-hosting-specs]').hidden=!plan.specs.length;
    one('[data-hosting-specs]').innerHTML=plan.specs.length?`<h3>${esc(plan.name)}</h3><ul>${plan.specs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>${esc(plan.note||'')}</p>`:'';
    one('[data-infrastructure-summary]').innerHTML=infrastructureSummary(estimateInfrastructure(data));
  }
  if(initialCheck&&['registered','not-found','unknown'].includes(initialCheck.status)&&Number.isFinite(Date.parse(initialCheck.checkedAt))){
    try{const target=registryUrl(field('domainName').value);if(target.domain===initialCheck.domain){domainCheck={...initialCheck,source:target.url,registry:target.registry,message:String(initialCheck.message||'Hasil pemeriksaan tersimpan.')};showResult(domainCheck,true);}}catch{}
  }
  form.addEventListener('input',event=>{
    if(event.target.name==='domainName')invalidate();
    if(['domainName','domainMode','domainYears','hostingId','hostingMonths','product'].includes(event.target.name))update();
  });
  form.addEventListener('change',event=>{
    if(event.target.name==='domainMode')invalidate();
    if(['domainMode','domainYears','hostingId','hostingMonths','product'].includes(event.target.name))update();
  });
  form.addEventListener('reset',()=>{invalidate();queueMicrotask(update);});
  async function findAlternatives(domain,id,signal){
    const names=suggestDomainNames(domain);
    suggestionsBox.hidden=false;suggestionsBox.setAttribute('aria-busy','true');
    suggestionsStatus.textContent='Memeriksa pilihan nama lainnya...';
    suggestionsList.innerHTML=names.map(name=>`<li data-domain-candidate="${esc(name)}" data-status="loading"><div><b>${esc(name)}</b><span>Memeriksa...</span></div></li>`).join('');
    try{
      await checkDomainSuggestions(domain,{signal,onResult:result=>{
        if(id!==requestId)return;
        alternatives.set(result.domain,result);
        const row=[...suggestionsList.children].find(item=>item.dataset.domainCandidate===result.domain);
        const labels={'not-found':'Tersedia menurut cek registry','registered':'Tidak tersedia','unknown':'Belum terverifikasi'};
        const plan=domainPlan(result.domain);
        const cost=plan?'Acuan '+new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(domainRegistration(plan))+'/tahun pertama':'Tarif dikonfirmasi';
        row.dataset.status=result.status;
        row.innerHTML=`${domainStatusIcon(result.status)}<div><b>${esc(result.domain)}</b><span>${labels[result.status]}</span>${result.status==='not-found'?`<small>${esc(cost)}</small>`:''}</div>${result.status==='not-found'?`<button type="button" class="button secondary" data-use-domain="${esc(result.domain)}">Pilih</button>`:result.status==='unknown'?`<button type="button" class="button secondary" data-retry-domain="${esc(result.domain)}">Cek ulang</button>`:''}`;
      }});
      if(id!==requestId)return;
      const count=[...alternatives.values()].filter(result=>result.status==='not-found').length;
      suggestionsStatus.textContent=count?count+' rekomendasi tersedia menurut cek registry. Pilih nama yang kamu sukai.':'Belum ada alternatif yang terverifikasi. Ubah nama atau coba cek ulang.';
      const rows=[...suggestionsList.children];rows.sort((a,b)=>({'not-found':0,unknown:1,registered:2}[a.dataset.status])-({'not-found':0,unknown:1,registered:2}[b.dataset.status]));suggestionsList.append(...rows);
    }catch(error){if(id===requestId)suggestionsStatus.textContent='Pemeriksaan pilihan terhenti. Coba cek ulang domain.';}
    finally{if(id===requestId)suggestionsBox.setAttribute('aria-busy','false');}
  }
  suggestionsList.addEventListener('click',event=>{
    const target=event.target.closest('[data-use-domain],[data-retry-domain]');if(!target)return;
    const name=target.dataset.useDomain||target.dataset.retryDomain,result=alternatives.get(name);
    if(!result)return;
    invalidate();field('domainName').value=name;field('domainMode').value='custom';
    if(target.dataset.useDomain&&result.status==='not-found'){domainCheck=result;showResult(result);button.textContent='Cek ulang domain';}
    update();onChange();field('domainName').focus();
    if(target.dataset.retryDomain)button.click();
  });
  button.addEventListener('click',async()=>{
    invalidate();
    let domain;
    try{domain=normalizeDomain(field('domainName').value);}catch(error){one('#error-domainName').textContent=error.message;field('domainName').setAttribute('aria-invalid','true');field('domainName').focus();return;}
    try{registryUrl(domain);}catch(error){
      if(error.code!=='unsupported'){one('#error-domainName').textContent=error.message;field('domainName').setAttribute('aria-invalid','true');field('domainName').focus();return;}
      domainCheck={domain,status:'unknown',checkedAt:new Date().toISOString(),message:error.message};showResult(domainCheck);onChange();
      const id=++requestId;controller=new AbortController();await findAlternatives(domain,id,controller.signal);return;
    }
    const id=++requestId;controller=new AbortController();
    button.disabled=true;button.textContent='Memeriksa…';resultBox.hidden=false;resultBox.dataset.status='loading';resultBox.textContent='Memeriksa '+domain+' ke registry resmi…';
    try{const result=await checkDomain(domain,{signal:controller.signal});if(id!==requestId)return;domainCheck=result;showResult(result);onChange();button.disabled=false;button.textContent='Cek ulang domain';await findAlternatives(domain,id,controller.signal);}
    catch(error){if(id===requestId){resultBox.textContent='Pemeriksaan dibatalkan. Coba lagi.';resultBox.dataset.status='unknown';}}
    finally{if(id===requestId){button.disabled=false;button.textContent='Cek ulang domain';}}
  });
  update();
  return {getCheck:()=>domainCheck,refresh:update};
}
