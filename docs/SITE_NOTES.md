# Site Notes

These notes are here so the site stays legible after the exciting part is over.
The public surface is `blog.dotmavriq.life`: my CV, portfolio, and devblog in
one place. The repo should read the same way the site does: opinionated, small
enough to hold in your head, and allergic to generic gloss.

## Shape

The site is an Astro static build deployed to GitHub Pages. There is no server
runtime in the published site and no client-side framework runtime in the
browser. Pages are `.astro` files, shared behavior lives in narrow helpers, and
the blog is an Astro content collection under `src/content/blog/`.

Public routes:

- `/` introduces the site and the ASCII cityscape.
- `/about` gives the human version of the CV.
- `/cv` is the recruiter-facing artifact.
- `/portfolio` is intentionally lean. Some work is NDA-bound; the page should
  still feel owned, not apologetic.
- `/blog` and `/blog/{slug}` carry the writing archive.
- `/contact` gives the next action.
- `/social` proxies the live Fediverse profile.
- `/404` is part of the same visual system.
- `/rss.xml`, `/atom.xml`, `/search-index.json`, `robots.txt`, `llms.txt`, and
  the sitemap are part of the product, not afterthoughts.

## Design Rules

The visual language is ASCII-Core. Decoration is text doing the work normally
outsourced to icon packs, gradients, and stock blobs.

- JGS SingleLine is the load-bearing display font for box drawing.
- Decorative ASCII belongs in `<pre>` and must be hidden from assistive tech.
- The colour system is the small set of CSS variables in
  `src/styles/global.css`.
- No icon libraries.
- No decorative SVG swaps for things that are meant to be text.
- The existing functional link icons are locked exceptions. Do not redraw,
  replace, or restyle them unless that decision is explicitly changed.
- No framework islands just to make a button blink.
- Motion must respect `prefers-reduced-motion`.

This is not minimalism for its own sake. Text is fast, inspectable, and hard to
fake into looking like every other portfolio template.

### Neubrutalist surfaces

The thick-border + hard offset-shadow (no `border-radius`) pattern is defined
once in `global.css`. New surfaces should use those classes instead of
copy-pasting `box-shadow: Npx Npx 0 var(--…)` into scoped styles — that
copy-paste is what drifts as pages are added.

- `.neu-box` / `.neu-box-sm` — bordered card with offset shadow + `--bg`.
- `.neu-shadow-static` — resting offset shadow only (no border/background).
- Size and colour are per-element custom properties, so a surface keeps its own
  look while sharing the definition:
  - `--neu-offset` — shadow offset (x = y), default `4px` (`3px` for `-sm`).
  - `--neu-color` — shadow colour, default `--fg` (e.g. `--muted`, `--bg`).
  - `--neu-border` — border width, default `3px`.
  - e.g. `<div class="neu-box" style="--neu-offset: 8px; --neu-color: var(--muted)">`.
- Interactive hover/active state shadows stay in the component's scoped styles —
  they are per-component motion, not the shared resting pattern. The hover
  helpers (`.neu-shadow`, `.neu-shadow-lg`, `.neu-pressed`) cover the common
  lift/press transitions.

## Content

Blog posts live in `src/content/blog/`. The renderer should make long-form
writing comfortable without taking over the voice of the posts. The body copy is
the important part; layout exists to keep it readable and navigable.

Frontmatter owns metadata. `updatedDate` is available for posts that need it.
Hero images are mapped in `src/lib/blog-hero-images.ts` so the rendered article
can use Astro image optimization. Public social-card images live in
`public/img/blog/` because those URLs need to stay stable for unfurls.

Image budgets:

- `public/img/` should stay under 500 KB per file.
- `public/img/blog/` social-card images should stay under 200 KB.

## Oliv

Oliv is the small chatbot mounted by `src/components/DotBlogAI.astro`. The
static site only owns the window, interaction states, and request contract. The
prompt, cache, provider configuration, and response logic live in a Cloudflare
Worker outside the static build.

Frontend contract:

- `POST` a JSON body with `message`.
- Expect a JSON response with `reply`, or an error shape with `error`/`detail`.
- The UI must degrade cleanly when the Worker is unavailable or rate-limited.

Current Worker model:

- Cloudflare Workers AI, `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.

The frontend should not need to know more than that.

## Build And Deploy

Local commands:

```bash
npm install
npm run dev
npm run build
npx astro check
npx playwright test --project=chromium
```

The deploy workflow is intentionally tiered. The core gate is type checking,
building, and Chromium Playwright. Lighthouse, link checking, and cross-browser
smoke tests are useful signals, but the site should not be held hostage by a
transient external link checker.

## Taste Checks

Before replacing the live site, these things have to be true:

- Every existing feature still works the way a visitor already expects.
- The layout holds on mobile, tablet, laptop, desktop, and 4K.
- The homepage ASCII art keeps clean left and right borders at large widths.
- Blog bodies have been rewritten by hand.
- Oliv has accessible, responsive, non-awkward frontend behavior.
- Metadata, feeds, sitemap, robots, and social cards are accurate.
- The repo contains no dead public files, no process diary, and no generic
  scaffolding pretending to be architecture.

Readable beats clever here. If a file is large, it should be large because the
page is specific, not because old experiments fossilized in the corners.
