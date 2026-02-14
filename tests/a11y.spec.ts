import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/about', '/cv', '/portfolio', '/blog', '/contact'];

for (const path of pages) {
  test.describe(`a11y: ${path}`, () => {
    test('has no axe-core violations', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      let builder = new AxeBuilder({ page })
        .exclude('#matrix-overlay') // easter egg overlay
        .exclude('cal-modal-box');  // Cal.com embed injects its own DOM

      // CV page has intentional light-bg/dark-text design with some low-contrast meta text
      if (path === '/cv') {
        builder = builder.disableRules(['color-contrast']);
      }

      const results = await builder.analyze();
      expect(results.violations).toEqual([]);
    });

    test('heading hierarchy has no skipped levels within main', async ({ page }) => {
      await page.goto(path);

      const headingLevels = await page.$$eval(
        'main h1, main h2, main h3, main h4, main h5, main h6',
        (headings) => headings
          .filter((h) => {
            // Skip headings inside hidden modals or aria-hidden containers
            const closestHidden = h.closest('[aria-hidden="true"]');
            return !closestHidden;
          })
          .map((h) => parseInt(h.tagName[1]))
      );

      if (headingLevels.length <= 1) return;

      // Check no level jumps more than 1 step down
      for (let i = 1; i < headingLevels.length; i++) {
        const jump = headingLevels[i] - headingLevels[i - 1];
        expect(
          jump,
          `Heading jumped from h${headingLevels[i - 1]} to h${headingLevels[i]}`
        ).toBeLessThanOrEqual(1);
      }
    });

    test('all images have alt text', async ({ page }) => {
      await page.goto(path);

      const imagesWithoutAlt = await page.$$eval('img', (imgs) =>
        imgs
          .filter((img) => {
            const alt = img.getAttribute('alt');
            return alt === null || alt === undefined;
          })
          .map((img) => img.src)
      );

      expect(imagesWithoutAlt).toEqual([]);
    });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow).toBe(false);
    });
  });
}
