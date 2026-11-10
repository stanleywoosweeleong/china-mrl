const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');let revision=1,workerRevision=1,fail=false;
const server=http.createServer((req,res)=>{let url=new URL(req.url,'http://localhost'),file=url.pathname.replace(/^\/china-mrl\//,'');if(!file)file='index.html';const absolute=path.join(root,file);
 if(fail&&file==='dist/database.json'){res.writeHead(503);res.end();return}
 if(!fs.existsSync(absolute)){res.writeHead(404);res.end();return}
 let body=fs.readFileSync(absolute);
 if(file==='index.html')body=Buffer.from(body.toString().replace('<body>',`<body data-revision="${revision}">`));
 if(file==='sw.js'&&workerRevision>1)body=Buffer.from(body.toString().replace("const CACHE=CACHE_PREFIX+'",`const CACHE=CACHE_PREFIX+'test-${workerRevision}-`));
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':file.endsWith('.webmanifest')?'application/manifest+json':'application/octet-stream');res.end(body);
});
(async()=>{await new Promise(r=>server.listen(8091,r));const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const page=await b.newPage();page.setDefaultTimeout(20000);let navigations=0;page.on('framenavigated',f=>{if(f===page.mainFrame())navigations++});
 await page.goto('http://localhost:8091/china-mrl/');await page.waitForFunction(()=>!!navigator.serviceWorker.controller&&document.getElementById('originSelector').value==='MY');
 await page.selectOption('#originSelector','');await page.locator('nav [data-tab="fresh"]').click();await page.locator('[data-save]').first().click();
 console.log("Initial ready");revision=2;await page.evaluate(()=>navigator.serviceWorker.controller.postMessage({type:'CHECK_FOR_UPDATES'}));
 await page.waitForFunction(()=>document.body.dataset.revision==='2'&&!document.getElementById('originSelector').disabled);assert.equal(await page.locator('#originSelector').inputValue(),'');assert.equal(await page.locator('#savedCount').innerText(),'1');
 // A failed asset download must leave the complete old snapshot active.
 console.log("HTML update ready");revision=3;fail=true;await page.evaluate(()=>navigator.serviceWorker.controller.postMessage({type:'CHECK_FOR_UPDATES'}));await page.waitForTimeout(1500);assert.equal(await page.getAttribute('body','data-revision'),'2');
 fail=false;await page.evaluate(()=>navigator.serviceWorker.controller.postMessage({type:'CHECK_FOR_UPDATES'}));await page.waitForFunction(()=>document.body.dataset.revision==='3');
 console.log("Rollback/retry ready");revision=4;workerRevision=2;await page.evaluate(()=>{navigator.serviceWorker.getRegistration().then(reg=>reg.update()).catch(()=>{})});await page.waitForFunction(()=>document.body.dataset.revision==='4');
 const settled=navigations;await page.waitForTimeout(1500);assert.equal(navigations,settled,'No reload loop');
 await page.context().setOffline(true);await page.reload();await page.waitForFunction(()=>document.getElementById('savedCount').textContent==='1');assert.equal(await page.getAttribute('body','data-revision'),'4');assert.equal(await page.locator('#originSelector').inputValue(),'');
 console.log('Automatic HTML-only update, worker update, failed-download rollback, no reload loop, saved state/Global preference and offline use passed.');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
