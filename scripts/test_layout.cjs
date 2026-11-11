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
    assert.equal((await page.locator('#langButton').innerText()).trim(), 'EN');
    assert(await page.locator('#langMenu').isHidden());
    await page.locator('#langButton').click();
    assert.equal(await page.locator('#langMenu button').count(), 3);
    await page.locator('#langMenu [data-lang="zh"]').click();
    assert(await page.locator('#langMenu').isHidden());
    await page.waitForFunction(() => document.documentElement.dataset.langReady === 'zh');
    assert.equal(await page.locator('#title').innerText(), '查清限量，核对原文。');
    await page.locator('#langButton').click();
    await page.locator('#langMenu [data-lang="ms"]').click();
    await page.waitForFunction(() => document.documentElement.dataset.langReady === 'ms');
    assert.equal(await page.locator('#title').innerText(), 'Ketahui hadnya. Lihat sumbernya.');
    assert(!page.url().includes('lang='));
    await page.reload();
    await page.waitForFunction(() => document.documentElement.dataset.langReady === 'ms');
    assert.equal((await page.locator('#langButton').innerText()).trim(), 'BM');
    await page.close();
    // Share: from the More menu, with the QR code, a WhatsApp message and a link that copies.
    {
      const ctx = await browser.newContext({
          viewport: { width: 390, height: 844 },
          serviceWorkers: 'block',
          permissions: ['clipboard-read', 'clipboard-write']
        }),
        share = await ctx.newPage();
      await share.goto(url + '?lang=zh');
      await share.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
      await share.locator('#navMore').click();
      await share.locator('#shareOpen').click();
      assert(await share.locator('#shareDialog').isVisible());
      const address = 'https://stanleywoosweeleong.github.io/china-mrl/';
      assert.equal(await share.locator('#shareUrl').innerText(), address);
      await share.waitForFunction(() => {
        const img = document.querySelector('.share-qr');
        return img.complete && img.naturalWidth > 0;
      });
      const href = new URL(await share.locator('#shareWhatsApp').getAttribute('href'));
      assert.equal(href.origin, 'https://wa.me');
      assert(href.searchParams.get('text').endsWith(' ' + address));
      assert(href.searchParams.get('text').startsWith('China MRL：'));
      await share.locator('#shareCopy').click();
      await share.waitForFunction(
        () => document.getElementById('shareStatus').textContent === '链接已复制。'
      );
      assert.equal(await share.evaluate(() => navigator.clipboard.readText()), address);
      const box = await share.locator('#shareDialog').boundingBox();
      assert(box.y >= 0 && box.y + box.height <= 844 && box.x >= 0 && box.x + box.width <= 390);
      await ctx.close();
    }
    // First visit: the welcome screen offers the languages, previews the one tapped and keeps it.
    for (const [locale, first] of [
      ['en-US', 'en'],
      ['zh-CN', 'zh'],
      ['ms-MY', 'ms']
    ]) {
      const ctx = await browser.newContext({
          locale,
          viewport: { width: 390, height: 844 },
          serviceWorkers: 'block'
        }),
        visit = await ctx.newPage();
      await visit.goto(url);
      await visit.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
      assert(await visit.locator('#welcome').isVisible(), locale);
      assert.equal(
        await visit.locator('#welcome [aria-checked="true"]').getAttribute('data-welcome-lang'),
        first
      );
      assert.deepEqual(await visit.locator('#welcome [data-welcome-lang]').allInnerTexts(), [
        'English',
        '中文',
        'Bahasa Melayu'
      ]);
      const box = await visit.locator('#welcome').boundingBox();
      assert(box.y >= 0 && box.y + box.height <= 844 && box.x >= 0 && box.x + box.width <= 390, locale);
      await visit.locator('#welcome [data-welcome-lang="ms"]').click();
      await visit.waitForFunction(() => document.documentElement.dataset.langReady === 'ms');
      assert.equal(await visit.locator('#welcomeDone').innerText(), 'Teruskan');
      assert.equal(await visit.locator('#welcomeTitle').innerText(), 'Pilih bahasa anda');
      await visit.locator('#welcomeDone').click();
      assert(await visit.locator('#welcome').isHidden());
      assert.equal((await visit.locator('#langButton').innerText()).trim(), 'BM');
      // It is asked once.
      await visit.reload();
      await visit.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
      assert(await visit.locator('#welcome').isHidden());
      assert.equal(await visit.locator('#title').innerText(), 'Ketahui hadnya. Lihat sumbernya.');
      await ctx.close();
    }
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
