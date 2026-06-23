import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG AA color-contrast audit (issue #22). Runs axe-core's color-contrast rule
// against representative pages in both themes. The 6-token color system lives in
// src/styles/global.css; this test is the guard that keeps every text/background
// pairing at AA as those tokens evolve.

const PAGES = [
  '/',
  '/about',
  '/cv',
  '/blog',
  '/blog/ai-a-retrospective-part-2', // a representative blog post
  '/404',
];

const THEMES = ['light', 'dark'] as const;

for (const theme of THEMES) {
  for (const path of PAGES) {
    test(`contrast AA — ${theme} — ${path}`, async ({ page }) => {
      // Set the persisted theme before the page's inline theme script runs.
      await page.addInitScript((t) => {
        try {
          localStorage.setItem('blog-theme', t);
        } catch {
          /* storage may be unavailable */
        }
      }, theme);

      await page.goto(path, { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      const violations = results.violations.flatMap((v) =>
        v.nodes.map((n) => `${n.target.join(' ')} — ${n.failureSummary?.split('\n').pop()?.trim()}`)
      );
      expect(violations, violations.join('\n')).toEqual([]);
    });
  }
}
