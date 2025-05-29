 // everything-token.spec.js
const { test, expect } = require('@playwright/test');

test.describe('ProGold Everything Token Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://proex.qianjinanshanjie.com/everything');
     waitUntil: 'domcontentloaded'
  });

  test('TC_UI_001 - Page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*everything/);
    await expect(page.locator('text=Everything Token')).toBeVisible();
  });

  test('TC_UI_002 - Popular tokens visible and clickable', async ({ page }) => {
    const token = page.locator('text=FeH2');
    await expect(token).toBeVisible();
    await token.click();
  });

  test('TC_UI_003 - My Assets section loads', async ({ page }) => {
  await page.waitForSelector('text=Crypto');
  await expect(page.getByRole('heading', { name: 'Crypto' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gold' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Elements' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Compound' })).toBeVisible();
});

  test('TC_UI_004 - Action buttons are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Mint' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Swap' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Decompose' }).first()).toBeVisible();
  });

  test('TC_UI_005 - Swap section is visible', async ({ page }) => {
  const swapButton = page.getByRole('button', { name: 'Swap' });
  await expect(swapButton).toBeVisible();
  await expect(swapButton).toBeEnabled();
  await swapButton.click();

  // Scope to the Swap section using the heading
  const swapSection = page.getByRole('heading', { name: 'Swap assets here' }).locator('..');

  await expect(swapSection).toBeVisible();
  await expect(swapSection.getByText('From', { exact: true })).toBeVisible();
  await expect(swapSection.getByText('To', { exact: true })).toBeVisible();
});
  test('TC_SWAP_001 - Valid token swap (FeH2 -> JPN)', async ({ page }) => {
    await page.selectOption('select[placeholder="From"]', 'FeH2'); // adjust selector if needed
    await page.fill('input[placeholder="0"]', '1');
    await page.selectOption('select[placeholder="To"]', 'JPN');
    await page.click('button:has-text("Swap")');
    await expect(page.locator('text=Success')).toBeVisible(); // Update if there is a toast/alert
  });

  test('TC_SWAP_002 - Swap with zero amount', async ({ page }) => {
    await page.selectOption('select[placeholder="From"]', 'FeH2');
    await page.fill('input[placeholder="0"]', '0');
    await page.selectOption('select[placeholder="To"]', 'JPN');
    await page.click('button:has-text("Swap")');
    await expect(page.locator('text=error')).toBeVisible(); // or check disabled button
  });

  test('TC_SWAP_003 - Swap with insufficient balance', async ({ page }) => {
    await page.selectOption('select[placeholder="From"]', 'FeH2');
    await page.fill('input[placeholder="0"]', '999999');
    await page.selectOption('select[placeholder="To"]', 'JPN');
    await page.click('button:has-text("Swap")');
    await expect(page.locator('text=insufficient')).toBeVisible(); // change as per actual error
  });

  test('TC_MINT_001 - Mint button clickable', async ({ page }) => {
    await page.click('button:has-text("Mint")');
    await expect(page.locator('text=Select Element')).toBeVisible(); // Modal or screen change
  });

  test('TC_DECOMP_001 - Decompose button opens modal', async ({ page }) => {
    await page.click('button:has-text("Decompose")');
    await expect(page.locator('text=Select Compound')).toBeVisible(); // Modal or dropdown
  });

});
test('TC_HIST_001 - Order History updates after Swap', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Everything token' })).toBeVisible();
  await page.getByRole('combobox', { name: 'From' }).click();
  await page.getByText('FeH2', { exact: true }).click();
  await page.getByPlaceholder('0').fill('1');
  await page.getByRole('combobox', { name: 'To' }).click();
  await page.getByText('JPN', { exact: true }).click();
  await page.getByRole('button', { name: 'Swap' }).click();
  await expect(page.getByText('Success')).toBeVisible()
  const historyRow = page.locator('table >> text=Swap');
  await expect(historyRow).toBeVisible();
});

