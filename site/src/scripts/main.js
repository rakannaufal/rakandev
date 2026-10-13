import { catalog } from '../data/catalog.mjs';
import { demos, demoConfig } from '../data/demos.mjs';
import { rupiah, estimateWebsite, validateBrief, briefText } from '../lib/pricing.mjs';
import { seedState, validState, executeDemo, migrateDemoNames } from '../lib/demo-state.mjs';
import { renderWorkspace, renderTable, renderCart, specFor, tableRows } from '../lib/demo-ui.mjs';
import { refreshDomainPrices } from './infrastructure.js';
import { initializeConsultation } from './consultation.js';
import { initializeCommerce } from './commerce.js';
import { initializeHeroCarousel } from './hero-carousel.js';
import { portfolioProjects } from '../data/portfolio.mjs';
import { portfolioCases, interiorProjects } from '../data/case-studies.mjs';
import { esc } from '../lib/utils.mjs';
import { customFeatureOptions } from '../lib/brief-builder.mjs';
const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
const params = new URLSearchParams(location.search);
initializeHeroCarousel();
refreshDomainPrices();
const storage = {
  get(key,session=false) { try { return JSON.parse((session?sessionStorage:localStorage).getItem(key)); } catch { return null; } },
  set(key,value,session=false) { try { (session?sessionStorage:localStorage).setItem(key,JSON.stringify(value)); return true; } catch { return false; } },
  remove(key,session=false) { try { (session?sessionStorage:localStorage).removeItem(key); return true; } catch { return false; } },
};
let toastTimer;
function toast(message) { const el=$('[data-toast]'); el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true;},5000); }
function download(text,name,type='text/plain;charset=utf-8') { const url=URL.createObjectURL(new Blob([text],{type})); const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
let selection=storage.get('rd:selection:v1',true)||{};
if(!catalog.products.some(item=>item.id===selection.productId))selection.productId='landing';
selection.quantities=Object.fromEntries(catalog.websiteAddons.map(item=>{const value=Number(selection.quantities?.[item.id]);return [item.id,Number.isSafeInteger(value)&&value>=0&&value<=100?value:0];}));
selection.moduleIds=Array.isArray(selection.moduleIds)?selection.moduleIds.filter(id=>[...catalog.erpModules,...customFeatureOptions].some(item=>item.id===id)):[];
const saveSelection=()=>storage.set('rd:selection:v1',selection,true);
const menu=$('[data-menu-button]');
if(menu) { const nav=$('#main-navigation');const close=()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Buka navigasi');};menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Tutup navigasi':'Buka navigasi');});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){close();menu.focus();}});document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close();});matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)close();}); }
const tabs=$$('[data-tab]');
function selectTab(tab,focus=false) { tabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});$$('[data-panel]').forEach(panel=>{panel.hidden=panel.dataset.panel!==tab.dataset.tab;});if(focus)tab.focus(); }
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{const next=e.key==='ArrowRight'?(i+1)%tabs.length:e.key==='ArrowLeft'?(i+tabs.length-1)%tabs.length:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;if(next!==null){e.preventDefault();selectTab(tabs[next],true);}});});if(params.has('tab')){const tab=tabs.find(item=>item.dataset.tab===params.get('tab'));if(tab)selectTab(tab);}
const search=$('[data-search]'),kind=$('[data-kind-filter]');
if(search) { const filter=()=>{const query=search.value.trim().toLowerCase();let count=0;$$('[data-filter-list] > article').forEach(item=>{const show=(!kind||kind.value==='all'||item.dataset.kind===kind.value)&&item.dataset.search.includes(query);item.hidden=!show;if(show)count++;});$('[data-result-count]').textContent=count+' '+(location.pathname.startsWith('/demo')?'demo':'layanan');$('[data-filter-empty]').hidden=count!==0;};search.addEventListener('input',filter);kind?.addEventListener('change',filter);$('[data-clear-filter]')?.addEventListener('click',()=>{search.value='';if(kind)kind.value='all';filter();search.focus();}); }
$$('[data-preview]').forEach(button=>button.addEventListener('click',()=>{$$('[data-preview]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});$('.browser-frame iframe').src=button.dataset.preview+'?embed=1';$('[data-preview-full]').href=button.dataset.preview;}));
$$('[data-device]').forEach(button=>button.addEventListener('click',()=>{$$('[data-device]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});$('[data-preview-frame]').classList.toggle('is-mobile',button.dataset.device==='mobile');}));
const estimateProduct=$('#estimate-product');
if(estimateProduct) {
  if(!catalog.products.some(p=>p.kind==='website'&&p.id===selection.productId))selection.productId='landing';
  estimateProduct.value=selection.productId;
  const inputs=$$('[data-addon]');
  function loadQuantities(defaults=false) { const included=catalog.packageInclusions[estimateProduct.value]||{};inputs.forEach(input=>{input.value=defaults?(included[input.dataset.addon]||0):(selection.quantities[input.dataset.addon]??included[input.dataset.addon]??0);}); }
  function estimate() { try { const quantities=Object.fromEntries(inputs.map(input=>[input.dataset.addon,Math.min(Number(input.max),Math.max(0,Math.trunc(Number(input.value)||0)))]));const quote=estimateWebsite(catalog,estimateProduct.value,quantities);selection={...selection,productId:estimateProduct.value,quantities};saveSelection();$('[data-estimate-total]').textContent=rupiah(quote.total);$('[data-estimate-deposit]').textContent=rupiah(quote.deposit);$('[data-estimate-recurring]').textContent=rupiah(quote.recurring)+' / bulan';$('[data-estimate-consult]').href='/konsultasi/?product='+estimateProduct.value;const included=catalog.packageInclusions[estimateProduct.value]||{};$$('[data-included]').forEach(el=>{el.textContent=included[el.dataset.included]?included[el.dataset.included]+' termasuk paket; biaya hanya untuk kelebihan.':'';}); } catch(error){toast(error.message);} }
  loadQuantities();estimate();inputs.forEach(input=>{input.addEventListener('input',estimate);input.addEventListener('change',()=>{input.value=selection.quantities[input.dataset.addon]||0;});});estimateProduct.addEventListener('change',()=>{loadQuantities(true);estimate();});
}
const choices=$$('[data-module-choice]');
const moduleCount=()=>{const count=$('[data-module-count]');if(count)count.textContent=String(selection.moduleIds.filter(id=>catalog.erpModules.some(m=>m.id===id)).length);};
choices.forEach(input=>{input.checked=selection.moduleIds.includes(input.dataset.moduleChoice);input.addEventListener('change',()=>{const selected=new Set(selection.moduleIds);if(input.checked)selected.add(input.dataset.moduleChoice);else selected.delete(input.dataset.moduleChoice);selection.moduleIds=[...selected];saveSelection();moduleCount();});});moduleCount();
initializeConsultation({storage,getSelection:()=>selection,setSelection:value=>{selection=value;saveSelection();},download});
initializeCommerce({download});
$$('[data-example-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;$('[data-example-result]',form).textContent='Formulir contoh berhasil divalidasi. Tidak ada pesan dikirim.';form.reset();}));
if(params.get('embed')==='1')document.body.classList.add('embed-mode');
const workDialog=$('.work-dialog');
if(workDialog){
  let activeWork=0;
  function displayWork(index){
    activeWork=(index+portfolioProjects.length)%portfolioProjects.length;
    const project=portfolioProjects[activeWork],detail=portfolioCases[project.name];
    $('[data-work-image]').src='/assets/artwork/'+project.image+'.webp';$('[data-work-image]').alt='Konsep '+project.name;
    $('#work-title').textContent=project.name+' / '+project.title;
    $('[data-work-text]').textContent=project.description;
    $('[data-work-deliverables]').textContent='Hasil konsep: '+project.deliverables;
    $('[data-work-category-label]').textContent=project.label;
    $('[data-work-case]').innerHTML=`<dl class="work-case-meta"><div><dt>Tahun konsep</dt><dd>${detail.year}</dd></div><div><dt>Peran</dt><dd>${esc(detail.role)}</dd></div></dl><h3>Tantangan</h3><p>${esc(detail.challenge)}</p><h3>Arah yang dipilih</h3><p>${esc(detail.approach)}</p><div class="case-palette" aria-label="Palet warna">${detail.palette.map(color=>`<span style="--case-color:${color}"><i></i><small>${color}</small></span>`).join('')}</div><figure class="work-detail-shot"><img src="/assets/artwork/${project.image}-detail.webp" width="1100" height="840" alt="Detail visual ${project.name}" loading="lazy"><figcaption>Detail dari artwork konsep ${project.name}</figcaption></figure><h3>Proses</h3><ol>${detail.process.map(text=>`<li>${esc(text)}</li>`).join('')}</ol>`;
  }
  $$('[data-work-detail], [data-work-open]').forEach(button=>button.addEventListener('click',()=>{
    displayWork(Number(button.dataset.workDetail??button.dataset.workOpen));
    workDialog.showModal();
  }));
  $('[data-work-previous]').addEventListener('click',()=>{displayWork(activeWork-1);workDialog.scrollTop=0;});
  $('[data-work-next]').addEventListener('click',()=>{displayWork(activeWork+1);workDialog.scrollTop=0;});
  $$('[data-work-filter]').forEach(button=>button.addEventListener('click',()=>{
    $$('[data-work-filter]').forEach(control=>{const active=control===button;control.classList.toggle('active',active);control.setAttribute('aria-pressed',String(active));});
    let count=0;$$('[data-work-category]').forEach(article=>{article.hidden=button.dataset.workFilter!=='all'&&article.dataset.workCategory!==button.dataset.workFilter;if(!article.hidden)count++;});
    $('[data-work-count]').textContent=count+' karya ditampilkan';
  }));
}
const interiorDialog=$('.interior-dialog');
if(interiorDialog)$$('[data-interior-project]').forEach(button=>button.addEventListener('click',()=>{
  const project=interiorProjects[Number(button.dataset.interiorProject)];
  $('[data-interior-main]').src='/assets/photos/'+project.image+'.webp';$('[data-interior-main]').alt=project.name;
  $('#interior-project-title').textContent=project.name;$('[data-interior-location]').textContent=project.location;
  $('[data-interior-brief]').textContent=project.brief;$('[data-interior-solution]').textContent=project.solution;
  $('[data-interior-materials]').innerHTML=`<div><dt>Material</dt><dd>${esc(project.materials)}</dd></div><div><dt>Hasil konsep</dt><dd>${esc(project.deliverables)}</dd></div>`;
  interiorDialog.showModal();
}));
const demoRoot=$('[data-demo-root]');
if(demoRoot) {
  const config=demoConfig(demoRoot.dataset.demoRoot), shop=config.id==='custom',web=config.modules.length===0&&!shop;
  if(shop){config.modules=['ecommerce'];config.module='ecommerce';config.items=['Mug Luma','Lampu Senja','Tote Harian'];config.prices=[85000,245000,125000];}
  if(!web) {
    const key='rd:demo:v1:'+config.id;let state=seedState(config),persisted=storage.get(key),query='',shopQuery='';
    function storageNotice(text){const el=$('[data-demo-storage]');el.textContent=text;el.hidden=false;}
    if(persisted){if(validState(persisted,config))state=migrateDemoNames(persisted);else{storage.remove(key);storageNotice('Data demo tersimpan tidak valid. Demo dikembalikan ke data awal.');}}
    if(config.modules.includes(params.get('module')))state.selectedModule=params.get('module');
    function persist(){if(!storage.set(key,state))storageNotice('Penyimpanan browser tidak tersedia. Perubahan tetap dapat dicoba selama halaman terbuka.');}
    function feedback(message,error=false){if(shop){toast(message);return;}const el=$('[data-demo-feedback]');el.textContent=message;el.classList.toggle('is-error',error);el.hidden=false;if(error)el.focus();}
    function filterShop(){let count=0;$$('[data-shop-item]').forEach(item=>{item.hidden=!item.dataset.shopItem.includes(shopQuery.toLowerCase());if(!item.hidden)count++;});$('[data-shop-empty]').hidden=count!==0;}
    function render(){if(shop){$('[data-shop-content]').innerHTML=renderCart(state,config,true);$('[data-shop-search]').value=shopQuery;filterShop();}else{$('[data-workspace]').innerHTML=renderWorkspace(state,config);$$('[data-module]').forEach(button=>{const active=button.dataset.module===state.selectedModule;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});if(query){$('[data-demo-search]').value=query;$('[data-demo-table]').innerHTML=renderTable(state,config,state.selectedModule,query);}}}
    function execute(type,data,focusInfo){try{const result=executeDemo(state,{type,data},config);state=result.state;persist();render();feedback(result.message);if(focusInfo){const controls=$$('[data-action]');const target=controls.find(button=>button.dataset.action===focusInfo.type&&button.dataset.id===focusInfo.id&&!button.disabled);if(target)target.focus();else if(!shop)$('[data-demo-feedback]').focus();}}catch(error){feedback(error.message,true);}}
    render();persist();
    demoRoot.addEventListener('click',e=>{const receipt=e.target.closest('[data-receipt-download]');if(receipt){const row=state.receipts.find(item=>item.id===receipt.dataset.receiptDownload);if(row)download([config.brand,'Struk '+row.name,row.detail||row.table,rupiah(row.amount),row.status,'Transaksi lokal dengan data contoh.'].join('\n'),row.name+'.txt');}const module=e.target.closest('[data-module]'),action=e.target.closest('[data-action]');if(module){query='';execute('module',{module:module.dataset.module});const url=new URL(location.href);url.searchParams.set('module',module.dataset.module);history.replaceState(null,'',url);}if(action&&!action.disabled)execute(action.dataset.action,{id:action.dataset.id},{type:action.dataset.action,id:action.dataset.id});if(e.target.closest('[data-export]')){const spec=specFor(config,state.selectedModule,state.reportFilter),rows=tableRows(state,config,spec,query);const csvCell=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';download('\uFEFF'+[spec.columns.map(([,label])=>csvCell(label)).join(','),...rows.map(row=>spec.columns.map(([field])=>csvCell(row[field])).join(','))].join('\r\n'),'rd-'+state.selectedModule+'.csv','text/csv;charset=utf-8');feedback(rows.length+' data contoh diekspor.');}});
    demoRoot.addEventListener('submit',e=>{const form=e.target.closest('[data-demo-form]');if(!form)return;e.preventDefault();if(!form.reportValidity())return;const type=form.dataset.demoForm;const data=Object.fromEntries(new FormData(form));execute(type,data);const replacement=$('[data-demo-form="'+type+'"]');$('input',replacement||demoRoot)?.focus();});
    demoRoot.addEventListener('change',e=>{if(e.target.matches('[data-demo-role]'))execute('role',{role:e.target.value});if(e.target.matches('[data-demo-report]')){state.reportFilter=e.target.value;query='';persist();render();$('[data-demo-report]').focus();}});
    demoRoot.addEventListener('input',e=>{if(e.target.matches('[data-shop-search]')){shopQuery=e.target.value;filterShop();}if(e.target.matches('[data-demo-search]')){query=e.target.value;$('[data-demo-table]').innerHTML=renderTable(state,config,state.selectedModule,query);}});
    const dialog=$('.demo-reset-dialog');$('[data-reset-demo]').addEventListener('click',()=>dialog.showModal());dialog.addEventListener('close',()=>{if(dialog.returnValue==='reset'){state=seedState(config);query='';shopQuery='';persist();render();feedback('Demo dikembalikan ke data awal.');}$('[data-reset-demo]').focus();});
  } else $('[data-reset-demo]').addEventListener('click',()=>{const form=$('[data-example-form]');if(form){form.reset();$('[data-example-result]',form).textContent='Simulasi. Informasi tidak dikirim.';}window.scrollTo({top:0,behavior:'smooth'});toast('Demo dikembalikan ke awal.');});
} else if($('[data-reset-demo]'))$('[data-reset-demo]').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});toast('Contoh dokumen ditampilkan dari awal.');});

if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('reveal-in');observer.unobserve(entry.target);}}},{threshold:.12});
  $$('.selected-work-grid > a, .service-paths > a').forEach(el=>observer.observe(el));
}
