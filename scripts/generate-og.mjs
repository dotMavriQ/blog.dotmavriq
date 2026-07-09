// Renders 1200x630 Open Graph cards from the site's own type and rule motif.
//
// Cards are committed to public/img/og/ rather than built in CI: the deploy
// workflow has no browser, and the inputs (post titles) change rarely. Re-run
// `npm run og` after adding a post or retitling one; `guard:og` fails the build
// if a page has no card.

import { chromium } from 'playwright';
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT_DIR = join(ROOT, 'public/img/og');
const POSTS_DIR = join(ROOT, 'src/content/blog');

// The card must stay under the 200 KB OG budget asserted by
// scripts/assert-structural-invariants.mjs.
const MAX_BYTES = 200 * 1024;

const STATIC_PAGES = [
  { slug: 'default', title: 'blog.dotmavriq.life', kicker: '//' },
  { slug: 'index', title: 'We keep building tools, hoping that they make us lighter.', kicker: '// welcome' },
  { slug: 'about', title: 'About', kicker: '// about' },
  // The footer already carries the name; repeating it in the title reads as a stutter.
  { slug: 'cv', title: 'Experienced Full-Stack Developer', kicker: '// curriculum vitae' },
  { slug: 'portfolio', title: 'Portfolio', kicker: '// portfolio' },
  { slug: 'blog', title: 'Writing about software, systems I build, and the work behind them.', kicker: '// blog' },
  { slug: 'contact', title: 'Contact', kicker: '// contact' },
  { slug: 'social', title: 'Social', kicker: '// social' },
  { slug: '404', title: 'Nothing here.', kicker: '// 404' },
];

function frontmatter(file) {
  const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const block = m[1];
  // Capture the whole value then unwrap quotes. A character class excluding `'`
  // truncates titles containing apostrophes ("LinkedIn's") and drops the post.
  const pick = (k) => {
    const hit = block.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    return hit?.replace(/^(["'])(.*)\1$/, '$2');
  };
  const title = pick('title');
  if (!title) return null;
  const slug = pick('slug') ?? file.replace(/\.mdx?$/, '');
  const tags = block.match(/^tags:\s*\[([^\]]*)\]/m)?.[1];
  // Strip quotes only — \s here would weld "Digital Freedom" into "digitalfreedom".
  const tag = tags?.split(',')[0]?.replace(/["']/g, '').trim() ?? '';
  return { slug, title, kicker: tag ? `// ${tag.toLowerCase()}` : '// blog' };
}

// Long titles must not overflow the card. Step the size down by length rather
// than measuring: the type is monospaced, so length is a faithful proxy.
function titleSize(title) {
  if (title.length <= 28) return 92;
  if (title.length <= 48) return 74;
  if (title.length <= 72) return 60;
  if (title.length <= 100) return 50;
  return 42;
}

const card = ({ title, kicker }) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'CommitMono';
    src: url('${pathToFileURL(join(ROOT, 'public/fonts/CommitMono-700-Regular.woff2')).href}') format('woff2');
    font-weight: 700;
  }
  @font-face {
    font-family: 'CommitMono';
    src: url('${pathToFileURL(join(ROOT, 'public/fonts/CommitMono-400-Regular.woff2')).href}') format('woff2');
    font-weight: 400;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #f5f3ec;
    font-family: 'CommitMono', monospace;
    color: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
  }
  /* The rule stack echoes the JGS SingleLine cityscape on the homepage.
     Drawn as a gradient, not glyphs — no font dependency, no icon library. */
  .rules {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      to bottom, #d5d3cc 0 1px, transparent 1px 9px
    );
    opacity: 0.55;
  }
  .panel {
    position: relative;
    width: 1104px; height: 534px;
    background: #f5f3ec;
    border: 3px solid #1a1a1a;
    box-shadow: 12px 12px 0 #1a1a1a;
    padding: 56px 60px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .kicker {
    font-weight: 400; font-size: 26px; color: #5e5e5e;
    letter-spacing: 0.14em; text-transform: lowercase;
  }
  .title {
    font-weight: 700;
    font-size: ${'${SIZE}'}px;
    line-height: 1.16;
    letter-spacing: -0.015em;
    max-height: 320px;
    overflow: hidden;
  }
  .foot {
    display: flex; align-items: baseline; justify-content: space-between;
    border-top: 3px solid #1a1a1a; padding-top: 22px;
  }
  .name { font-weight: 700; font-size: 26px; letter-spacing: 0.16em; }
  .site { font-weight: 400; font-size: 24px; color: #5e5e5e; letter-spacing: 0.06em; }
</style>
<div class="rules"></div>
<div class="panel">
  <div class="kicker">${kicker}</div>
  <div class="title">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>
  <div class="foot">
    <span class="name">JONATAN JANSSON</span>
    <span class="site">blog.dotmavriq.life</span>
  </div>
</div>`;

const only = process.argv[2];

const posts = existsSync(POSTS_DIR)
  ? readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f)).map(frontmatter).filter(Boolean)
  : [];

let targets = [...STATIC_PAGES, ...posts];
if (only) targets = targets.filter((t) => t.slug === only);
if (targets.length === 0) {
  console.error(only ? `[og] no target named "${only}"` : '[og] nothing to render');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

let oversized = 0;
for (const target of targets) {
  const html = card(target).replace('${SIZE}', String(titleSize(target.title)));
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(OUT_DIR, `${target.slug}.png`);
  await page.screenshot({ path: out, type: 'png' });
  const bytes = readFileSync(out).length;
  if (bytes > MAX_BYTES) {
    oversized++;
    console.error(`[og] OVER BUDGET ${(bytes / 1024).toFixed(0)} KB  ${target.slug}.png`);
  } else {
    console.log(`[og] ${(bytes / 1024).toFixed(0).padStart(4)} KB  ${target.slug}.png`);
  }
}
await browser.close();

if (oversized > 0) {
  console.error(`[og] ${oversized} card(s) exceed the ${MAX_BYTES / 1024} KB OG budget`);
  process.exit(1);
}
console.log(`[og] ${targets.length} card(s) → public/img/og/`);
