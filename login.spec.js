 // everything-token.spec.js
const { test, expect } = require('@playwright/test');

test.describe('ProGold Login', () => {
 // Run once before all tests in this block
  test('should log in successfully', async ({ page }) => {
    await page.goto('https://proex.qianqianshijie.com/login');
    await page.waitForNavigation({ waitUntil: 'networkidle' })

    // Find the username and password input fields, and the login button
    const emailInput = page.locator('input[type="email"]')
    await emailInput.waitFor({ state: 'visible' })
    await emailInput.fill('test33@gmail.com'); // Replace with your username field selector
    await page.fill('input[type="password"]', '12345678Aa$'); // Replace with your password field selector

    // Click the login button
    const button = page.locator(`#__nuxt > div > div > main > div > form > div > div.flex-none > div.mt-8.sm\\:mt-16 > button`)
    await button.waitFor({ state: 'visible' })
    await button.click();

    // Wait for the navigation after login, or check for a success element
    await page.waitForNavigation();
    
    // Or alternatively, you can check if a successful login is indicated on the page
    await expect(page).toHaveURL(/.*account/);
  });
})