# blog.dotmavriq.life

This is the source for `blog.dotmavriq.life`: my CV, portfolio, and devblog in
one place. It runs on Astro, deploys to GitHub Pages, and looks the way it does
on purpose.

## What this is

The site is built around an ASCII-Core aesthetic. Every decorative element is
drawn with monospace characters: the navigation border scrolls like ticker tape,
the homepage renders an animated cityscape out of box-drawing glyphs, and the
small link treatments are text boxes rather than icon soup.

The idea is simple: text can carry more taste than another polished template. It
loads fast, works everywhere, and survives inspection. That matters for a site
whose job is to represent the person who built it.

## How it's built

Astro handles static site generation. Each page is a `.astro` component: HTML
with scoped styles and small vanilla scripts where behavior is needed. There is
no client-side framework runtime shipped to the browser.

The visual identity comes from **JGS SingleLine**, a monospace typeface built
for box drawing. When you see a building in the skyline or a cloud drifting
under the header, that is a `<pre>` tag and a small rendering loop doing the
work. No icon library, no decorative image pack, no imported visual system.

Key pieces worth reading if you're poking around:

- `src/components/StructuralArt.astro` - the animated homepage cityscape.
- `src/components/CloudMarquee.astro` - the scrolling ASCII border under the nav.
- `src/layouts/BaseLayout.astro` - the shell, navigation, theme toggle, and page chrome.
- `src/pages/blog/[slug].astro` - the article renderer.
- `src/components/DotBlogAI.astro` - the Oliv chat window. The static site owns
  the UI; a Cloudflare Worker owns the prompt, provider configuration, and
  response logic.
- `src/styles/global.css` - resets and the small colour system.

## Running it locally

```bash
npm install
npm run dev
```

That gives you a dev server at `localhost:4321`. Changes hot-reload.

To build for production:

```bash
npm run build
```

Output lands in `dist/`. That folder is what gets deployed.

For the technical map, read [`docs/SITE_NOTES.md`](docs/SITE_NOTES.md).

## Design decisions worth knowing about

**Mobile-first, desktop-impressive.** The layout starts stacked and simple. On
wider screens, the homepage becomes a full-viewport scene with the ASCII
cityscape filling the available space. It should feel like a page with a point
of view, not a card dropped into a starter theme.

**Decoration is text.** The visual system is made from characters and CSS. That
keeps the site light, inspectable, and harder to confuse with the usual
portfolio mulch.

**Two themes, same character.** Light mode is warm paper. Dark mode is dark
earth. The mood shifts; the structure does not.

**Static first.** Feeds, sitemap, search index, metadata, social cards, and
structured data are generated with the build. The published site should be easy
to crawl, quote, and understand without needing JavaScript to explain itself.

## Who I am

Jonatan Jansson, going by dotMavriQ in most places online. Developer, systems thinker, person who believes the tools we build should make us lighter. This site is a small corner about the craft of trying.

- [GitHub](https://github.com/dotMavriQ)
- [LinkedIn](https://www.linkedin.com/in/janssonjonatan/)
- [Fediverse](https://social.dotmavriq.life/users/dotmavriq)

## License

The code is here for reference and learning. If something in the implementation helps you build your own thing, take it. If you want to fork the whole aesthetic — make it yours first, then ship it.
