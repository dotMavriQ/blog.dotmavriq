import { test, expect } from '@playwright/test';

// The fold-trigger button uses clip-path and is visually overlapped by the
// .surface card, so standard Playwright click() can't reach it.
// We dispatch click events programmatically instead.
async function clickFoldTrigger(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.getElementById('fold-trigger')?.click();
  });
}

test.describe('contact QR modal', () => {
  // Block Cal.com embed so its modal iframe doesn't overlay the QR modal
  test.beforeEach(async ({ page }) => {
    await page.route(
      (url) => url.hostname.includes('cal.com'),
      (route) => route.abort('blockedbyclient')
    );
  });

  test('fold-trigger click opens QR modal', async ({ page }) => {
    await page.goto('/contact');

    const modal = page.locator('#qr-modal');
    const trigger = page.locator('#fold-trigger');

    // Modal starts hidden
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open
    await clickFoldTrigger(page);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('Escape closes modal and returns focus to trigger', async ({ page }) => {
    await page.goto('/contact');

    const modal = page.locator('#qr-modal');
    const trigger = page.locator('#fold-trigger');

    await clickFoldTrigger(page);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Focus should return to trigger
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('fold-trigger');
  });

  test('backdrop click closes modal', async ({ page }) => {
    await page.goto('/contact');

    const modal = page.locator('#qr-modal');

    await clickFoldTrigger(page);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');

    // Click backdrop programmatically (panel overlaps the backdrop visually)
    await page.evaluate(() => {
      document.querySelector<HTMLElement>('#qr-modal .modal-backdrop')?.click();
    });
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('modal has focus trap', async ({ page }) => {
    await page.goto('/contact');

    await clickFoldTrigger(page);
    // Wait for focus to move into modal
    await page.waitForTimeout(100);

    // Get all focusable elements inside modal
    const focusableCount = await page.evaluate(() => {
      const modal = document.getElementById('qr-modal');
      if (!modal) return 0;
      return modal.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      ).length;
    });

    // Tab through all focusable elements + 1 to verify wrap
    for (let i = 0; i < focusableCount + 1; i++) {
      await page.keyboard.press('Tab');
    }

    // After cycling, focus should still be inside the modal
    const focusInModal = await page.evaluate(() => {
      const modal = document.getElementById('qr-modal');
      return modal?.contains(document.activeElement) ?? false;
    });
    expect(focusInModal).toBe(true);
  });

  test('aria-hidden and aria-expanded toggle correctly', async ({ page }) => {
    await page.goto('/contact');

    const modal = page.locator('#qr-modal');
    const trigger = page.locator('#fold-trigger');

    // Initial state
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open
    await clickFoldTrigger(page);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Close via X button
    await page.evaluate(() => {
      document.querySelector<HTMLElement>('#qr-modal button[data-close]')?.click();
    });
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
