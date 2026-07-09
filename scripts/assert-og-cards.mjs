// Every page must declare an og:image that exists, is a raster format social
// platforms actually render, and is 1200x630. Portrait or SVG og:images produce
// cropped or blank link previews — see issue #83.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIST = join(ROOT, 'dist');
const SITE = 'https://blog.dotmavriq.life';
const WANT_W = 1200;
const WANT_H = 630;
const MAX_BYTES = 200 * 1024;

// PNG: width/height are big-endian uint32 at byte 16 and 20 of the IHDR chunk.
function pngSize(file) {
  const buf = readFileSync(file);
  const isPng = buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47;
  if (!isPng) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

if (!existsSync(DIST)) {
  console.error('[assert-og-cards] dist/ missing — run the build first');
  process.exit(1);
}

const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const problems = [];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const url = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  const rel = page.slice(DIST.length + 1);

  if (!url) {
    problems.push(`${rel}: no og:image`);
    continue;
  }
  if (url.endsWith('.svg')) {
    problems.push(`${rel}: og:image is an SVG — no social platform renders it`);
    continue;
  }
  if (!url.startsWith(SITE)) {
    problems.push(`${rel}: og:image is not an absolute ${SITE} URL (${url})`);
    continue;
  }

  const asset = join(DIST, url.slice(SITE.length));
  if (!existsSync(asset)) {
    problems.push(`${rel}: og:image 404s (${url}) — run \`npm run og\``);
    continue;
  }

  const bytes = statSync(asset).size;
  if (bytes > MAX_BYTES) {
    problems.push(`${rel}: og:image is ${(bytes / 1024).toFixed(0)} KB, over the 200 KB budget`);
  }

  const size = pngSize(asset);
  if (!size) {
    problems.push(`${rel}: og:image is not a PNG (${url})`);
  } else if (size.width !== WANT_W || size.height !== WANT_H) {
    problems.push(`${rel}: og:image is ${size.width}x${size.height}, want ${WANT_W}x${WANT_H}`);
  }
}

if (problems.length > 0) {
  for (const p of problems) console.error(`[assert-og-cards] ${p}`);
  console.error(`[assert-og-cards] ${problems.length} problem(s) across ${pages.length} page(s)`);
  process.exit(1);
}
console.log(`[assert-og-cards] ok (${pages.length} pages, all 1200x630 PNG under 200 KB)`);
