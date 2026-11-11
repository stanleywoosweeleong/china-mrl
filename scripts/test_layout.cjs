// Layout check for every tab at phone and desktop widths, in English and Chinese: no horizontal page scroll, no console or page
// errors, and the detail dialog fits the viewport. Screenshots go to SCREENSHOT_DIR for review (CI artifact).
const { chromium } = require('playwright'),
  assert = require('assert'),
  fs = require('fs'),
  { openDetails } = require('./ui_helpers.cjs');
const url = process.env.AUDIT_URL || 'http://localhost:8089/china-mrl/';
const out = process.env.SCREENSHOT_DIR || 'test-results/screenshots';
const tabs = ['fresh', 'full', 'saved', 'banned', 'exempt', 'sources', 'access', 'guide'];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const problems = [];
  try {
    for (const lang of ['en', 'zh', 'ms'])
      for (const [width, height] of [
        [320, 640],
        [390, 844],
        [1280, 800],
        [1440, 900]
      ]) {
        const tag = `${lang} ${width}px`;
        const page = await browser.newPage({ viewport: { width, height }, serviceWorkers: 'block' });
        page.on('pageerror', (e) => problems.push(`${tag} page error: ${e.message}`));
        page.on('console', (m) => m.type() === 'error' && problems.push(`${tag} console error: ${m.text()}`));
        await page.goto(url + '?lang=' + lang);
        await page.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
        for (const tab of tabs) {
          await page.evaluate((t) => setTab(t), tab);
          await page.waitForTimeout(200);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth
          );
          if (overflow > 0) problems.push(`${tag} ${tab}: page scrolls sideways by ${overflow}px`);
          if (width < 760) {
            // On phones nothing may slide sideways inside the page either (wide tables, tab strips).
            const sliding = await page.evaluate(() =>
              [...document.querySelectorAll('body *')]
                .filter(
                  (e) =>
                    e.offsetParent &&
                    e.scrollWidth > e.clientWidth + 1 &&
                    !['visible', 'hidden'].includes(getComputedStyle(e).overflowX)
                )
                .map((e) => e.id || e.className || e.tagName)
            );
            if (sliding.length) problems.push(`${tag} ${tab}: scrolls sideways inside ${sliding.join(', ')}`);
            // Finger-sized targets: every visible control is at least 44px tall.
            const small = await page.evaluate(() =>
              [
                ...document.querySelectorAll(
                  'main button, main select, main input, main summary, nav button, header button, header select'
                )
              ]
                .filter((e) => e.offsetParent && !e.closest('.row-actions .view'))
                .filter((e) => e.getBoundingClientRect().height < 43.5 && e.getBoundingClientRect().width > 2)
                .map(
                  (e) =>
                    (e.id || e.className || e.textContent.trim().slice(0, 20)) +
                    ' ' +
                    Math.round(e.getBoundingClientRect().height) +
                    'px'
                )
            );
            if (small.length)
              problems.push(`${tag} ${tab}: touch targets under 44px: ${[...new Set(small)].join(', ')}`);
          }
          if (lang === 'zh') {
            // Visible text left in English, apart from names shown in both languages and the brand.
            const english = await page.evaluate(() => {
              const found = new Set(),
                walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
              while (walker.nextNode()) {
                const el = walker.currentNode.parentElement,
                  text = walker.currentNode.nodeValue.replace(/\s+/g, ' ').trim();
                if (!el.offsetParent || el.closest('script,style,pre,option,[lang="en"],[lang="zh"]'))
                  continue;
                if (
                  /[A-Za-z]{3,}\s+[A-Za-z]{2,}/.test(text) &&
                  !/[\u4e00-\u9fff]/.test(text) &&
                  text !== 'China MRL'
                )
                  found.add(text.slice(0, 60));
              }
              return [...found];
            });
            if (english.length) problems.push(`${tag} ${tab}: untranslated text ${JSON.stringify(english)}`);
          }
          await page.screenshot({ path: `${out}/${lang}-${width}-${tab}.png`, fullPage: true });
        }
        await page.evaluate(() => document.querySelector('nav [data-tab="fresh"]').click());
        await openDetails(page, page.locator('#rows tr').first());
        const box = await page.locator('#detail').boundingBox();
        if (!box || box.width > width) problems.push(`${tag} detail dialog wider than viewport`);
        // The detail is either a modal dialog or the fixed side panel, never loose in the page.
        const placement = await page.evaluate(() => {
          const d = document.getElementById('detail');
          return { modal: d.matches(':modal'), position: getComputedStyle(d).position };
        });
        if (!placement.modal && placement.position !== 'fixed')
          problems.push(`${tag} detail opens neither as a dialog nor as the side panel`);
        await page.screenshot({ path: `${out}/${lang}-${width}-detail.png` });
        await page.close();
      }
    // The switch reloads into the other language and remembers it.
    const page = await browser.newPage({ serviceWorkers: 'block' });
    await page.goto(url + '?lang=en');
    await page.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
    // The switch offers three languages, changes in place and remembers the choice.
    assert.equal(await page.locator('#langSelect').inputValue(), 'en');
    await page.selectOption('#langSelect', 'zh');
    await page.waitForFunction(() => document.documentElement.dataset.langReady === 'zh');
    assert.equal(await page.locator('#title').innerText(), '查清限量，核对原文。');
    await page.selectOption('#langSelect', 'ms');
    await page.waitForFunction(() => document.documentElement.dataset.langReady === 'ms');
    assert.equal(await page.locator('#title').innerText(), 'Ketahui hadnya. Lihat sumbernya.');
    assert(!page.url().includes('lang='));
    await page.reload();
    await page.waitForFunction(() => document.documentElement.dataset.langReady === 'ms');
    assert.equal(await page.locator('#langSelect').inputValue(), 'ms');
    await page.close();
    assert.deepEqual(problems, []);
    console.log(
      `Layout: ${tabs.length} tabs and the detail dialog at 320px, 390px, 1280px and 1440px in English, Chinese and Malay, plus the language switch, passed; screenshots in ${out}.`
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
