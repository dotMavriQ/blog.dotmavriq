import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkArchiveLinks from './src/plugins/remark-archive-links.mjs';
import rehypeCitationScope from './src/plugins/rehype-citation-scope.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.dotmavriq.life',
  outDir: './dist',
  publicDir: './public',
  integrations: [mdx(), sitemap()],
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
