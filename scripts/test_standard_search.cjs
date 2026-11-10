const { chromium } = require('playwright'),
  assert = require('assert'),
  { openTab, pickCrop, openDetails } = require('./ui_helpers.cjs');
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  try {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(process.env.AUDIT_URL || 'http://localhost:8089/china-mrl/');
    await p.waitForFunction(() => document.getElementById('resultCount').textContent === '89');
    await openTab(p, 'full');
    assert.equal(await p.locator('#resultCount').innerText(), '10,749');
    for (const q of ['Durian', '榴莲']) {
      await p.locator('#search').fill(q);
      assert.equal(await p.locator('#resultCount').innerText(), '89');
      assert((await p.locator('#fullSearchNote').innerText()).includes('1 direct + 88 group-based'));
    }
    const group = p.locator('tr').filter({ hasText: 'Group rule' }).first();
    await openDetails(p, group);
    assert((await p.locator('#detailContent').innerText()).includes('Food-group match under Annex A'));
    await p.locator('.close').click();
    await group.locator('[data-save]').click();
    assert.equal(await p.locator('#savedCount').innerText(), '1');
    await p.selectOption('#category', '蔬菜');
    assert.equal(await p.locator('#resultCount').innerText(), '0');
    await p.selectOption('#category', '');
    await p.selectOption('#fullSearchMode', 'exact');
    assert.equal(await p.locator('#resultCount').innerText(), '1');
    assert((await p.locator('#rows').innerText()).includes('Cypermethrin'));
    await p.selectOption('#fullSearchMode', 'applicable');
    await p.locator('#search').fill('Banana');
    const count = await p.locator('#resultCount').innerText();
    await openTab(p, 'fresh');
    await pickCrop(p, 'banana');
    assert.equal(await p.locator('#crop').inputValue(), '香蕉');
    assert.equal(await p.locator('#resultCount').innerText(), count);
    await openTab(p, 'full');
    await p.locator('#search').fill('cypermethrin');
    assert(Number((await p.locator('#resultCount').innerText()).replace(',', '')) > 1);
    assert.equal(await p.locator('#resultLabel').innerText(), 'source rows');
    await openTab(p, 'saved');
    assert.equal(await p.locator('#resultCount').innerText(), '1');
    assert((await p.locator('#rows').innerText()).includes('Durian'));
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    // Crop picker: pinyin, initials and English all find the crop; sorting reorders by limit.
    await openTab(p, 'fresh');
    for (const [typed, id] of [
      ['liulian', '榴莲'],
      ['blm', '菠萝蜜'],
      ['dragon', '火龙果'],
      ['番茄', '番茄']
    ]) {
      await pickCrop(p, typed);
      assert.equal(await p.locator('#crop').inputValue(), id, typed);
    }
    await p.locator('#cropClear').click();
    assert.equal(await p.locator('#crop').inputValue(), '');
    await pickCrop(p, 'durian');
    await p.selectOption('#sortSelect', 'limit:desc');
    const limits = await p.locator('#rows .num').allInnerTexts();
    assert.deepEqual(
      limits.map(parseFloat),
      limits.map(parseFloat).sort((a, b) => b - a)
    );
    console.log(
      'Entire standard: bilingual crop recognition, group detail/save, category filtering, exact mode, banana parity, pesticide text search, crop picker and sorting passed.'
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
