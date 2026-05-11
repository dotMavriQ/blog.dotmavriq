import { test, expect } from '@playwright/test';

test.describe('Mobile header spacing', () => {
  test('header elements have adequate padding from edges', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const viewport = page.viewportSize()!;

    const logo = page.locator('.nav-logo');
    const navToggle = page.locator('#nav-toggle');

    const logoBox = await logo.boundingBox();
    const navBox = await navToggle.boundingBox();

    const logoLeftEdge = logoBox!.x;
    const burgerRightEdge = viewport.width - (navBox!.x + navBox!.width);

    // Elements should have at least 16px from the viewport edge
    expect(logoLeftEdge, 'Logo too close to left edge').toBeGreaterThanOrEqual(16);
    expect(burgerRightEdge, 'Burger menu too close to right edge').toBeGreaterThanOrEqual(16);
  });

  test('header spacing works on small viewports (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    const viewport = page.viewportSize()!;
    const logo = page.locator('.nav-logo');
    const navToggle = page.locator('#nav-toggle');

    const logoBox = await logo.boundingBox();
    const navBox = await navToggle.boundingBox();

    const logoLeftEdge = logoBox!.x;
    const burgerRightEdge = viewport.width - (navBox!.x + navBox!.width);

    expect(logoLeftEdge, 'Logo too close to left edge on 320px').toBeGreaterThanOrEqual(16);
    expect(burgerRightEdge, 'Burger too close to right edge on 320px').toBeGreaterThanOrEqual(16);
  });
});
