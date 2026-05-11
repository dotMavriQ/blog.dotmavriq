import { test, expect } from "@playwright/test";
import sharp from "sharp";

/**
 * Proves (or disproves) the report that the header menu glyphs shift
 * by a sub-pixel amount when toggling between light and dark themes.
 *
 * Two independent measurements are taken:
 *
 *   1. Layout proof — sub-pixel bounding boxes of every `.nav-links a`
 *      and `.nav-logo` element are compared. If the box positions or
 *      sizes differ at all, the shift is at the layout level (font
 *      metrics computed differently, letter-spacing rounding, etc).
 *
 *   2. Paint proof — a screenshot of the nav region is taken in each
 *      theme. Each is thresholded to a binary "glyph silhouette" using
 *      luminance (text vs background, regardless of which is which).
 *      The two silhouettes are XOR-diffed. Any non-zero pixels prove
 *      the rasterized glyphs occupy different physical pixels in the
 *      two themes — a paint-level (sub-pixel anti-aliasing) shift.
 */

const NAV_CLIP = { x: 0, y: 0, width: 1280, height: 110 };

async function captureBoxes(page: import("@playwright/test").Page) {
  return await page.$$eval(
    ".nav-links a, .nav-logo",
    (els: Element[]) =>
      els.map((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return {
          text: (el.textContent || "").trim().slice(0, 24),
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
        };
      }),
  );
}

async function captureSilhouette(
  page: import("@playwright/test").Page,
): Promise<{ data: Buffer; width: number; height: number }> {
  const png = await page.screenshot({ clip: NAV_CLIP, type: "png" });
  // Decode → grayscale → threshold at midpoint luminance.
  // Whichever side of the threshold the glyph is on, we map glyphs to 1
  // and background to 0 so the masks are comparable across themes.
  const { data, info } = await sharp(png)
    .removeAlpha()
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Determine background luminance from a corner pixel (assumed to be bg).
  const bgLum = data[0];
  const isDarkBg = bgLum < 128;
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    // Map the glyph (the side opposite to background) to 1.
    const isGlyph = isDarkBg ? v >= 128 : v < 128;
    out[i] = isGlyph ? 1 : 0;
  }
  return { data: out, width: info.width, height: info.height };
}

function diffMasks(a: Buffer, b: Buffer): number {
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff;
}

test("header menu does not drift when toggling theme", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  // Wait for fonts so glyph metrics are final.
  await page.evaluate(() => (document as any).fonts.ready);
  await page.waitForTimeout(300);

  // Force light, settle past any color-transition.
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
  });
  await page.waitForTimeout(500);

  const lightBoxes = await captureBoxes(page);
  const lightMask = await captureSilhouette(page);

  // Toggle to dark, settle.
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await page.waitForTimeout(500);

  const darkBoxes = await captureBoxes(page);
  const darkMask = await captureSilhouette(page);

  // ── Layout proof ──
  const layoutDeltas = lightBoxes.map((l, i) => {
    const d = darkBoxes[i];
    return {
      text: l.text,
      dx: +(d.x - l.x).toFixed(4),
      dy: +(d.y - l.y).toFixed(4),
      dw: +(d.w - l.w).toFixed(4),
      dh: +(d.h - l.h).toFixed(4),
    };
  });
  console.log("\n── Layout deltas (sub-pixel bounding boxes) ──");
  for (const d of layoutDeltas) console.log(JSON.stringify(d));

  // ── Paint proof ──
  expect(lightMask.width).toBe(darkMask.width);
  expect(lightMask.height).toBe(darkMask.height);
  const pixelDiff = diffMasks(lightMask.data, darkMask.data);
  const totalPx = lightMask.width * lightMask.height;
  console.log(
    `\n── Paint diff (binary glyph silhouettes) ──\n` +
      `differing pixels: ${pixelDiff} / ${totalPx} ` +
      `(${((pixelDiff / totalPx) * 100).toFixed(4)}%)\n`,
  );

  // Don't fail the test — we want both numbers reported either way.
  // Soft assertions for the record:
  test.info().annotations.push({
    type: "layout-max-shift-px",
    description: String(
      Math.max(
        ...layoutDeltas.flatMap((d) => [
          Math.abs(d.dx),
          Math.abs(d.dy),
          Math.abs(d.dw),
          Math.abs(d.dh),
        ]),
      ),
    ),
  });
  test.info().annotations.push({
    type: "paint-diff-pixels",
    description: String(pixelDiff),
  });
});
