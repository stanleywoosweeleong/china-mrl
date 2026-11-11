const { chromium } = require('playwright');
const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  assert = require('assert');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]).replace(/^\/china-mrl\//, '/');
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!fs.existsSync(f)) {
    res.writeHead(404);
    return res.end();
  }
  res.setHeader(
    'Content-Type',
    f.endsWith('.js')
      ? 'application/javascript'
      : f.endsWith('.json')
        ? 'application/json'
        : f.endsWith('.webmanifest')
          ? 'application/manifest+json'
          : f.endsWith('.html')
            ? 'text/html'
            : f.endsWith('.css')
              ? 'text/css'
              : 'application/octet-stream'
  );
  res.end(fs.readFileSync(f));
});
(async () => {
  await new Promise((r) => server.listen(8087, r));
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  try {
    for (const suffix of ['/china-mrl/', '/dist/']) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto('http://localhost:8087' + suffix);
      // First visit: continue past the welcome screen.
      await page.locator('#welcomeDone').click();
      await page.waitForFunction(() =>
        document.getElementById('pwaReady').textContent.includes('Offline reference ready')
      );
      assert.equal(await page.locator('#resultCount').innerText(), '89');
      const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
      assert(scope.endsWith(suffix));
      await ctx.setOffline(true);
      await page.reload();
      await page.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
      assert((await page.locator('#offlineStatus').innerText()).includes('Offline'));
      assert(await page.evaluate(async () => (await fetch('standard.pdf')).ok));
      await page.selectOption('#originSelector', 'MY');
      await page.waitForFunction(() =>
        document.getElementById('accessResult').textContent.includes('Approved market access')
      );
      await ctx.setOffline(false);
      await page.evaluate(async () => {
        for (const k of await caches.keys()) await caches.delete(k);
      });
      await page.reload();
      await page.waitForFunction(
        async () => {
          for (const k of await caches.keys()) {
            const c = await caches.open(k);
            if ((await c.keys()).length > 20) return true;
          }
          return false;
        },
        null,
        { timeout: 60000 }
      );
      await page.waitForTimeout(3000);
      await page.waitForLoadState('load');
      await ctx.setOffline(true);
      await page.reload();
      await page.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
      console.log(
        suffix + ' offline reload, MRL search, market access, PDF and evicted-cache recovery passed'
      );
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  server.close();
  process.exitCode = 1;
});
