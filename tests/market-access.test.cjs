const {test}=require('node:test'),assert=require('node:assert/strict');
const access=require('../dist/market-access.js'),data=require('../dist/market-access.json'),db0=require('../dist/database.json'),db={...db0,crops:db0.crops.filter(c=>['水果','蔬菜'].includes(c.category))};
test('access matches origin, crop and form without inference',()=>{
 assert.equal(access.lookup(data.records,'MY','榴莲','fresh').status,'conditional');
 for(const args of [['MY','榴莲','frozen'],['TH','榴莲','fresh'],['MY','番茄','fresh'],['LA','辣椒','dried']])assert.equal(access.lookup(data.records,...args).status,'unverified');
 const r=data.records[0];assert.equal(access.lookup([r,r],r.origin,r.crop,r.form).status,'unverified');
 assert.equal(access.lookup([{...r,status:'restricted'}],r.origin,r.crop,r.form).status,'restricted');
});
test('every documented record has a valid crop, source, dates and conditions',()=>{
 const keys=new Set();for(const r of data.records){const key=[r.origin,r.crop,r.form].join('|');assert(!keys.has(key));keys.add(key);assert(db.crops.some(c=>c.id===r.crop));assert(data.countries.some(c=>c.code===r.origin));assert(['www.mofcom.gov.cn','www.fama.gov.my'].includes(new URL(r.url).hostname));assert(Number.isFinite(Date.parse(r.reviewed)));assert(Date.parse(r.announced)<=Date.parse(r.reviewed));assert(r.conditions.length>0);}
});
test('checker renders documented, unknown, changed-form and load-failure results',async()=>{
 const storage={};global.localStorage={getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v};
 const nodes={};global.document={getElementById(id){return nodes[id]??={value:id==='accessForm'?'fresh':'',append(){},addEventListener(k,f){this[k]=f}}},createElement(){return {}}};
 global.fetch=async()=>({ok:true,json:async()=>data});let opened=0;await access.init(db.crops,()=>{opened++;return '榴莲'});
 assert.equal(nodes.originSelector.value,'MY');assert.match(nodes.accessResult.innerHTML,/Approved market access/);
 nodes.originSelector.value='MY';nodes.originSelector.change();assert.match(nodes.accessCatalogueSummary.textContent,/8 documented/);assert.match(nodes.accessCropList.innerHTML,/Jackfruit/);assert.match(nodes.accessCropList.innerHTML,/Papaya/);assert.equal(opened,1);assert.equal(nodes.accessOrigin.value,'MY');assert.equal(nodes.originBrand.textContent,'MALAYSIA EXPORT REFERENCE');assert.equal(nodes.originRoute.textContent,'Malaysia → Mainland China');assert.equal(storage['china-mrl-origin'],'MY');
 assert.match(nodes.accessResult.innerHTML,/Approved market access/);assert.match(nodes.accessResult.innerHTML,/Shipment checks:/);
 nodes.accessForm.value='frozen';nodes.accessForm.change();assert.match(nodes.accessResult.innerHTML,/Not verified/);assert(!nodes.accessResult.innerHTML.includes('data-crop='));
 nodes.accessForm.value='fresh';nodes.accessOrigin.value='LA';nodes.accessCrop.value='辣椒';nodes.accessCrop.change();assert.equal(nodes.originSelector.value,'LA');assert.equal(nodes.originRoute.textContent,"Laos → Mainland China");assert.match(nodes.accessResult.innerHTML,/fumigation followed by cold treatment/);
 nodes.originSelector.value='';nodes.originSelector.change();assert.equal(nodes.accessOrigin.value,'');assert.match(nodes.accessResult.innerHTML,/Select an origin/);
 assert.equal(nodes.originBrand.textContent,'GLOBAL EXPORT REFERENCE');assert.equal(storage['china-mrl-origin'],'');
 storage['china-mrl-origin']='MY';await access.init(db.crops);assert.equal(nodes.originSelector.value,'MY');assert.equal(nodes.originRoute.textContent,'Malaysia → Mainland China');
 storage['china-mrl-origin']='invalid';await access.init(db.crops);assert.equal(nodes.originSelector.value,'');
 global.fetch=async()=>({ok:false});await access.init(db.crops);assert.match(nodes.accessResult.textContent,/could not load/);
 delete global.localStorage;delete global.document;delete global.fetch;
});

test('country catalogue distinguishes missing evidence, categories and product forms',()=>{
 const rows=access.catalogue(data.records,db.crops,'MY','fresh');assert.equal(rows.length,184);
 const documented=rows.filter(c=>c.access.status==='conditional');assert.equal(documented.length,8);assert(documented.every(c=>c.category==='水果'));
 assert(rows.filter(c=>c.category==='蔬菜').every(c=>c.access.status==='unverified'));
 assert(access.catalogue(data.records,db.crops,'MY','frozen').every(c=>c.access.status==='unverified'));
 assert(access.catalogue(data.records,db.crops,'','fresh').every(c=>c.access.status==='unverified'));
 assert.equal(access.catalogue(data.records,db.crops,'LA','fresh').find(c=>c.id==='辣椒').access.status,'conditional');
 assert.equal(access.catalogue(data.records,db.crops,'ZA','fresh').find(c=>c.id==='鳄梨').access.status,'conditional');
 const restriction={...data.records[0],origin:'ZZ',status:'restricted'};
 assert.equal(access.catalogue([restriction],db.crops,'ZZ','fresh').find(c=>c.id===restriction.crop).access.status,'restricted');
});
test('every additional source link is https',()=>{for(const r of data.records)for(const s of r.additionalSources||[])assert.match(s.url,/^https:\/\//)});
test('unreadable review dates show as review due; non-https extra sources are dropped',async()=>{
 const storage={'china-mrl-origin':'MY'};global.localStorage={getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v};
 const nodes={};global.document={getElementById(id){return nodes[id]??={value:id==='accessForm'?'fresh':'',append(){},addEventListener(k,f){this[k]=f}}},createElement(){return {}}};
 const r={...data.records[0],reviewed:'not-a-date',additionalSources:[{title:'bad',url:'javascript:alert(1)',note:'x'},{title:'good',url:'https://example.org/',note:'y'}]};
 global.fetch=async()=>({ok:true,json:async()=>({...data,records:[r]})});await access.init(db.crops);
 assert.match(nodes.accessResult.innerHTML,/Review due \(review date unreadable\)/);assert(!nodes.accessResult.innerHTML.includes('javascript:'));assert(nodes.accessResult.innerHTML.includes('https://example.org/'));
 delete global.localStorage;delete global.document;delete global.fetch;
});
