import { test, expect } from '@playwright/test';

// Desktop + motion allowed: the ASCII cityscape animates (its #ascii-scene
// textContent changes each frame). Scrolling it fully off screen must pause the
// loop so the content stops changing; bringing it back must resume it.
test('cityscape pauses when off screen and resumes on return', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const scene = page.locator('#ascii-scene');
  await expect(scene).toBeVisible();
  const snap = () => scene.evaluate((el) => el.textContent ?? '');

  // On screen → animating.
  const a = await snap();
  await page.waitForTimeout(500);
  const b = await snap();
  expect(b, 'should animate while on screen').not.toBe(a);

  // Off screen → paused (content frozen).
  await page.evaluate(() => {
    const w = document.getElementById('ascii-scene')?.parentElement as HTMLElement | null;
    if (w) { w.style.position = 'fixed'; w.style.top = '-5000px'; w.style.left = '0'; w.style.height = '300px'; w.style.width = '300px'; }
  });
  await page.waitForTimeout(500);
  const c = await snap();
  await page.waitForTimeout(500);
  const d = await snap();
  expect(d, 'should be frozen while off screen').toBe(c);

  // Back on screen → resumes.
  await page.evaluate(() => {
    const w = document.getElementById('ascii-scene')?.parentElement as HTMLElement | null;
    if (w) { w.style.removeProperty('position'); w.style.removeProperty('top'); w.style.removeProperty('left'); w.style.removeProperty('height'); w.style.removeProperty('width'); }
  });
  await page.waitForTimeout(500);
  const e = await snap();
  await page.waitForTimeout(500);
  const f = await snap();
  expect(f, 'should resume animating after returning on screen').not.toBe(e);
});
