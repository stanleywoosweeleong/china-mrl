// Language switch: applied in place (no reload), and the result on every tab, with a detail open and in
// the market-access checker, must read exactly like a fresh load in that language.
const { chromium } = require('playwright'),
  assert = require('assert'),
  { openTab } = require('./ui_helpers.cjs');
const url = process.env.AUDIT_URL || 'http://localhost:8089/china-mrl/';
const tabs = ['fresh', 'full', 'saved', 'banned', 'exempt', 'sources', 'access', 'guide'];
const text = (page) =>
  page.evaluate(() =>
    [
      document.title,
      document.documentElement.lang,
      document.body.innerText,
      ...[...document.querySelectorAll('[placeholder],[aria-label]')].map(
        (e) => (e.getAttribute('placeholder') || '') + '|' + (e.getAttribute('aria-label') || '')
      )
    ]
      .join('\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n+/g, '\n')
  );
const firstDifference = (a, b) => {
  const x = a.split('\n'),
    y = b.split('\n');
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    if (x[i] !== y[i])
      return `line ${i + 1}: switched ${JSON.stringify(x[i])} vs fresh ${JSON.stringify(y[i])}`;
  return '';
};
// Brings a page to one of the compared states.
async function goTo(page, state) {
  if (state === 'detail') {
    await openTab(page, 'fresh');
    // The same limit in both languages (result order differs: alphabetical vs pinyin).
    await page.evaluate(() => details('312:6580|榴莲'));
  } else if (state === 'full search') {
    await openTab(page, 'full');
    await page.locator('#search').fill('lettuce');
  } else if (state === 'access crop') {
    await openTab(page, 'fresh');
    await page.locator('[data-access-view]').click();
  } else await openTab(page, state);
  await page.waitForTimeout(150);
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const problems = [];
  let slowest = 0;
  try {
    for (const width of [390, 1280])
      for (const [from, to] of [
        ['en', 'zh'],
        ['zh', 'ms'],
        ['ms', 'en']
      ])
        for (const state of [...tabs, 'detail', 'full search', 'access crop']) {
          const open = async (lang) => {
            const page = await browser.newPage({ viewport: { width, height: 844 }, serviceWorkers: 'block' });
            page.on('pageerror', (e) => problems.push(`${width}px ${from}→${to} ${state}: ${e.message}`));
            await page.goto(url + '?lang=' + lang);
            await page.waitForFunction(
              () =>
                document.getElementById('resultCount').textContent === '89' &&
                !document.getElementById('originSelector').disabled
            );
            return page;
          };
          const switched = await open(from),
            fresh = await open(to);
          await goTo(switched, state);
          await goTo(fresh, state);
          await switched.evaluate(() => (window.__sameDocument = true));
          const took = await switched.evaluate((next) => {
            const start = performance.now(),
              select = document.getElementById('langSelect');
            select.value = next;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            return performance.now() - start;
          }, to);
          slowest = Math.max(slowest, took);
          await switched.waitForTimeout(150);
          if (!(await switched.evaluate(() => window.__sameDocument)))
            problems.push(`${width}px ${from}→${to} ${state}: the page reloaded`);
          if (switched.url().includes('lang='))
            problems.push(`${width}px ${from}→${to} ${state}: ?lang= left in the address`);
          const difference = firstDifference(await text(switched), await text(fresh));
          if (difference) problems.push(`${width}px ${from}→${to} ${state}: ${difference}`);
          // The choice is remembered.
          if (state === 'fresh') {
            await switched.reload();
            await switched.waitForFunction((l) => document.documentElement.dataset.lang === l, to);
          }
          await switched.close();
          await fresh.close();
        }
    assert.deepEqual(problems, []);
    assert(slowest < 1500, `switch took ${Math.round(slowest)}ms`);
    console.log(
      `Language switch: in place on ${tabs.length + 3} views at 390px and 1280px between English, Chinese and Malay, identical to a fresh load; slowest switch ${Math.round(slowest)}ms.`
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
