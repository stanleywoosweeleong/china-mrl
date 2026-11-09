const CACHE_PREFIX='china-mrl-'+self.registration.scope+'|';
const CACHE=CACHE_PREFIX+'b6134d6a38111072';
const FILES=["./", "index.html", "manifest.webmanifest", "dist/index.html", "dist/style.css", "dist/app.js", "dist/rules.js", "dist/market-access.js", "dist/pwa.js", "dist/database.json", "dist/market-access.json", "dist/data.json", "dist/standard.pdf", "dist/icons/icon-192.png", "dist/icons/icon-512.png", "dist/icons/maskable-512.png", "dist/icons/apple-touch-icon.png", "dist/icons/favicon.png", "dist/fonts/dmsans-OFL.txt", "dist/fonts/font-0.ttf", "dist/fonts/font-1.ttf", "dist/fonts/font-2.ttf", "dist/fonts/font-3.ttf", "dist/fonts/font-4.ttf", "dist/fonts/font-5.ttf", "dist/fonts/font-6.ttf", "dist/fonts/font-7.ttf", "dist/fonts/font-8.ttf", "dist/fonts/manrope-OFL.txt", "dist/screenshots/desktop.png", "dist/screenshots/mobile.png"];
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
