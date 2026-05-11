import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/about',
  '/cv',
  '/portfolio',
  '/blog',
  '/contact',
  '/social',
  '/404',
];

test.describe('Production surface', () => {
  test('top navigation links keep stable geometry while moving between pages', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const captureNavRects = async () => page.locator('.nav-links a').evaluateAll((links) =>
      links.map((link) => {
        const rect = link.getBoundingClientRect();
        return {
          text: link.textContent?.trim() ?? '',
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
    );

    const baseline = await captureNavRects();

    for (const label of ['cv', 'portfolio', 'about', 'blog', 'contact']) {
      await page.locator('.nav-links a', { hasText: label }).click();
      await page.waitForLoadState('domcontentloaded');

      expect(await captureNavRects(), `nav shifted after visiting ${label}`).toEqual(baseline);
    }
  });

  for (const width of [320, 375, 768, 1280, 1920, 3840]) {
    test(`routes do not overflow horizontally at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 1920 ? 1600 : 900 });

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('domcontentloaded');

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return Math.ceil(doc.scrollWidth - doc.clientWidth);
        });

        expect(overflow, `${route} overflows horizontally at ${width}px`).toBeLessThanOrEqual(1);
      }
    });
  }

  test('homepage ASCII art keeps clean edges at 4K', async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#ascii-scene')).toBeVisible();

    const badEdgeGlyphs = await page.locator('#ascii-scene').evaluate((scene) => {
      const lines = (scene.textContent || '').split('\n').filter(Boolean);
      const edgeWidth = 16;
      const allowed = new Set([' ', '░', '·']);

      return lines.flatMap((line, row) => {
        const left = line.slice(0, edgeWidth);
        const right = line.slice(Math.max(0, line.length - edgeWidth));
        const hits: string[] = [];

        Array.from(left).forEach((char, col) => {
          if (!allowed.has(char)) hits.push(`${row}:${col}:${char}`);
        });
        Array.from(right).forEach((char, col) => {
          if (!allowed.has(char)) hits.push(`${row}:right-${edgeWidth - col}:${char}`);
        });

        return hits;
      });
    });

    expect(badEdgeGlyphs).toEqual([]);
  });

  test('Oliv panel fits and closes from a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    await page.click('#oliv-launch');
    const panel = page.locator('#oliv-panel');
    await expect(panel).toBeVisible();

    const box = await panel.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    expect(box!.y + box!.height).toBeLessThanOrEqual(568);

    await expect(page.locator('#oliv-input')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(page.locator('#oliv-launch')).toBeFocused();
  });
});
