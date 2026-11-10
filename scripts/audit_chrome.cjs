// Use a regular temporary profile: incognito disables PWA installability checks.
const {chromium}=require('playwright'),fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert');
(async()=>{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'mrl-chrome-'));
 const ctx=await chromium.launchPersistentContext(profile,{executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report={url:process.env.AUDIT_URL||'https://stanleywoosweeleong.github.io/china-mrl/',checkedAt:new Date().toISOString(),browser:ctx.browser()?.version(),findings:[]};
 try{
 const page=await ctx.newPage(),cdp=await ctx.newCDPSession(page);
 page.on('console',m=>{if(['warning','error'].includes(m.type()))report.findings.push({type:m.type(),text:m.text()})});
 page.on('pageerror',e=>report.findings.push({type:'exception',text:e.message}));
 page.on('requestfailed',r=>report.findings.push({type:'request',url:r.url(),error:r.failure()}));
 page.on('response',r=>{if(r.status()>=400)report.findings.push({type:'http',url:r.url(),status:r.status()})});
 await cdp.send('Audits.enable');await cdp.send('Log.enable');
 cdp.on('Audits.issueAdded',x=>report.findings.push({type:'issue',...x}));
 cdp.on('Log.entryAdded',x=>{if(['warning','error'].includes(x.entry.level))report.findings.push({type:'log',...x})});
 await page.goto(report.url);await page.waitForFunction(()=>document.getElementById('pwaReady').textContent.includes('Offline reference ready'));
 for(const tab of ['full','access','sources','guide','exempt','saved','fresh'])await page.locator('nav [data-tab="'+tab+'"]').click();
 await page.selectOption('#originSelector','MY');assert.equal(await page.locator('#originRoute').innerText(),'Malaysia → Mainland China');assert.equal(await page.locator('#originBrand').innerText(),'MALAYSIA EXPORT REFERENCE');await page.locator('nav [data-tab="fresh"]').click();
 await page.locator('[data-detail]').first().click();await page.locator('#lab').fill('0.01');await page.locator('.close').click();
 const manifest=await cdp.send('Page.getAppManifest');report.manifestErrors=manifest.errors;report.appId=manifest.manifest?.id;
 report.installability=(await cdp.send('Page.getInstallabilityErrors')).installabilityErrors;
 const data=JSON.parse(manifest.data);assert(data.screenshots.some(s=>s.form_factor==='wide'));assert(data.screenshots.some(s=>s.form_factor==='narrow'));
 await page.setViewportSize({width:390,height:844});await page.reload();await page.waitForFunction(()=>document.getElementById('resultCount').textContent==='88');
 await ctx.setOffline(true);await page.reload();await page.waitForFunction(()=>document.getElementById('resultCount').textContent==='88');
 assert.equal(await page.locator('#originSelector').inputValue(),'MY');assert.equal(await page.locator('#originRoute').innerText(),'Malaysia → Mainland China');
 await page.locator('nav [data-tab="access"]').click();await page.selectOption('#accessOrigin','');assert.equal(await page.locator('#originSelector').inputValue(),'');assert.equal(await page.locator('#originRoute').innerText(),'All origins → Mainland China');
 report.offlinePassed=true;assert.equal(report.findings.length,0);assert.equal(report.manifestErrors.length,0);assert.equal(report.installability.length,0);
 }finally{console.log(JSON.stringify(report,null,2));await ctx.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
