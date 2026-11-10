const CACHE_PREFIX='china-mrl-'+self.registration.scope+'|';
const CACHE=CACHE_PREFIX+'f05e0a14b599e181';
const META=CACHE_PREFIX+'active';
const POINTER=new URL('__active_snapshot__',self.registration.scope).href;
const FILES=["./", "index.html", "manifest.webmanifest", "dist/index.html", "dist/style.css", "dist/app.js", "dist/rules.js", "dist/market-access.js", "dist/pwa.js", "dist/database.json", "dist/market-access.json", "dist/data.json", "dist/standard.pdf", "dist/icons/icon-192.png", "dist/icons/icon-512.png", "dist/icons/maskable-512.png", "dist/icons/apple-touch-icon.png", "dist/icons/favicon.png", "dist/fonts/dmsans-OFL.txt", "dist/fonts/font-0.ttf", "dist/fonts/font-1.ttf", "dist/fonts/font-2.ttf", "dist/fonts/font-3.ttf", "dist/fonts/font-4.ttf", "dist/fonts/font-5.ttf", "dist/fonts/font-6.ttf", "dist/fonts/font-7.ttf", "dist/fonts/font-8.ttf", "dist/fonts/manrope-OFL.txt", "dist/screenshots/desktop.png", "dist/screenshots/mobile.png"];
let refreshing;
async function activeName(){const entry=await (await caches.open(META)).match(POINTER);return entry?entry.text():CACHE}
async function selectCache(name){await (await caches.open(META)).put(POINTER,new Response(name))}
async function populate(name){
 const cache=await caches.open(name);
 try{await cache.addAll(FILES.map(file=>new Request(new URL(file,self.registration.scope),{cache:'reload'})))}
 catch(error){await caches.delete(name);throw error}
}
// Do not await navigation: its fetch can wait for this activation to finish.
async function reloadWindows(){for(const client of await self.clients.matchAll({type:'window'}))if(client.url.startsWith(self.registration.scope))client.navigate(client.url).catch(()=>{})}
self.addEventListener('install',event=>event.waitUntil((async()=>{await populate(CACHE);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys(),hadPrevious=keys.some(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE&&key!==META);
 await selectCache(CACHE);await self.clients.claim();
 for(const key of keys)if(key.startsWith(CACHE_PREFIX)&&key!==CACHE&&key!==META)await caches.delete(key);
 // This also upgrades installations still running the previous manual-update client.
 if(hadPrevious)await reloadWindows();
})()));
async function checkSnapshot(){
 if(refreshing)return refreshing;
 refreshing=(async()=>{
  const index=new URL('index.html',self.registration.scope),response=await fetch(index,{cache:'no-store'});
  if(!response.ok)return;
  const html=await response.text(),oldName=await activeName(),old=await (await caches.open(oldName)).match(index);
  if(old&&await old.text()===html)return;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(html));
  const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const name=CACHE_PREFIX+'snapshot-'+hash;
  if(name===oldName)return;
  await populate(name);
  // Ensure the index did not change again while downloading the snapshot.
  const ready=await (await caches.open(name)).match(index);
  if(!ready||await ready.text()!==html){await caches.delete(name);return}
  await selectCache(name);await reloadWindows();
  if(oldName!==name)await caches.delete(oldName);
 })().catch(()=>{/* Keep the complete previous snapshot on network/storage failure. */}).finally(()=>{refreshing=null});
 return refreshing;
}
self.addEventListener('message',event=>{
 if(event.data?.type==='CHECK_FOR_UPDATES')event.waitUntil(checkSnapshot());
 if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const cache=await caches.open(await activeName());
  const cached=await cache.match(event.request,{ignoreSearch:true});if(cached)return cached;
  try{return await fetch(event.request)}catch(error){
   if(event.request.mode==='navigate')return await cache.match(new URL('index.html',self.registration.scope));
   return Response.error();
  }
 })());
});
