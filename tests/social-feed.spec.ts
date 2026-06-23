import { test, expect } from '@playwright/test';

const TIMELINE = /social\.dotmavriq\.life\/api\/v1\/timelines\/public/;

function samplePosts() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: String(1000 - i),
    url: `https://social.dotmavriq.life/notice/${1000 - i}`,
    created_at: '2026-06-01T12:00:00.000Z',
    content: `<p>sample post ${i}</p>`,
    visibility: 'public',
    account: { avatar: 'https://social.dotmavriq.life/avatar.png', display_name: 'dotmavriq', acct: 'dotmavriq' },
    media_attachments: [],
  }));
}

test('social feed renders on initial load with exactly one timeline request', async ({ page }) => {
  let timelineCalls = 0;
  await page.route(TIMELINE, async (route) => {
    timelineCalls++;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(samplePosts()) });
  });

  await page.goto('/social');

  // Feed must populate (this is the bug: it often stayed blank).
  await expect(page.locator('#social-feed .social-post').first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#social-feed .social-post')).toHaveCount(20);

  // No redundant double-init: the initial load must not fire two timeline fetches.
  await page.waitForTimeout(600);
  expect(timelineCalls, 'initial load should make exactly one timeline request').toBe(1);
});

test('a transient second init cannot clobber an already-loaded feed', async ({ page }) => {
  await page.route(TIMELINE, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(samplePosts()) });
  });
  await page.goto('/social');
  await expect(page.locator('#social-feed .social-post')).toHaveCount(20);

  // Re-invoking the bootstrap (as a stray astro:page-load would) must be a no-op
  // on the same element, not a re-fetch that could fail and blank the feed.
  await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')));
  await page.waitForTimeout(400);
  await expect(page.locator('#social-feed .social-post')).toHaveCount(20);
});
