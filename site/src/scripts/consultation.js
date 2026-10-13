import { catalog } from '../data/catalog.mjs';
import { demos } from '../data/demos.mjs';
import { rupiah, estimateWebsite, validateBrief, briefText } from '../lib/pricing.mjs';
import { scopeFor, renderScopeFields } from '../lib/brief-builder.mjs';
import { estimateInfrastructure } from '../lib/infrastructure.mjs';
import { staticProducts } from '../data/infrastructure.mjs';
import { initializeInfrastructure } from './infrastructure.js';
import { esc, icon } from '../lib/utils.mjs';

export function initializeConsultation({storage,getSelection,setSelection,download}){
  const form=document.querySelector('#consultation-form');if(!form)return;
  const one=selector=>document.querySelector(selector);
  const all=selector=>[...document.querySelectorAll(selector)];
  const field=name=>form.elements[name];
  const key='rd:brief:v1', fields=['name','business','contact','product','demo','goal','budget','deadline','domainMode','domainName','domainYears','hostingId','hostingMonths','traffic','hostingNeeds'];
  const saved=storage.get(key,true), params=new URLSearchParams(location.search);
  let scopeByProduct=saved?.scopeByProduct&&typeof saved.scopeByProduct==='object'?saved.scopeByProduct:{};
  let scopeSelections=saved?.scopeSelections&&typeof saved.scopeSelections==='object'?saved.scopeSelections:{};
  let currentStep=1,scope,saveTimer;
  if(saved&&typeof saved==='object'){
    for(const name of fields)if(typeof saved[name]==='string')field(name).value=saved[name];
    field('consent').checked=Boolean(saved.consent);
    if(saved.scopeAnswers&&!scopeByProduct[saved.product])scopeByProduct[saved.product]=saved.scopeAnswers;
    one('[data-draft-status]').textContent='Draft dipulihkan. Lanjutkan dari tahap terakhir.';
  }
  if(catalog.products.some(p=>p.id===params.get('product')))field('product').value=params.get('product');
  if(demos.some(d=>d.id===params.get('demo')))field('demo').value=params.get('demo');
  if(!saved&&staticProducts.includes(field('product').value)){
    field('hostingId').value='free';field('domainMode').value='free';
  }
  const answers=()=>{
    const id=field('product').value||'help';
    if(!scopeByProduct[id])scopeByProduct[id]={sections:{},features:{}};
    const result=scopeByProduct[id];result.sections||={};result.features||={};return result;
  };
  function captureScope(){
    if(!scope)return;
    const id=scope.product?.id||'help';scopeByProduct[id]||={sections:{},features:{}};
    const value=scopeByProduct[id];value.sections||={};value.features||={};
    for(const element of all('[data-section-brief]')){const id=element.dataset.sectionBrief;value.sections[id]={brief:element.value,assets:one('[data-section-assets="'+id+'"]').value};}
    for(const element of all('[data-feature-brief]')){const id=element.dataset.featureBrief;value.features[id]={brief:element.value,output:one('[data-feature-output="'+id+'"]').value};}
  }
  function data(){return {...Object.fromEntries(fields.map(n=>[n,field(n).value])),consent:field('consent').checked,scopeAnswers:answers(),domainCheck:infrastructure.getCheck()};}
  function saveDraft(){
    clearTimeout(saveTimer);captureScope();
    scopeSelections[field('product').value||'help']=getSelection();
    const value={...data(),scopeByProduct,scopeSelections,step:currentStep};
    one('[data-draft-status]').textContent=storage.set(key,value,true)?'Draft tersimpan di tab ini.':'Penyimpanan browser tidak tersedia. Halaman ini tetap dapat diisi.';
  }
  const infrastructure=initializeInfrastructure(form,{initialCheck:saved?.domainCheck,onChange:saveDraft});
  function quote(){
    const product=catalog.products.find(p=>p.id===field('product').value),selection=getSelection();
    return product?.kind==='website'&&product.id!=='custom'?estimateWebsite(catalog,product.id,selection.quantities):{total:product?.price.amount??null,deposit:null,recurring:0};
  }
  function updateSummary(){
    const q=quote(),selection=getSelection(),product=catalog.products.find(p=>p.id===field('product').value);
    one('[data-package-summary]').innerHTML=`<span>Paket pilihanmu</span><h2>${esc(product?.name||'Bantu pilih layanan')}</h2><strong>${product?.price.mode==='starting'?'Mulai ':''}${rupiah(q.total)}</strong><p>${esc(product?.scope||'Susun kebutuhan dahulu. Harga mengikuti scope yang disepakati.')}</p>${q.deposit===null?'':`<p>DP 50%: <b>${rupiah(q.deposit)}</b></p>`}${product?.kind==='erp'?`<p>${scope?.features.filter(f=>!f.included).length||0} fitur untuk dibahas di luar batas paket. Harga modul tidak dijumlahkan sebagai penawaran final.</p>`:''}<a href="${product?'/layanan/'+product.id+'/':'/layanan/'}" class="text-link">Rincian paket ${icon('arrow-right',16)}</a>`;
    const selected=demos.find(d=>d.id===field('demo').value);
    one('[data-selected-demo]').href=(selected?.route||'/demo/')+(selected&&product?.commerce?.level==='automatic'?'?package='+product.id:'');
    one('[data-brief-extras]').hidden=!scope?.isWebsite;
    completion();
  }
  function completion(){
    if(!scope)return;
    const count=all('[data-section-brief]').filter(e=>e.value.trim()).length;
    const output=one('[data-scope-completion]');if(output)output.textContent=count+' dari '+scope.sections.length+' brief terisi. Bagian kosong akan ditandai “bantu arahkan”.';
    for(const element of all('[data-section-brief]')){const state=one('[data-answer-state="'+element.dataset.sectionBrief+'"]');state.textContent=element.value.trim()?'Terisi':'Bantu arahkan';}
  }
  function buildScope(){
    scope=scopeFor(field('product').value,getSelection().quantities,getSelection().moduleIds);
    one('[data-scope-builder]').innerHTML=renderScopeFields(scope,answers());
    updateSummary();
  }
  function buildAddons(){
    const included=catalog.packageInclusions[field('product').value]||{},selection=getSelection();
    const product=catalog.products.find(p=>p.id===field('product').value);
    const ids=product?.commerce?['section','page','design','language']:['section','page','gallery','form','design','language','booking'];
    one('[data-brief-addon-list]').innerHTML=ids.map(id=>{
      const addon=catalog.websiteAddons.find(a=>a.id===id),isCount=['section','page','gallery'].includes(id),count=Math.max(0,(selection.quantities[id]||0)-(included[id]||0));
      return `<div class="brief-addon"><label for="brief-addon-${id}"><b>${esc(addon.name)}</b><span>${rupiah(addon.price.amount)}${isCount?' / unit':''}</span><small>${esc(addon.scope)}</small></label><input id="brief-addon-${id}" data-brief-addon="${id}" ${isCount?'type="number" min="0" max="100" value="'+count+'" inputmode="numeric"':'type="checkbox" '+(count||included[id]?'checked':'')+' '+(included[id]?'disabled':'')} aria-label="Tambahan ${esc(addon.name)}">${included[id]?'<p class="included-note">Sudah termasuk paket</p>':''}</div>`;
    }).join('');
  }
  function syncUrl(){
    const url=new URL(location.href);
    for(const name of ['product','demo']){
      if(field(name).value)url.searchParams.set(name,field(name).value);
      else url.searchParams.delete(name);
    }
    history.replaceState(null,'',url);
  }
  function selectProduct(){
    captureScope();
    if(scope)scopeSelections[scope.product?.id||'help']=getSelection();
    const product=field('product').value,selection=getSelection();
    if(selection.productId!==product)setSelection(scopeSelections[product||'help']||{...selection,productId:product,quantities:{...catalog.packageInclusions[product]}});
    if(!staticProducts.includes(product)&&field('domainMode').value==='free')field('domainMode').value='later';
    const offer=catalog.products.find(p=>p.id===product);
    const relevant=demos.filter(d=>offer?.commerce?d.id===offer.demo.id:product==='custom'?d.id==='custom':product.startsWith('erp-')?['erp','industry'].includes(d.kind):d.kind==='website'&&(d.id===product||product==='plus'&&['landing','portfolio'].includes(d.id)));
    const demo=field('demo').value;field('demo').innerHTML='<option value="">Bantu arahkan desain</option>'+relevant.map(d=>`<option value="${d.id}">${esc(d.name)} / ${esc(offer?.commerce?offer.name:d.title)}</option>`).join('');
    field('demo').value=relevant.some(d=>d.id===demo)?demo:'';
    syncUrl();
    buildScope();buildAddons();infrastructure.refresh();
  }
  function showStep(step,focus=true){
    currentStep=step;
    all('[data-brief-step]').forEach(el=>{el.hidden=Number(el.dataset.briefStep)!==step;});
    all('[data-progress]').forEach(el=>{const n=Number(el.dataset.progress);el.classList.toggle('active',n===step);el.classList.toggle('completed',n<step);if(n===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    if(focus){const heading=one('[data-brief-step="'+step+'"] h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}one('.brief-panel').scrollIntoView({block:'start',behavior:'instant'});}
  }
  function checkStep(step){
    const errors=validateBrief(data()),names=step===1?['name','business','contact','goal']:['domainName','hostingId','consent'];
    for(const name of names){field(name).setAttribute('aria-invalid',String(Boolean(errors[name])));one('#error-'+name).textContent=errors[name]||'';}
    const first=names.find(name=>errors[name]);
    one('[data-brief-status]').textContent=first?'Periksa kolom yang ditandai.':'';
    if(first){field(first).focus();return false;}return true;
  }
  function contactLinks(){
    const container=one('[data-contact-actions]');container.replaceChildren();
    const value=one('[data-brief-output]').value,phone=String(import.meta.env.PUBLIC_CONTACT_WHATSAPP||'').replace(/[^0-9]/g,''),email=String(import.meta.env.PUBLIC_CONTACT_EMAIL||'').trim(),links=[];
    if(/^[0-9]{8,15}$/.test(phone))links.push(['Buka WhatsApp','https://wa.me/'+phone+'?text='+encodeURIComponent(value)]);
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))links.push(['Buka email','mailto:'+email+'?subject='+encodeURIComponent('Brief konsultasi RakanDev')+'&body='+encodeURIComponent(value)]);
    for(const [label,href]of links){const link=document.createElement('a');link.className='button secondary';link.textContent=label;link.href=href;if(href.startsWith('https:')){link.target='_blank';link.rel='noopener';}container.append(link);}
  }
  function review(){
    captureScope();const value=data(),q=quote(),infra=estimateInfrastructure(value);
    one('[data-brief-output]').value=briefText(catalog,value,getSelection());
    one('[data-review-costs]').innerHTML=`<div><span>Jasa pembuatan</span><b>${scope.product?.price.mode==='starting'?'Mulai ':''}${rupiah(q.total)}</b></div><div><span>Domain & hosting periode awal</span><b>${infra.total===null?'Perlu konfirmasi':rupiah(infra.total)}</b></div><p>${scope.product?.kind==='erp'?'Fitur tambahan, discovery, dan infrastruktur dikonfirmasi dalam proposal.':'Tambahan pilihan sudah dihitung. Biaya berulang ditulis terpisah dalam ringkasan.'}</p>`;
    contactLinks();showStep(4);saveDraft();
  }
  all('[data-brief-next]').forEach(button=>button.addEventListener('click',()=>{if(currentStep===1&&!checkStep(1))return;showStep(currentStep+1);saveDraft();}));
  all('[data-brief-back]').forEach(button=>button.addEventListener('click',()=>{showStep(currentStep-1);saveDraft();}));
  form.addEventListener('input',event=>{completion();if(event.target.matches('[data-brief-addon]'))return;clearTimeout(saveTimer);saveTimer=setTimeout(saveDraft,350);});
  form.addEventListener('change',event=>{
    if(event.target.name==='product')selectProduct();
    if(event.target.name==='demo')syncUrl();
    if(event.target.matches('[data-brief-module]')){
      captureScope();const chosen=new Set(getSelection().moduleIds);if(event.target.checked)chosen.add(event.target.dataset.briefModule);else chosen.delete(event.target.dataset.briefModule);setSelection({...getSelection(),moduleIds:[...chosen]});buildScope();
    }
    if(event.target.matches('[data-brief-addon]')){
      captureScope();const id=event.target.dataset.briefAddon,included=catalog.packageInclusions[field('product').value]||{};
      const n=event.target.type==='checkbox'?Number(event.target.checked):Math.max(0,Math.min(100,Math.trunc(Number(event.target.value)||0)));if(event.target.type!=='checkbox')event.target.value=n;
      setSelection({...getSelection(),quantities:{...getSelection().quantities,[id]:n+(included[id]||0)}});buildScope();
    }
    updateSummary();saveDraft();
  });
  form.addEventListener('click',event=>{
    const button=event.target.closest('[data-brief-example],[data-feature-example]');if(!button)return;
    const sectionId=button.dataset.briefExample,featureId=button.dataset.featureExample;
    const element=one(sectionId?'[data-section-brief="'+sectionId+'"]':'[data-feature-brief="'+featureId+'"]');
    if(element.value.trim()){element.focus();return;}
    element.value=sectionId?scope.sections.find(s=>s.id===sectionId).example:scope.features.find(f=>f.id===featureId).example;
    element.focus();completion();saveDraft();
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(currentStep<3){if(currentStep===1&&!checkStep(1))return;showStep(currentStep+1);saveDraft();return;}
    if(!checkStep(1)){showStep(1,false);return;}
    if(!checkStep(3)){showStep(3,false);return;}review();
  });
  one('[data-edit-brief]').addEventListener('click',()=>{showStep(1);saveDraft();});
  one('[data-copy-brief]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(one('[data-brief-output]').value);one('[data-copy-status]').textContent='Ringkasan disalin. Belum dikirim.';}catch{one('[data-brief-output]').focus();one('[data-brief-output]').select();one('[data-copy-status]').textContent='Teks dipilih. Gunakan Salin atau Ctrl/Cmd+C.';}});
  one('[data-download-brief]').addEventListener('click',()=>{download(one('[data-brief-output]').value,'brief-rakandev.txt');one('[data-copy-status]').textContent='Ringkasan diunduh. Belum dikirim.';});
  one('[data-clear-brief]').addEventListener('click',()=>{
    clearTimeout(saveTimer);storage.remove(key,true);form.reset();scopeByProduct={};scopeSelections={};scope=null;setSelection({...getSelection(),productId:'',quantities:{},moduleIds:[]});selectProduct();showStep(1);one('[data-brief-output]').value='';one('[data-copy-status]').textContent='';one('[data-brief-status]').textContent='';all('.field-error').forEach(el=>el.textContent='');all('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));one('[data-draft-status]').textContent='Draft dihapus dari tab ini.';
  });
  selectProduct();
  if(saved&&saved.product===field('product').value&&[1,2,3,4].includes(saved.step)){
    if(saved.step===4&&!Object.keys(validateBrief(data())).length)review();else showStep(Math.min(saved.step,3),false);
  }
}
