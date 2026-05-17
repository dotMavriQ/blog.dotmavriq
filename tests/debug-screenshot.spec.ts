import { test } from '@playwright/test';

test('screenshot mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-before.png', fullPage: false });

  await page.click('#nav-toggle');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-after.png', fullPage: false });
});
