const { chromium } = require('playwright'),
  assert = require('assert'),
  { openTab, pickCrop } = require('./ui_helpers.cjs');
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(process.env.AUDIT_URL || 'http://localhost:8089/china-mrl/');
    await page.waitForFunction(() => !document.getElementById('originSelector').disabled);
    // Changing the origin keeps the current tab and updates the crop card there.
    await page.selectOption('#originSelector', 'TH');
    assert(await page.locator('#explorer').isVisible());
    assert(!(await page.locator('#access').isVisible()));
    assert((await page.locator('#cropCard').innerText()).includes('access documented'));
    await page.selectOption('#originSelector', 'MY');
    assert((await page.locator('#cropCard').innerText()).includes('approved market access'));
    await openTab(page, 'access');
    assert((await page.locator('#accessCatalogueSummary').innerText()).startsWith('10 documented'));
    // The catalogue opens on crops that have a record; "All crops" shows the rest.
    assert.equal(await page.locator('#accessStatus').inputValue(), 'documented');
    assert.equal(await page.locator('#accessCropList article').count(), 10);
    await page.selectOption('#accessStatus', 'all');
    assert.equal(await page.locator('#accessCropList article').count(), 184);
    assert((await page.locator('#accessCropList article').nth(0).innerText()).includes('Documented access'));
    assert((await page.locator('#accessCropList article').nth(10).innerText()).includes('Not verified'));
    await page.selectOption('#accessCategory', '蔬菜');
    assert((await page.locator('#accessCropList article').count()) > 0);
    await page.selectOption('#accessStatus', 'conditional');
    assert.equal(await page.locator('#accessCropList article').count(), 0);
    assert((await page.locator('#accessCropList').innerText()).includes('not a prohibition'));
    await page.selectOption('#accessStatus', 'unverified');
    assert((await page.locator('#accessCropList article').count()) > 0);
    await page.selectOption('#accessCategory', '');
    await page.selectOption('#accessStatus', 'conditional');
    await page.locator('#accessCropSearch').fill('jackfruit');
    assert.equal(await page.locator('#accessCropList article').count(), 1);
    await page.locator('[data-access-crop="菠萝蜜"]').click();
    assert((await page.locator('#accessResult').innerText()).includes('GACC 2023 No. 34'));
    await page.locator('#accessCropList [data-crop="菠萝蜜"]').click();
    assert.equal(await page.locator('#crop').inputValue(), '菠萝蜜');
    assert((await page.locator('#cropCard').innerText()).includes('access documented'));
    await pickCrop(page, 'tomato');
    assert.equal(await page.locator('#crop').inputValue(), '番茄');
    assert((await page.locator('#cropCard').innerText()).includes('not verified'));
    await page.reload();
    await page.waitForFunction(() =>
      document.getElementById('cropCard').textContent.includes('approved market access')
    );
    assert.equal(await page.locator('#originSelector').inputValue(), 'MY');
    await openTab(page, 'access');
    await page.selectOption('#accessForm', 'frozen');
    assert.equal(await page.locator('#accessCropList article').count(), 184);
    assert((await page.locator('#accessCropList article').first().innerText()).includes('Not verified'));
    await page.selectOption('#accessStatus', 'conditional');
    assert.equal(await page.locator('#accessCropList article').count(), 0);
    await page.selectOption('#accessForm', 'fresh');
    await page.selectOption('#originSelector', 'LA');
    assert.equal(await page.locator('#accessCropList article').count(), 11);
    assert((await page.locator('#accessCropList').innerText()).includes('GACC list via translation'));
    assert((await page.locator('#accessCropList').innerText()).includes('Chilli'));
    await page.selectOption('#originSelector', '');
    assert(!(await page.locator('#accessCatalogue').isVisible()));
    console.log(
      'Country catalogue: filters, fruit/vegetable separation, source details, MRL handoff, reload and product-form isolation passed.'
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
