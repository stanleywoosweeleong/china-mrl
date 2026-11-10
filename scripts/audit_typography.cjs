const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const p = await b.newPage({ serviceWorkers: 'block' });
  await p.goto(process.env.AUDIT_URL || 'https://stanleywoosweeleong.github.io/china-mrl/');
  await p.waitForFunction(() => !document.getElementById('originSelector').disabled);
  const results = [];
  for (const width of [320, 390, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    for (const tab of ['fresh', 'full', 'access', 'sources', 'guide', 'exempt', 'saved', 'detail']) {
      await p.locator('nav [data-tab="' + (tab === 'detail' ? 'fresh' : tab) + '"]').click();
      if (tab === 'detail') await p.locator('[data-detail]').first().click();
      await p.evaluate(() => document.fonts.ready);
      results.push(
        await p.evaluate(
          ({ width, tab }) => {
            const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
            const lum = (c) =>
              c
                .map((v) => v / 255)
                .map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
                .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
            const bad = [],
              sizes = [];
            let minimum = 100;
            for (const e of document.querySelectorAll('body *')) {
              if (
                !e.getClientRects().length ||
                !Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()) ||
                e.closest('button:disabled') ||
                ['SCRIPT', 'STYLE', 'OPTION'].includes(e.tagName)
              )
                continue;
              const c = getComputedStyle(e);
              if (c.visibility === 'hidden') continue;
              let bg = 'rgb(255,255,255)';
              for (let a = e; a; a = a.parentElement) {
                const col = getComputedStyle(a).backgroundColor;
                if (!['rgba(0, 0, 0, 0)', 'transparent'].includes(col)) {
                  bg = col;
                  break;
                }
              }
              const l1 = lum(rgb(c.color)),
                l2 = lum(rgb(bg)),
                ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
              minimum = Math.min(minimum, ratio);
              if (ratio < 7)
                bad.push({
                  text: e.textContent.trim().slice(0, 40),
                  ratio: ratio.toFixed(2),
                  color: c.color,
                  bg
                });
              if (parseFloat(c.fontSize) < 13)
                sizes.push({ text: e.textContent.slice(0, 30), size: c.fontSize });
            }
            return {
              width,
              tab,
              minimum: minimum.toFixed(2),
              bad,
              sizes,
              overflow: document.documentElement.scrollWidth > width
            };
          },
          { width, tab }
        )
      );
      if (tab === 'detail') await p.locator('.close').click();
    }
  }
  console.log(JSON.stringify(results, null, 2));
  await b.close();
  if (results.some((r) => r.bad.length || r.sizes.length || r.overflow)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
