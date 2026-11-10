// Accessibility check with axe-core (WCAG 2.1 A and AA, including colour contrast) on every tab, the crop
// picker and the detail view, at phone and desktop widths, in English and Chinese.
const { chromium } = require('playwright'),
  assert = require('assert'),
  fs = require('fs'),
  { openTab, openDetails } = require('./ui_helpers.cjs');
const url = process.env.AUDIT_URL || 'http://localhost:8089/china-mrl/';
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const tabs = ['fresh', 'full', 'saved', 'exempt', 'sources', 'access', 'guide'];
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const found = new Map();
  const scan = async (page, where) => {
    const violations = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
      return r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes
          .slice(0, 4)
          .map((n) => n.target.join(' ') + (n.any[0]?.message ? ' — ' + n.any[0].message : ''))
      }));
    });
    for (const v of violations) {
      const key = v.id;
      if (!found.has(key)) found.set(key, { ...v, where: [] });
      found.get(key).where.push(where);
    }
  };
  try {
    for (const lang of ['en', 'zh'])
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
        await page.goto(url + '?lang=' + lang);
        await page.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
        await page.addScriptTag({ content: axe });
        for (const tab of tabs) {
          await openTab(page, tab);
          await page.waitForTimeout(150);
          await scan(page, `${lang} ${width} ${tab}`);
        }
        await openTab(page, 'fresh');
        await page.locator('#cropSearch').fill('man');
        await scan(page, `${lang} ${width} crop picker`);
        await page.keyboard.press('Escape');
        await page.locator('#search').click();
        await openDetails(page, page.locator('#rows tr').first());
        await page.waitForTimeout(150);
        await scan(page, `${lang} ${width} detail`);
        await page.close();
      }
    const list = [...found.values()];
    for (const v of list)
      console.log(
        `${v.impact} ${v.id}: ${v.help}\n  first seen: ${v.where[0]} (${v.where.length} views)\n  ${v.nodes.join('\n  ')}`
      );
    assert.equal(list.length, 0, `${list.length} accessibility rule(s) violated`);
    console.log(
      'Accessibility: no WCAG 2.1 A/AA violations on any tab, the crop picker or the detail view, in both languages.'
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
