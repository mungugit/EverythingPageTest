// everything-token.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');
test.describe('ProGold Everything Token Page', () => {

  test.beforeEach(async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything', { waitUntil: 'domcontentloaded' });
});

  test('TC_UI_001 - Page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*everything/);
    await expect(page.locator('text=Everything Token')).toBeVisible();
  });

  test('TC_UI_002 - Popular tokens visible', async ({ page }) => {
  const token = page.getByText('FeH2', { exact: true });
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
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.locator('#headlessui-popover-button-v-0-0').click();
  await page.getByRole('option', { name: 'English' }).click();
  await page.getByRole('button', { name: 'Swap' }).click();
  const fromText = page.getByText('From', { exact: true });
  if (await fromText.count() > 0) {
    try {
      await fromText.click();
    } catch {
    
      await fromText.locator('xpath=..').click();
    }
  } else {
    throw new Error('"From" text not found');
  }

  const toText = page.getByText('To', { exact: true });
  if (await toText.count() > 0) {
    try {
      await toText.click();
    } catch {
  
      await toText.locator('xpath=..').click();
    }
  } else {
    throw new Error('"To" text not found');
  }
  await page.getByRole('main').click();s
  await expect(fromText).toBeVisible();
  await expect(toText).toBeVisible();
});

  test('TC_MINT_001 - Mint valid amount', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button', { name: 'Mint' }).first().click();
  await page.getByPlaceholder('≤').click();
  await page.getByPlaceholder('≤').fill('99');
  await page.locator('div').filter({ hasText: /^Mint$/ }).getByRole('button', { disabled: false }).first().click();
  await expect(page.getByRole('status').locator('div').filter({ hasText: 'Successfully minted 99' }).first()).toBeVisible();
});

test('TC_MINT_002 - Mint with insufficient balance', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button', { name: 'Mint' }).first().click();
  await page.getByPlaceholder('≤').click();
  await page.getByPlaceholder('≤').fill('999');
  await expect(page.getByText('Amount exceeds available balance')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Mint$/ }).getByRole('button').first().click();
  await expect(page.getByRole('status').locator('div').filter({ hasText: 'Insufficient elements' }).nth(1)).toBeVisible();
});

  test('TC_SWAP_001 - Valid token swap (LiFePO4H2 -> KGEN)', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button', { name: 'Swap' }).click();
  await page.locator('div').filter({ hasText: /^CompoundLiFePO4H2LiFePO4H2$/ }).getByPlaceholder('0.00').click();
  await page.locator('div').filter({ hasText: /^CompoundLiFePO4H2LiFePO4H2$/ }).getByPlaceholder('0.00').fill('111');
  await page.getByRole('button', { name: 'Swap' }).nth(1).click();
});

  test('TC_SWAP_002 - Swap with insufficient balance', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button', { name: 'Swap'}).click();
  await page.locator('div').filter({ hasText: /^CompoundLiFePO4H2LiFePO4H2$/ }).getByPlaceholder('0.00').click();  
  await page.locator('div').filter({ hasText: /^CompoundLiFePO4H2LiFePO4H2$/ }).getByPlaceholder('0.00').fill('99999');
  await page.getByRole('button', { name: 'Swap' }).nth(1).click();
  await expect(page.getByRole('status').locator('div').filter({ hasText: 'Errorbalance insufficient' }).first()).toBeVisible();
 });

  test('TC_DECOMP_001 - Decompose a valid compound', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button', { name: 'Decompose' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'LiFePO4H2' }).click();
  await page.getByPlaceholder('≤').click();
  await page.getByPlaceholder('≤').fill('111');
  await page.getByRole('button', { name: 'Decompose' }).nth(1).click();
});

  test('TC_DECOMP_002 - Decompose with insufficient balance', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.locator('div').filter({ hasText: /^LiFePO4H2$/ }).nth(2).click();
  await page.getByPlaceholder('≤').fill('99999');
  await expect(page.getByText('Amount exceeds available balance')).toBeVisible();
});

  test('TC_HIST_001 - Order History updates after Swap', async ({ page }) => {
    await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button', { name: 'Swap' }).click();
  await page.locator('div').filter({ hasText: /^CompoundLiFePO4H2LiFePO4H2$/ }).getByPlaceholder('0.00').click();
  await page.locator('div').filter({ hasText: /^CompoundLiFePO4H2LiFePO4H2$/ }).getByPlaceholder('0.00').fill('01');
  await page.getByRole('button', { name: 'Swap' }).nth(1).click();
  await page.getByRole('status').locator('div').filter({ hasText: 'SuccessSuccessfully swapped 1' }).nth(1).click();
});
  test('TC_LANG_001 - Verify language dropdown changes language', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.locator('#headlessui-popover-button-v-0-0').getByRole('button', { name: 'English' }).click();
  await page.getByText('繁體中文').click();
});

  test('TC_THEME_001 - Verify theme icon toggles dark/light mode	', async ({ page }) => {
  await page.goto('https://proex.qianqianshijie.com/everything');
  await page.getByRole('button').filter({ hasText: /^$/ }).first().click();
});

});