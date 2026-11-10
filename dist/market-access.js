(function(root){
'use strict';
function lookup(records,origin,crop,form){
 const matches=records.filter(r=>r.origin===origin&&r.crop===crop&&r.form===form);
 if(matches.length!==1)return {status:'unverified'};
 const r=matches[0];
 if(!['conditional','restricted'].includes(r.status)||!r.url||!r.reviewed)return {status:'unverified'};
 return r;
}
async function init(crops,onHeaderChange=()=>{}){
 const el=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ids=['accessOrigin','accessCrop','accessForm'];
 try{
 const response=await fetch('market-access.json');if(!response.ok)throw Error('Protocol data unavailable');const data=await response.json();
 if(!Array.isArray(data.records)||!Array.isArray(data.countries))throw Error('Invalid protocol data');
 function option(id,value,label){const o=document.createElement('option');o.value=value;o.textContent=label;el(id).append(o)}
 option(ids[0],'','Global · select an origin');
 data.countries.forEach(c=>{option(ids[0],c.code,c.name);option('originSelector',c.code,c.name)});crops.slice().sort((a,b)=>a.en.localeCompare(b.en)).forEach(c=>option(ids[1],c.id,c.en+' · '+c.zh));
 let storedOrigin='';try{storedOrigin=localStorage.getItem('china-mrl-origin')||''}catch{}
 const initialOrigin=data.countries.some(c=>c.code===storedOrigin)?storedOrigin:'';
 el(ids[0]).value=initialOrigin;el('originSelector').value=initialOrigin;el(ids[1]).value='榴莲';
 el('accessCoverage').textContent=`Coverage: ${data.records.length} documented combinations across ${new Set(data.records.map(r=>r.origin)).size} origins. All ${crops.length} crops can be checked; other combinations return “Not verified”. ${data.coverage}`;
 function render(){
 const origin=el(ids[0]).value,crop=el(ids[1]).value,form=el(ids[2]).value;
 const r=lookup(data.records,origin,crop,form),name=crops.find(c=>c.id===crop)?.en||crop,country=data.countries.find(c=>c.code===origin)?.name||'Global';
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
 html+=`<h3>${r.status==='restricted'?'Restriction documented':'Protocol documented · conditions apply'}</h3><p>${escape(r.scope)}</p><p><strong>Current operational clearance: not verified.</strong> An opening announcement does not establish that access remains open today.</p><p>Announcement: ${escape(r.announced)} · Document reviewed: ${escape(r.reviewed)}${stale?' · Review due (over 90 days)':''}</p><h4>Key protocol conditions (summary)</h4><ul>${r.conditions.map(c=>`<li>${escape(c)}</li>`).join('')}</ul>`;
 if(/^https:\/\//.test(r.url))html+=`<p><a href="${escape(r.url)}" target="_blank" rel="noopener">${escape(r.title)} · GACC announcement, MOFCOM republication ↗</a></p>`;
 }
 html+=form==='fresh'?`<button data-crop="${escape(crop)}">View ${escape(name)} residue limits ↗</button>`:'<p>Fresh-product MRLs are not automatically applicable to this form.</p>';
 el('accessResult').innerHTML=html;
 }
 ids.forEach(id=>{el(id).disabled=false;el(id).addEventListener('change',()=>{el('originSelector').value=el(ids[0]).value;render()})});
 el('originSelector').disabled=false;el('originSelector').addEventListener('change',()=>{el(ids[0]).value=el('originSelector').value;const crop=onHeaderChange();if(crops.some(c=>c.id===crop)){el(ids[1]).value=crop;el(ids[2]).value='fresh'}render()});render();
 }catch(e){el('accessCoverage').textContent='Protocol coverage unavailable.';el('accessResult').textContent='The market-access data could not load. Reload to retry. No access conclusion can be drawn; use the official authorities below.';}
}
const api={lookup,init};if(typeof module!=='undefined')module.exports=api;else root.MarketAccess=api;
})(typeof globalThis!=='undefined'?globalThis:this);
