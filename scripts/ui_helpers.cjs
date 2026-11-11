// Shared steps for the browser checks, written against the controls a person uses.
// Opens a tab; on phones the secondary tabs sit under "More".
async function openTab(page, name) {
  const button = page.locator(`nav [data-tab="${name}"]`);
  // A view without a tab of its own (the banned list) is opened the way its links do.
  if (!(await button.count())) return page.evaluate((n) => setTab(n), name);
  if (!(await button.isVisible())) await page.locator('#navMore').click();
  await button.click();
}
// Picks a fresh crop by typing into the crop picker and choosing the first match.
async function pickCrop(page, text) {
  await page.locator('#cropSearch').fill(text);
  await page.locator('#cropOptions li[data-crop-option]').first().click();
}
// Opens a result's details: the Details button on wide screens, a tap on the card on phones.
async function openDetails(page, row) {
  if (page.viewportSize().width > 760) await row.locator('[data-detail]').click();
  else await row.locator('td').nth(1).click();
}
module.exports = { openTab, pickCrop, openDetails };
