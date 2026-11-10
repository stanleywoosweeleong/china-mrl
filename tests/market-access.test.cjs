const {test}=require('node:test'),assert=require('node:assert/strict');
const access=require('../dist/market-access.js'),data=require('../dist/market-access.json'),db=require('../dist/database.json');
test('access matches origin, crop and form without inference',()=>{
 assert.equal(access.lookup(data.records,'MY','榴莲','fresh').status,'conditional');
 for(const args of [['MY','榴莲','frozen'],['TH','榴莲','fresh'],['MY','番茄','fresh'],['LA','辣椒','dried']])assert.equal(access.lookup(data.records,...args).status,'unverified');
 const r=data.records[0];assert.equal(access.lookup([r,r],r.origin,r.crop,r.form).status,'unverified');
 assert.equal(access.lookup([{...r,status:'restricted'}],r.origin,r.crop,r.form).status,'restricted');
});
test('every documented record has a valid crop, source, dates and conditions',()=>{
 const keys=new Set();for(const r of data.records){const key=[r.origin,r.crop,r.form].join('|');assert(!keys.has(key));keys.add(key);assert(db.crops.some(c=>c.id===r.crop));assert(data.countries.some(c=>c.code===r.origin));assert(r.url.startsWith('https://www.mofcom.gov.cn/'));assert(Number.isFinite(Date.parse(r.reviewed)));assert(Date.parse(r.announced)<=Date.parse(r.reviewed));assert(r.conditions.length>0);}
});
test('checker renders documented, unknown, changed-form and load-failure results',async()=>{
 const storage={};global.localStorage={getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v};
 const nodes={};global.document={getElementById(id){return nodes[id]??={value:id==='accessForm'?'fresh':'',append(){},addEventListener(k,f){this[k]=f}}},createElement(){return {}}};
 global.fetch=async()=>({ok:true,json:async()=>data});let opened=0;await access.init(db.crops,()=>{opened++;return '榴莲'});
 assert.match(nodes.accessResult.innerHTML,/Select an origin/);
 nodes.originSelector.value='MY';nodes.originSelector.change();assert.equal(opened,1);assert.equal(nodes.accessOrigin.value,'MY');assert.equal(nodes.originBrand.textContent,'MALAYSIA EXPORT REFERENCE');assert.equal(nodes.originRoute.textContent,'Malaysia → Mainland China');assert.equal(storage['china-mrl-origin'],'MY');
 assert.match(nodes.accessResult.innerHTML,/Protocol documented/);assert.match(nodes.accessResult.innerHTML,/Current operational clearance: not verified/);
 nodes.accessForm.value='frozen';nodes.accessForm.change();assert.match(nodes.accessResult.innerHTML,/Not verified/);assert(!nodes.accessResult.innerHTML.includes('data-crop='));
 nodes.accessForm.value='fresh';nodes.accessOrigin.value='LA';nodes.accessCrop.value='辣椒';nodes.accessCrop.change();assert.equal(nodes.originSelector.value,'LA');assert.equal(nodes.originRoute.textContent,"Laos → Mainland China");assert.match(nodes.accessResult.innerHTML,/fumigation followed by cold treatment/);
 nodes.originSelector.value='';nodes.originSelector.change();assert.equal(nodes.accessOrigin.value,'');assert.match(nodes.accessResult.innerHTML,/Select an origin/);
 assert.equal(nodes.originBrand.textContent,'GLOBAL EXPORT REFERENCE');assert.equal(storage['china-mrl-origin'],'');
 storage['china-mrl-origin']='MY';await access.init(db.crops);assert.equal(nodes.originSelector.value,'MY');assert.equal(nodes.originRoute.textContent,'Malaysia → Mainland China');
 storage['china-mrl-origin']='invalid';await access.init(db.crops);assert.equal(nodes.originSelector.value,'');
 global.fetch=async()=>({ok:false});await access.init(db.crops);assert.match(nodes.accessResult.textContent,/could not load/);
 delete global.localStorage;delete global.document;delete global.fetch;
});
