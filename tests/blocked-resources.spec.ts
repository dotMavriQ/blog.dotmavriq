import { test, expect } from '@playwright/test';

/**
 * Simulates browsers with tracker/ad blockers (Vivaldi, Brave, uBlock Origin, etc.)
 * by blocking third-party domains that these tools commonly flag.
 *
 * The site should degrade gracefully: no broken layouts, no JS errors
 * from missing externals, fallback fonts work, Cal.com falls back to a link.
 */

// Domains that Vivaldi's tracker blocker and common ad blockers flag
const blockedDomains = [
  'gc.zgo.at',              // GoatCounter analytics
  'fonts.googleapis.com',   // Google Fonts CSS
  'fonts.gstatic.com',      // Google Fonts files
  'app.cal.com',             // Cal.com embed
  'img.shields.io',         // Shields.io badges
];

test.describe('graceful degradation with blocked resources', () => {
  test.beforeEach(async ({ page }) => {
    // Block all requests to third-party tracker/analytics/font domains
    await page.route(
      (url) => blockedDomains.some((d) => url.hostname.includes(d)),
      (route) => route.abort('blockedbyclient')
    );
  });

  const pages = ['/', '/about', '/cv', '/portfolio', '/blog', '/contact'];

  for (const path of pages) {
    test(`${path} loads without JS errors when externals are blocked`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore network errors from blocked resources (expected)
          if (text.includes('net::ERR_BLOCKED_BY_CLIENT')) return;
          if (text.includes('net::ERR_FAILED')) return;
          errors.push(text);
        }
      });

      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      expect(errors).toEqual([]);
    });

    test(`${path} has no layout breakage when externals are blocked`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      // Main content visible
      await expect(page.locator('main#main')).toBeVisible();

      // No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);

      // Footer still visible
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  test('home page works without Google Fonts (fallback font stack)', async ({ page }) => {
    await page.goto('/');

    // Body should use the system font stack as fallback
    const fontFamily = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });
    // Should fall back to system-ui or sans-serif
    expect(fontFamily).toMatch(/system-ui|sans-serif|Inter/);

    // Navigation and buttons still functional
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('a[href="/portfolio"]').first()).toBeVisible();
  });

  test('contact page Cal.com button degrades to a plain link', async ({ page }) => {
    await page.goto('/contact');

    // The Cal button is an <a> tag, so it works as a link even
    // when the Cal.com embed JS is blocked
    const calBtn = page.locator('#cal-btn');
    await expect(calBtn).toBeVisible();
    await expect(calBtn).toHaveAttribute('href', 'https://cal.com/dotmavriq');
  });

  test('contact page Liberapay badge area is not broken', async ({ page }) => {
    await page.goto('/contact');

    // The donate section should still be visible even if the badge image fails
    const donateSection = page.locator('text=Donate').first();
    await expect(donateSection).toBeVisible();

    // Liberapay link should still work
    const liberapayLink = page.locator('a[href="https://liberapay.com/dotmavriq"]').first();
    await expect(liberapayLink).toBeVisible();
  });

  test('portfolio page is fully functional without external resources', async ({ page }) => {
    await page.goto('/portfolio');

    // Tag filters still work
    const firstTag = page.locator('[data-js="tag-filter"] button:not([data-tag="__all__"])').first();
    await firstTag.click();
    await expect(firstTag).toHaveAttribute('aria-pressed', 'true');

    // Cards are filtered
    const visibleCards = page.locator('[data-js="portfolio-grid"] > div:not(.card-hidden)');
    expect(await visibleCards.count()).toBeGreaterThan(0);

    // Reset works
    await page.locator('[data-tag="__all__"]').click();
    const allCards = page.locator('[data-js="portfolio-grid"] > div:not(.card-hidden)');
    expect(await allCards.count()).toBeGreaterThan(0);
  });
});
