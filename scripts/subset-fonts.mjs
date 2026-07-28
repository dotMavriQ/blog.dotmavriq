// Subsets CommitMono from assets/fonts/ (source of truth) into public/fonts/,
// which is what astro.config.mjs feeds to the local font provider.
//
// CommitMono ships 1175 glyphs. This site needs Latin, punctuation, currency,
// arrows, maths and box drawing. It does not need the 256 Braille patterns or
// the Greek block, which together are most of the weight.
//
// Run `npm run fonts:subset` after replacing a source font. The outputs are
// committed, because the deploy workflow has no Python and the sources change
// approximately never.
//
// Requires: pip install 'fonttools[woff]' brotli

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC = join(ROOT, 'assets/fonts');
const OUT = join(ROOT, 'public/fonts');

const FACES = [
  'CommitMono-400-Regular',
  'CommitMono-400-Italic',
  'CommitMono-700-Regular',
];

// Kept deliberately generous: pyftsubset intersects these with the font's own
// cmap, so requesting a block the font lacks costs nothing.
//
//   0000-00FF  Basic Latin + Latin-1 Supplement (includes · »)
//   0100-017F  Latin Extended-A — accented names in the Mastodon feed
//   2000-206F  General Punctuation (em dash, ellipsis, curly quotes)
//   20A0-20BF  Currency (€)
//   2122       Trademark
//   2190-21FF  Arrows (→ used by the homepage CTA)
//   2200-22FF  Mathematical Operators (≤ ≥ − ×)
//   2500-259F  Box Drawing + Block Elements — the /404 snake renders ─ and █
//              in CommitMono; the wider block is kept so a future code block
//              with an ASCII diagram does not silently fall back.
//   2700-27BF  Dingbats (✕ closes the mobile nav)
//
// Not kept: 0370-03FF Greek, 2800-28FF Braille (256 glyphs, unused).
const UNICODES = [
  'U+0000-00FF',
  'U+0100-017F',
  'U+2000-206F',
  'U+20A0-20BF',
  'U+2122',
  'U+2190-21FF',
  'U+2200-22FF',
  'U+2500-259F',
  'U+2700-27BF',
].join(',');

const LAYOUT_FEATURES = 'kern,liga,calt,ccmp,locl,mark,mkmk';

if (!existsSync(SRC)) {
  console.error(`[subset-fonts] missing ${SRC} — the unsubsetted originals live there`);
  process.exit(1);
}

let before = 0;
let after = 0;

for (const face of FACES) {
  const src = join(SRC, `${face}.woff2`);
  const out = join(OUT, `${face}.woff2`);
  if (!existsSync(src)) {
    console.error(`[subset-fonts] missing source ${src}`);
    process.exit(1);
  }

  execFileSync('pyftsubset', [
    src,
    `--unicodes=${UNICODES}`,
    `--layout-features=${LAYOUT_FEATURES}`,
    '--flavor=woff2',
    `--output-file=${out}`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  const b = readFileSync(src).length;
  const a = readFileSync(out).length;
  before += b;
  after += a;
  console.log(`[subset-fonts] ${face}  ${(b / 1024).toFixed(1)}K -> ${(a / 1024).toFixed(1)}K`);
}

const saved = ((before - after) / 1024).toFixed(1);
console.log(`[subset-fonts] ${(before / 1024).toFixed(1)}K -> ${(after / 1024).toFixed(1)}K (saved ${saved}K)`);
