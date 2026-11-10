const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
test('both PWA deployments have complete caches, installable manifests and correct icon sizes',()=>{
 for(const base of ['.','dist']){
  const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.webmanifest')));
  assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');
  for(const icon of manifest.icons){const png=fs.readFileSync(path.join(base,icon.src));assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`,icon.sizes)}
  const worker=fs.readFileSync(path.join(base,'sw.js'),'utf8');const ctx={URL,self:{registration:{scope:'https://example.test/china-mrl/'},addEventListener(){}}};vm.createContext(ctx);vm.runInContext(worker+';globalThis.files=FILES;',ctx);
  for(const file of ctx.files)assert(fs.existsSync(path.join(base,file==='./'?'index.html':file)),file);
 }
 assert(fs.readFileSync('index.html','utf8').includes('href="../manifest.webmanifest"'));
});
