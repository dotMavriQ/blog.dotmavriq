import { test, expect } from '@playwright/test';

test.describe('CV page', () => {
  test('print button exists and is clickable', async ({ page }) => {
    await page.goto('/cv');

    const printBtn = page.locator('#print-cv');
    await expect(printBtn).toBeVisible();
    await expect(printBtn).toBeEnabled();
  });

  test('JSON-LD structured data is present and valid', async ({ page }) => {
    await page.goto('/cv');

    const jsonLd = await page.$eval(
      'script[type="application/ld+json"]',
      (el) => JSON.parse(el.textContent || '{}')
    );

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe('Jonatan Jansson');
    expect(jsonLd.url).toContain('/cv');
    expect(jsonLd.sameAs).toBeInstanceOf(Array);
    expect(jsonLd.sameAs.length).toBeGreaterThan(0);
  });

  test('sections have scroll-margin-top', async ({ page }) => {
    await page.goto('/cv');

    const sectionIds = ['skills', 'experience', 'education', 'awards', 'language', 'certifications'];

    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      if (await section.count() > 0) {
        const scrollMargin = await section.evaluate((el) => {
          return getComputedStyle(el).scrollMarginTop;
        });
        // Should have some scroll-margin-top set (not 0px)
        expect(scrollMargin, `#${id} should have scroll-margin-top`).not.toBe('0px');
      }
    }
  });
});
