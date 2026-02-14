import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', title: 'blog.dotMavriQ', status: 200 },
  { path: '/about', title: 'About', status: 200 },
  { path: '/cv', title: 'CV', status: 200 },
  { path: '/portfolio', title: 'Portfolio', status: 200 },
  { path: '/blog', title: 'Blog', status: 200 },
  { path: '/contact', title: 'Contact', status: 200 },
];

for (const pg of pages) {
  test.describe(`${pg.path}`, () => {
    test('responds with correct status and title', async ({ page }) => {
      const response = await page.goto(pg.path);
      expect(response?.status()).toBe(pg.status);
      await expect(page).toHaveTitle(new RegExp(pg.title));
    });

    test('has <main id="main">', async ({ page }) => {
      await page.goto(pg.path);
      await expect(page.locator('main#main')).toBeVisible();
    });

    test('has skip-to-content link', async ({ page }) => {
      await page.goto(pg.path);
      const skip = page.locator('a[href="#main"]');
      await expect(skip).toHaveCount(1);
    });

    test('has header nav with all 5 links', async ({ page }) => {
      await page.goto(pg.path);
      const nav = page.locator('header nav[aria-label="Primary"]');
      await expect(nav).toBeVisible();

      const expectedLinks = ['/about', '/cv', '/portfolio', '/blog', '/contact'];
      for (const href of expectedLinks) {
        await expect(nav.locator(`a[href="${href}"]`).first()).toBeAttached();
      }
    });

    test('has visible footer', async ({ page }) => {
      await page.goto(pg.path);
      await expect(page.locator('footer')).toBeVisible();
    });

    test('no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await page.goto(pg.path);
      await page.waitForLoadState('domcontentloaded');
      // Brief settle — Cal.com embed keeps connections alive, so networkidle won't resolve on /contact
      await page.waitForTimeout(500);
      expect(errors).toEqual([]);
    });
  });
}

test.describe('404 page', () => {
  test('returns 404 and has expected title', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/404/);
  });

  test('has main and footer', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
