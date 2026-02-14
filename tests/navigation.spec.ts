import { test, expect } from '@playwright/test';

test.describe('desktop navigation', () => {
  const navLinks = [
    { text: 'About', href: '/about' },
    { text: 'CV', href: '/cv' },
    { text: 'Portfolio', href: '/portfolio' },
    { text: 'Blog', href: '/blog' },
    { text: 'Contact', href: '/contact' },
  ];

  for (const link of navLinks) {
    test(`nav link "${link.text}" goes to ${link.href}`, async ({ page }) => {
      await page.goto('/');
      // Use desktop nav (hidden md:flex)
      const desktopNav = page.locator('header nav .hidden.md\\:flex');
      await desktopNav.locator(`a[href="${link.href}"]`).click();
      await expect(page).toHaveURL(new RegExp(link.href));
    });
  }
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('toggle opens and closes mobile menu', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#nav-toggle');
    const menu = page.locator('#mobile-menu');

    // Menu starts not visible
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).not.toBeVisible();

    // Open
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();

    // Close
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).not.toBeVisible();
  });

  test('mobile menu links navigate correctly', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#nav-toggle');
    await toggle.click();

    const menu = page.locator('#mobile-menu');
    await menu.locator('a[href="/portfolio"]').click();
    await expect(page).toHaveURL(/\/portfolio/);
  });
});

test.describe('home page buttons', () => {
  test('View Portfolio button navigates to /portfolio', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/portfolio"]', { hasText: 'View Portfolio' }).click();
    await expect(page).toHaveURL(/\/portfolio/);
  });

  test('Read Blog button navigates to /blog', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/blog"]', { hasText: 'Read Blog' }).click();
    await expect(page).toHaveURL(/\/blog/);
  });
});

test.describe('skip-to-content', () => {
  test('skip link focuses #main on activation', async ({ page }) => {
    await page.goto('/about');
    // Tab to the skip link (it's the first focusable element)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // The hash should change to #main
    await expect(page).toHaveURL(/#main/);
  });
});

test.describe('404 page links', () => {
  test('Home link works', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    // Scope to main content to avoid matching header nav home link
    await page.locator('main a[href="/"]').click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('Portfolio link works', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await page.locator('main a[href="/portfolio"]').click();
    await expect(page).toHaveURL(/\/portfolio/);
  });
});
