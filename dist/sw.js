const CACHE_PREFIX='china-mrl-'+self.registration.scope+'|';
const CACHE=CACHE_PREFIX+'29fc7c7e5d7d3c5c';
const FILES=["./", "index.html", "manifest.webmanifest", "style.css", "app.js", "rules.js", "market-access.js", "pwa.js", "database.json", "market-access.json", "data.json", "standard.pdf", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.png"];
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
