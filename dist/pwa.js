(()=>{
 const status=document.getElementById('offlineStatus'),install=document.getElementById('installApp'),update=document.getElementById('updateApp');
 let prompt,registration,reloading=false;
 const connectivity=()=>{status.textContent=navigator.onLine?'Reference snapshot · not a live regulatory feed':'Offline · using downloaded reference data. Verify current requirements before shipment.'};
 connectivity();window.addEventListener('online',connectivity);window.addEventListener('offline',connectivity);
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;install.hidden=false});
 install.addEventListener('click',async()=>{if(!prompt)return;await prompt.prompt();await prompt.userChoice;prompt=null;install.hidden=true});
 window.addEventListener('appinstalled',()=>{install.hidden=true;document.getElementById('installHelp').hidden=true});
 if(!('serviceWorker' in navigator)){document.getElementById('pwaReady').textContent='Offline storage is not supported in this browser.';return;}
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)location.reload()});
 update.addEventListener('click',()=>{if(registration?.waiting){reloading=true;registration.waiting.postMessage({type:'SKIP_WAITING'})}});
 // Resolve against the page URL, not its asset <base>, so Pages controls the repository root.
 navigator.serviceWorker.register(new URL('sw.js',location.href),{updateViaCache:'none'}).then(reg=>{
  registration=reg;
  const waiting=()=>{update.hidden=!reg.waiting};waiting();
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')waiting()})});
  navigator.serviceWorker.ready.then(()=>{document.getElementById('pwaReady').textContent='Offline reference ready · includes the source PDF.'});
 }).catch(()=>{document.getElementById('pwaReady').textContent='Offline storage unavailable. You can continue online; reload to retry.'});
})();
