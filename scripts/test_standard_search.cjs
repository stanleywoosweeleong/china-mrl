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
    // Touch order (iOS): the box loses focus before the tap on an option arrives. The choice must still land.
    await p.locator('#cropSearch').fill('mangguo');
    await p.evaluate(() => {
      const option = document.querySelector('#cropOptions li[data-crop-option]');
      option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      document.getElementById('cropSearch').blur();
    });
    // The list must still be on screen for the tap to land on it.
    assert(await p.locator('#cropOptions li[data-crop-option]').first().isVisible());
    await p.evaluate(() =>
      document
        .querySelector('#cropOptions li[data-crop-option]')
        .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    assert.equal(await p.locator('#crop').inputValue(), '杧果');
    assert.equal(await p.locator('#cropSearch').inputValue(), 'Mango');
    // Scrolling the list (no choice) leaves it open; a press elsewhere closes it and keeps the crop.
    await p.locator('#cropSearch').click();
    await p.evaluate(() => {
      document
        .querySelector('#cropOptions')
        .dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      document.getElementById('cropSearch').blur();
    });
    assert(await p.locator('#cropOptions').isVisible());
    await p.locator('h1').click();
    assert(!(await p.locator('#cropOptions').isVisible()));
    assert.equal(await p.locator('#crop').inputValue(), '杧果');
    // Typing one clear answer and leaving the box (keyboard "Done") selects it.
    await p.locator('#cropSearch').fill('huolongguo');
    await p.locator('h1').click();
    assert.equal(await p.locator('#crop').inputValue(), '火龙果');
    // Enter on the box without typing or highlighting keeps the current crop.
    await p.locator('#cropSearch').click();
    await p.keyboard.press('Enter');
    assert.equal(await p.locator('#crop').inputValue(), '火龙果');
    assert(!(await p.locator('#cropOptions').isVisible()));
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
