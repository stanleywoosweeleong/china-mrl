// Layout check for every tab at phone and desktop widths: no horizontal page scroll, no console or page
// errors, and the detail dialog fits the viewport. Screenshots go to SCREENSHOT_DIR for review (CI artifact).
const { chromium } = require('playwright'),
  assert = require('assert'),
  fs = require('fs');
const url = process.env.AUDIT_URL || 'http://localhost:8089/china-mrl/';
const out = process.env.SCREENSHOT_DIR || 'test-results/screenshots';
const tabs = ['fresh', 'full', 'saved', 'exempt', 'sources', 'access', 'guide'];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const problems = [];
  try {
    for (const [width, height] of [
      [390, 844],
      [1440, 900]
    ]) {
      const page = await browser.newPage({ viewport: { width, height }, serviceWorkers: 'block' });
      page.on('pageerror', (e) => problems.push(`${width}px page error: ${e.message}`));
      page.on(
        'console',
        (m) => m.type() === 'error' && problems.push(`${width}px console error: ${m.text()}`)
      );
      await page.goto(url);
      await page.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
      for (const tab of tabs) {
        await page.evaluate((t) => document.querySelector(`nav [data-tab="${t}"]`).click(), tab);
        await page.waitForTimeout(200);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 0) problems.push(`${width}px ${tab}: page scrolls sideways by ${overflow}px`);
        await page.screenshot({ path: `${out}/${width}-${tab}.png`, fullPage: true });
      }
      await page.evaluate(() => document.querySelector('nav [data-tab="fresh"]').click());
      await page.locator('[data-detail]').first().click();
      const box = await page.locator('#detail').boundingBox();
      if (!box || box.width > width) problems.push(`${width}px detail dialog wider than viewport`);
      await page.screenshot({ path: `${out}/${width}-detail.png` });
      await page.close();
    }
    assert.deepEqual(problems, []);
    console.log(
      `Layout: ${tabs.length} tabs and the detail dialog at 390px and 1440px passed; screenshots in ${out}.`
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
