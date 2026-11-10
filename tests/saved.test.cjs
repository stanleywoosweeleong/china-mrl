const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
// Saved references must be re-resolved so conflicts and CSV guards survive the Saved tab.
test('saved crop references keep conflict flags; CSV neutralises formula prefixes',async()=>{
 const data=JSON.parse(fs.readFileSync('dist/database.json')),base=data.rows.find(r=>r.id==='312:6580');
 // Synthetic second direct row for the same pesticide with a different limit creates a conflict.
 data.rows.push({...base,id:'312:test',mrl:base.mrl+1,qualifier:'-test'});
 const nodes={},listeners={};function node(){return {value:'',hidden:false,textContent:'',innerHTML:'',style:{},dataset:{},events:{},append(){},addEventListener(k,fn){this.events[k]=fn},classList:{toggle(){}},showModal(){},validity:{valid:true},click(){}}}
 let exported;const ctx={document:{getElementById:id=>nodes[id]??=node(),querySelectorAll:()=>[],addEventListener(k,fn){listeners[k]=fn},createElement:node},localStorage:{getItem:k=>k==='china-mrl-v2-saved'?JSON.stringify(['312:6580|榴莲','312:test|榴莲']):k==='china-mrl-v2-migrated'?'1':null,setItem(){}},fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(data)}),setTimeout:()=>{},URL:{createObjectURL(b){exported=b;return 'blob:'},revokeObjectURL(){}},Blob,console,window:{print(){}},MRL:require('../dist/rules.js')};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);await new Promise(r=>setImmediate(r));
 vm.runInContext("setTab('saved')",ctx);assert.equal(nodes.resultCount.textContent,'2');assert(nodes.rows.innerHTML.includes('Conflicting matches'));
 vm.runInContext("details('312:6580|榴莲')",ctx);nodes.lab.value='0.1';nodes.lab.events.input();assert(nodes.comparison.textContent.includes('Comparison blocked'));
 vm.runInContext("setTab('saved')",ctx);vm.runInContext('downloadCsv()',ctx);const csv=await exported.text();assert(csv.includes('"\'-test"'));assert(!csv.includes('"-test"'));
});
