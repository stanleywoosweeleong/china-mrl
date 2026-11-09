"""Generate manifests and versioned workers for standalone dist and root Pages hosting."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
dist=root/'dist'
assets=['index.html','style.css','app.js','rules.js','market-access.js','pwa.js','database.json','market-access.json','data.json','standard.pdf','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon.png']
assets += [str(p.relative_to(dist)) for folder in ['fonts','screenshots'] for p in sorted((dist/folder).glob('*'))]
for target,prefix in [(dist,''),(root,'dist/')]:
 manifest=dict(id='/china-mrl/'+('dist/' if target==dist else ''),name='China MRL — Export Reference',short_name='China MRL',description='China residue limits and source-linked market-access references for produce exporters.',lang='en',start_url='./',scope='./',display='standalone',background_color='#f7f8f4',theme_color='#29654e',icons=[dict(src=prefix+'icons/'+f,sizes=size,type='image/png',purpose=purpose) for f,size,purpose in [('icon-192.png','192x192','any'),('icon-512.png','512x512','any'),('maskable-512.png','512x512','maskable')]])
 manifest['screenshots']=[dict(src=prefix+'screenshots/'+name+'.png',sizes=size,type='image/png',form_factor=factor,label=label) for name,size,factor,label in [('desktop','1440x900','wide','Fresh produce residue reference'),('mobile','390x844','narrow','China MRL on mobile')]]
 (target/'manifest.webmanifest').write_text(json.dumps(manifest,indent=2)+'\n')
 paths=['./','index.html','manifest.webmanifest']+[prefix+a for a in assets if prefix or a!='index.html']
 paths=list(dict.fromkeys(paths))
 digest=hashlib.sha256(b''.join((target/p).read_bytes() for p in paths if p!='./')).hexdigest()[:16]
 worker='''const CACHE_PREFIX='china-mrl-'+self.registration.scope+'|';
const CACHE=CACHE_PREFIX+'VERSION';
const FILES=FILES_JSON;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(CACHE_PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  try{return await fetch(event.request)}catch(error){
   if(event.request.mode==='navigate')return await cache.match(new URL('index.html',self.registration.scope));
   return Response.error();
  }
 })());
});
'''.replace('VERSION',digest).replace('FILES_JSON',json.dumps(paths))
 (target/'sw.js').write_text(worker)
print('Generated root and standalone PWA manifests/workers.')
