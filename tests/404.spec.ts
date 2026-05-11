import { test, expect } from '@playwright/test';

test.describe('404 page', () => {
  test('renders the not-found experience with a home link', async ({ page }) => {
    await page.goto('/404');

    await expect(page.locator('.fof-ascii')).toHaveAttribute('aria-label', '404');
    await expect(page.locator('#snake-canvas')).toBeAttached();
    await expect(page.locator('.fof-home')).toHaveAttribute('href', '/');
  });

  test('unknown routes return a not-found response', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    expect(response?.status()).toBeGreaterThanOrEqual(400);
    await expect(page.locator('.fof-ascii')).toHaveAttribute('aria-label', '404');
  });
});
