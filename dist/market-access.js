(function(root){
'use strict';
function lookup(records,origin,crop,form){
 const matches=records.filter(r=>r.origin===origin&&r.crop===crop&&r.form===form);
 if(matches.length!==1)return {status:'unverified'};
 const r=matches[0];
 if(!['conditional','restricted'].includes(r.status)||!r.url||!r.reviewed)return {status:'unverified'};
 return r;
}
function catalogue(records,crops,origin,form){return crops.map(c=>({...c,access:origin?lookup(records,origin,c.id,form):{status:'unverified'}}))}
let currentData=null,currentOrigin='';
function cropStatus(crop){return currentData&&currentOrigin?lookup(currentData.records,currentOrigin,crop,'fresh'):null}
async function init(crops,onHeaderChange=()=>{},onOriginChange=()=>{}){
 const el=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ids=['accessOrigin','accessCrop','accessForm'];
 try{
 const response=await fetch('market-access.json');if(!response.ok)throw Error('Protocol data unavailable');const data=await response.json();
 if(!Array.isArray(data.records)||!Array.isArray(data.countries))throw Error('Invalid protocol data');
 function option(id,value,label){const o=document.createElement('option');o.value=value;o.textContent=label;el(id).append(o)}
 option(ids[0],'','Global · select an origin');el('originSelector').innerHTML='';option('originSelector','','Global');
 data.countries.forEach(c=>{option(ids[0],c.code,c.name);option('originSelector',c.code,c.name)});crops.slice().sort((a,b)=>a.en.localeCompare(b.en)).forEach(c=>option(ids[1],c.id,c.en+' · '+c.zh));
 let storedOrigin=null;try{storedOrigin=localStorage.getItem('china-mrl-origin')}catch{}
 const initialOrigin=storedOrigin==null?'MY':data.countries.some(c=>c.code===storedOrigin)?storedOrigin:'';
 el(ids[0]).value=initialOrigin;el('originSelector').value=initialOrigin;el(ids[1]).value='榴莲';
 el('accessCoverage').textContent=`Coverage: ${data.records.length} documented combinations across ${new Set(data.records.map(r=>r.origin)).size} origins. All ${crops.length} crops can be checked; other combinations return “Not verified”. ${data.coverage}`;
 const labels={conditional:'Documented access · conditions apply',restricted:'Restriction documented',unverified:'Not verified'};
 function renderCatalogue(){
  const origin=el(ids[0]).value,form=el(ids[2]).value;
  el('accessCatalogue').hidden=!origin;if(!origin)return;
  const country=data.countries.find(c=>c.code===origin)?.name||origin;
  const entries=catalogue(data.records,crops,origin,form),counts={conditional:0,restricted:0,unverified:0};entries.forEach(c=>counts[c.access.status]++);
  el('accessCatalogueTitle').textContent=country+' → China · '+form+' produce';
  el('accessCatalogueSummary').textContent=`${counts.conditional} documented · ${counts.restricted} restrictions documented · ${counts.unverified} not verified. Partial evidence coverage; zero recorded restrictions does not establish their absence.`;
  const q=el('accessCropSearch').value.trim().toLowerCase(),status=el('accessStatus').value||'all',category=el('accessCategory').value;
  const rows=entries.filter(c=>(status==='all'||c.access.status===status)&&(!category||category===c.category)&&(!q||[c.en,c.zh,...c.aliases||[]].join(' ').toLowerCase().includes(q))).sort((a,b)=>({conditional:0,restricted:1,unverified:2}[a.access.status]-{conditional:0,restricted:1,unverified:2}[b.access.status])||a.en.localeCompare(b.en));
  el('accessListCount').textContent=`${rows.length} crops shown`;
  el('accessCropList').innerHTML=rows.length?rows.map(c=>`<article><div><strong>${escape(c.en)} · ${escape(c.zh)}</strong><small>${escape(c.access.marketAccess==='approved'?'Approved market access · conditions apply':labels[c.access.status])}</small>${c.access.reviewed?`<small>${c.access.evidenceType==='official-guide'?'Official guide':'Protocol'} · reviewed ${escape(c.access.reviewed)}</small>`:''}</div><div><button data-access-crop="${escape(c.id)}">${c.access.status==='unverified'?'Review status':'Conditions & sources'}</button>${form==='fresh'?`<button data-crop="${escape(c.id)}">MRL limits</button>`:''}</div></article>`).join(''):'<p>No crops match this view. Try “All crops” or another produce type. An empty list is not a prohibition or permission.</p>';
 }
 function syncFreshOptions(){
  const select=el('crop');if(!select?.options)return;
  for(const option of select.options){const c=crops.find(c=>c.id===option.value);if(c)option.textContent=c.en+' · '+c.zh+(currentOrigin?' — '+(lookup(data.records,currentOrigin,c.id,'fresh').marketAccess==='approved'?'Approved market access · conditions apply':labels[lookup(data.records,currentOrigin,c.id,'fresh').status]):'')}
 }
 function render(){
 const origin=el(ids[0]).value,crop=el(ids[1]).value,form=el(ids[2]).value;
 const r=lookup(data.records,origin,crop,form),name=crops.find(c=>c.id===crop)?.en||crop,country=data.countries.find(c=>c.code===origin)?.name||'Global';
 currentData=data;currentOrigin=origin;syncFreshOptions();renderCatalogue();
 el('originSelector').value=origin;
 el('originBrand').textContent=origin?country.toUpperCase()+' EXPORT REFERENCE':'GLOBAL EXPORT REFERENCE';
 el('originRoute').textContent=(origin?country:'All origins')+' → Mainland China';
 el('originEyebrow').textContent=origin?'ONE STANDARD. EXPORTING FROM '+country.toUpperCase()+'.':'ONE STANDARD. A GLOBAL REFERENCE.';
 el('originFooter').textContent=(origin?country:'All origins')+'. Source-linked limits. Clear scope.';
 try{localStorage.setItem('china-mrl-origin',origin)}catch{}
 let html=`<p class="tag">${escape(country)} → CHINA · ${escape(form)}</p><h2>${escape(name)}</h2>`;
 if(!origin)html+='<h3>Select an origin to check market access</h3><p>Global is an overview without a selected country. China’s MRL reference remains available for all origins. Market-access permission must be checked for a specific country, commodity and product form.</p>';
 else if(r.status==='unverified')html+='<h3>Not verified</h3><p>No reviewed record for this exact combination is included here. This does not mean prohibited or permitted. Confirm with the authorities linked below before shipment.</p>';
 else{
 const stale=Date.now()-Date.parse(r.reviewed+'T00:00:00Z')>90*86400000;
 html+=`<h3>${r.status==='restricted'?'Restriction documented':(r.marketAccess==='approved'?'Approved market access · conditions apply':r.evidenceType==='official-guide'?'Access listed in official guide · conditions apply':'Protocol documented · conditions apply')}</h3><p>${escape(r.scope)}</p><p><strong>Shipment checks:</strong> Confirm the required facility registrations, certificates, treatments and route before dispatch. This app does not assess or clear an individual shipment.</p><p>${r.evidenceType==='official-guide'?'Guide edition':'Announcement'}: ${escape(r.announced)} · Document reviewed: ${escape(r.reviewed)}${stale?' · Review due (over 90 days)':''}</p><h4>Key source conditions (summary)</h4><ul>${r.conditions.map(c=>`<li>${escape(c)}</li>`).join('')}</ul>`;
 if(/^https:\/\//.test(r.url))html+=`<p><a href="${escape(r.url)}" target="_blank" rel="noopener">${escape(r.title)} · ${escape(r.sourceLabel||'GACC announcement, MOFCOM republication')} ↗</a></p>`;
 }
 if(r.additionalSources)html+=r.additionalSources.filter(s=>/^https:\/\//.test(s.url)).map(s=>`<p>${escape(s.note)} <a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(s.title)} ↗</a></p>`).join('');
 html+=form==='fresh'?`<button data-crop="${escape(crop)}">View ${escape(name)} residue limits ↗</button>`:'<p>Fresh-product MRLs are not automatically applicable to this form.</p>';
 el('accessResult').innerHTML=html;onOriginChange();
 }
 ['accessStatus','accessCategory'].forEach(id=>el(id).addEventListener('change',renderCatalogue));el('accessCropSearch').addEventListener('input',renderCatalogue);
 el('accessCropList').addEventListener('click',event=>{const button=event.target.closest('button[data-access-crop]');if(!button)return;el(ids[1]).value=button.dataset.accessCrop;render();el('accessResult').scrollIntoView({behavior:'smooth',block:'start'})});
 ids.forEach(id=>{el(id).disabled=false;el(id).addEventListener('change',()=>{el('originSelector').value=el(ids[0]).value;render()})});
 el('originSelector').disabled=false;el('originSelector').addEventListener('change',()=>{el(ids[0]).value=el('originSelector').value;const crop=onHeaderChange();if(crops.some(c=>c.id===crop)){el(ids[1]).value=crop;el(ids[2]).value='fresh'}render()});render();
 }catch(e){el('accessCoverage').textContent='Protocol coverage unavailable.';el('accessResult').textContent='The market-access data could not load. Reload to retry. No access conclusion can be drawn; use the official authorities below.';}
}
const api={lookup,catalogue,cropStatus,init};if(typeof module!=='undefined')module.exports=api;else root.MarketAccess=api;
})(typeof globalThis!=='undefined'?globalThis:this);
