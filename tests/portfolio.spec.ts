import { test, expect } from '@playwright/test';

test.describe('portfolio tag filter', () => {
  test('clicking a tag toggles aria-pressed and filters cards', async ({ page }) => {
    await page.goto('/portfolio');

    const allCards = page.locator('[data-js="portfolio-grid"] > div');
    const totalCount = await allCards.count();

    // Pick the first non-"All" tag button
    const firstTag = page.locator('[data-js="tag-filter"] button:not([data-tag="__all__"])').first();
    const tagName = await firstTag.getAttribute('data-tag');

    // Initially not pressed
    await expect(firstTag).toHaveAttribute('aria-pressed', 'false');

    // Click to activate
    await firstTag.click();
    await expect(firstTag).toHaveAttribute('aria-pressed', 'true');

    // Some cards should be hidden
    const visibleCards = page.locator('[data-js="portfolio-grid"] > div:not(.card-hidden)');
    const hiddenCards = page.locator('[data-js="portfolio-grid"] > div.card-hidden');
    const visibleCount = await visibleCards.count();

    // If the tag doesn't match all cards, some should be hidden
    if (visibleCount < totalCount) {
      expect(await hiddenCards.count()).toBeGreaterThan(0);
    }

    // All visible cards should have the selected tag
    for (let i = 0; i < visibleCount; i++) {
      const tags = await visibleCards.nth(i).getAttribute('data-tags');
      expect(tags).toContain(tagName);
    }
  });

  test('"All" button resets filters', async ({ page }) => {
    await page.goto('/portfolio');

    const allCards = page.locator('[data-js="portfolio-grid"] > div');
    const totalCount = await allCards.count();

    // Activate a filter first
    const firstTag = page.locator('[data-js="tag-filter"] button:not([data-tag="__all__"])').first();
    await firstTag.click();

    // Click "All"
    const allBtn = page.locator('[data-tag="__all__"]');
    await allBtn.click();

    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(firstTag).toHaveAttribute('aria-pressed', 'false');

    // All cards visible again
    const visibleCards = page.locator('[data-js="portfolio-grid"] > div:not(.card-hidden)');
    expect(await visibleCards.count()).toBe(totalCount);
  });

  test('filter count shows when filtering', async ({ page }) => {
    await page.goto('/portfolio');

    const countEl = page.locator('#filter-count');
    await expect(countEl).toHaveClass(/hidden/);

    // Activate a filter
    const firstTag = page.locator('[data-js="tag-filter"] button:not([data-tag="__all__"])').first();
    await firstTag.click();

    await expect(countEl).not.toHaveClass(/hidden/);
    // Should contain "X of Y" format
    await expect(countEl).toHaveText(/\d+ of \d+/);
  });

  test('URL updates with ?tags= param on filter', async ({ page }) => {
    await page.goto('/portfolio');

    const firstTag = page.locator('[data-js="tag-filter"] button:not([data-tag="__all__"])').first();
    const tagName = await firstTag.getAttribute('data-tag');
    await firstTag.click();

    await expect(page).toHaveURL(new RegExp(`tags=${encodeURIComponent(tagName!)}`));
  });

  test('loading page with ?tags= pre-selects filter', async ({ page }) => {
    // First, find a valid tag name
    await page.goto('/portfolio');
    const firstTag = page.locator('[data-js="tag-filter"] button:not([data-tag="__all__"])').first();
    const tagName = await firstTag.getAttribute('data-tag');

    // Navigate with tag in URL
    await page.goto(`/portfolio?tags=${encodeURIComponent(tagName!)}`);

    const btn = page.locator(`[data-tag="${tagName}"]`);
    await expect(btn).toHaveAttribute('aria-pressed', 'true');

    // Some cards should be filtered
    const hiddenCards = page.locator('[data-js="portfolio-grid"] > div.card-hidden');
    const allCards = page.locator('[data-js="portfolio-grid"] > div');
    const total = await allCards.count();
    const visible = total - await hiddenCards.count();
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThanOrEqual(total);
  });
});
