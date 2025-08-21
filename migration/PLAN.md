Migration Plan: gh-pages -> Astro

Purpose
- Incrementally port the live gh-pages site (golden source in ../deployed-gh-pages) into the Astro project.
- Work page-by-page and component-by-component, verify locally, and only commit small, reviewable diffs.

Repository layout
- Golden source: ../deployed-gh-pages (read-only reference)
- Working branch: migrate/gh-pages-parity
- Migration artifacts in repo root under migration/ (this file and migration-index.html)

How we will work
- Convert one page at a time to `src/pages/...` and extract shared UI into `src/components`.
- Copy static assets into `public/` (done for many assets already).
- For each converted page: run `npm run dev`, inspect in browser, and run `npm run build && npm run preview` to validate production build output.
- I will mark checklist items as completed and push commits to the migration branch. You will verify locally and sign-off before we proceed to the next item.

Acceptance criteria (per page)
- Visual parity for major layout, hero, nav, footer, fonts and colours.
- Interactive behavior (theme switch, hero GIF, animations) works or is flagged for later refinement.
- All assets referenced by page are present in `public/`.
- Page builds successfully with `npm run build`.

Checklist

[Phase 0 — Prep]
- [x] Create migration branch `migrate/gh-pages-parity` (branch created)
- [x] Copy deployed assets into `public/` (SVGs, GIFs, PNGs, PDFs, favicon)
- [x] Save deployed `index.html` as `migration-index.html` (reference file added)
- [ ] Add migration README and tasks (this file)

[Phase 1 — Global shell & styles]
- [ ] Port / recreate `Nav` markup & styles
- [ ] Port / recreate `Footer` markup & styles
- [ ] Import deployed global CSS rules into `src/styles/main.css` (or modular files)
- [ ] Ensure fonts, favicon, CNAME, and immediate dark-mode detection match deployed

[Phase 2 — Home page]
- [ ] Port `index.html` content into `src/pages/index.astro`
- [ ] Ensure hero GIF is properly sized and stacked
- [ ] Finalize `RoadAnimation` parameters for pixel parity (we already have an improved port)
- [ ] Verify social links, action buttons and quick-links

[Phase 3 — Content pages]
- [ ] Port `about.html` -> `src/pages/about.astro`
- [ ] Port `portfolio.html` -> `src/pages/portfolio.astro`
- [ ] Port `contact.html` -> `src/pages/contact.astro`
- [ ] Port `cv.html` -> `src/pages/cv.astro`

[Phase 4 — Blog]
- [ ] Port `blog.html` -> `src/pages/blog/index.astro`
- [ ] Decide on posts strategy: static HTML -> `public/blog` (temporary) or convert to Astro content collection
- [ ] Port 1 canonical blog post to verify templates

[Phase 5 — Polish & CI]
- [ ] Run Lighthouse and fix high-priority regressions
- [ ] Add CI job to build and optionally deploy to a staging branch
- [ ] Prepare final deployment plan to replace gh-pages when parity is approved

Verification steps (per item)
- Step 1: run `npm ci` then `npm run dev -- --host` in project root
- Step 2: open http://localhost:3000 and compare with ../deployed-gh-pages/index.html (or live site)
- Step 3: run `npm run build && npm run preview` and validate generated output
- Step 4: if visual diffs exist, I will adjust styles/components until parity or record deliberate differences in migration notes

Notes and conventions
- Keep commits granular and descriptive (e.g. `migration(index): port homepage markup and assets`).
- Don't overwrite the live `CNAME` or change deployment configuration until full parity is reached.
- Use the `migration/` folder for reference copies of deployed pages (already storing migration-index.html).

Next actions (I will do if you confirm):
1) Port `migration-index.html` -> `src/pages/index.astro`, wire in current `RoadAnimation` component and copy any missing assets.
2) Run dev server and produce screenshots for visual comparison.

Confirm and I will start with action #1 now.
