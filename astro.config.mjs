import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkArchiveLinks from './src/plugins/remark-archive-links.mjs';
import rehypeCitationScope from './src/plugins/rehype-citation-scope.mjs';

// Map each /blog/<slug> path to its most recent frontmatter date
// (updatedDate if present, else pubDate) so the sitemap can emit an accurate
// <lastmod>. Read at config time with a minimal frontmatter parse — avoids a
// dependency just to pull two date fields.
function blogLastmodByPath() {
  const dir = './src/content/blog';
  const map = new Map();
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => /\.(md|mdx)$/.test(f));
  } catch {
    return map; // bodies may be gitignored during the curation window
  }
  for (const file of files) {
    const fm = readFileSync(`${dir}/${file}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const block = fm[1];
    const slugMatch = block.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
    const slug = (slugMatch ? slugMatch[1] : file.replace(/\.(md|mdx)$/, '')).trim();
    const updated = block.match(/^updatedDate:\s*["']?(\d{4}-\d{2}-\d{2})/m);
    const published = block.match(/^pubDate:\s*["']?(\d{4}-\d{2}-\d{2})/m);
    const date = updated?.[1] ?? published?.[1];
    if (date) map.set(`/blog/${slug}`, date);
  }
  return map;
}

const BLOG_LASTMOD = blogLastmodByPath();

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.dotmavriq.life',
  outDir: './dist',
  publicDir: './public',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const date = BLOG_LASTMOD.get(path);
        if (date) {
          // The regex only checks shape (YYYY-MM-DD); a value like 2024-02-30
          // is format-valid but not a real date. Fail loud with a useful message
          // rather than letting toISOString() throw a cryptic RangeError.
          const parsed = new Date(`${date}T00:00:00Z`);
          if (Number.isNaN(parsed.getTime())) {
            throw new Error(`Invalid frontmatter date "${date}" for sitemap path ${path}`);
          }
          item.lastmod = parsed.toISOString();
        }
        return item;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'jgs',
      cssVariable: '--font-jgs',
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            src: ['./public/fonts/Jgs-SingleLine.woff2'],
            weight: '400',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'CommitMono',
      cssVariable: '--font-commit-mono',
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            src: ['./public/fonts/CommitMono-400-Regular.woff2'],
            weight: '400',
            style: 'normal',
          },
          {
            src: ['./public/fonts/CommitMono-400-Italic.woff2'],
            weight: '400',
            style: 'italic',
          },
          {
            src: ['./public/fonts/CommitMono-700-Regular.woff2'],
            weight: '700',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Recursive Variable',
      cssVariable: '--font-recursive',
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            src: ['@fontsource-variable/recursive/files/recursive-cyrillic-ext-wght-normal.woff2'],
            weight: '300 1000',
            style: 'normal',
            unicodeRange: ['U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F'],
          },
          {
            src: ['@fontsource-variable/recursive/files/recursive-vietnamese-wght-normal.woff2'],
            weight: '300 1000',
            style: 'normal',
            unicodeRange: ['U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB'],
          },
          {
            src: ['@fontsource-variable/recursive/files/recursive-latin-ext-wght-normal.woff2'],
            weight: '300 1000',
            style: 'normal',
            unicodeRange: ['U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'],
          },
          {
            src: ['@fontsource-variable/recursive/files/recursive-latin-wght-normal.woff2'],
            weight: '300 1000',
            style: 'normal',
            unicodeRange: ['U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'],
          },
        ],
      },
    },
  ],
  markdown: {
    remarkPlugins: [remarkArchiveLinks],
    rehypePlugins: [rehypeCitationScope],
    shikiConfig: {
      theme: 'gruvbox-dark-hard',
    },
  },
  build: {
    format: 'file'
  }
});
