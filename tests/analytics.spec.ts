import { test, expect } from '@playwright/test';

test.describe('GoatCounter analytics', () => {
  test('GoatCounter script tag is present with correct attributes', async ({ page }) => {
    await page.goto('/');

    const gcScript = page.locator('script[data-goatcounter]');
    await expect(gcScript).toHaveCount(1);
    await expect(gcScript).toHaveAttribute(
      'data-goatcounter',
      'https://dotmavriq.goatcounter.com/count'
    );
  });

  test('script src points to gc.zgo.at/count.js', async ({ page }) => {
    await page.goto('/');

    const src = await page.locator('script[data-goatcounter]').getAttribute('src');
    expect(src).toContain('gc.zgo.at/count.js');
  });
});
