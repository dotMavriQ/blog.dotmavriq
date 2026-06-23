# Production Readiness

The canonical, agent-readable operating manual for `blog.dotmavriq.life`. Read
this before making structural changes. Design and content rules live in
[`SITE_NOTES.md`](SITE_NOTES.md); this file owns **workflow, CI, and the deploy
contract**.

## One repo, one path to production

There is exactly one source of truth: this repository, remote
`dotMavriQ/blog.dotmavriq`, deployed to `https://blog.dotmavriq.life` via GitHub
Pages (`build_type: workflow`). Older local checkouts (`dotBlog`, `dotBlog2`, a
stray `blog.dotmavriq.life` folder) and stale remote branches (`astro`,
`gh-pages`, `local`, `site-live`) have been removed. The only branch is `main`.

- **No local filesystem git remotes.** Enforced by `npm run guard:remotes`.
- Do not recreate side branches for deploys; `main` is the deploy branch.

## Deploy model — gated direct-push

Push straight to `main`. The pipeline is self-gating, so a broken build can
never replace the live site:

```
push main
  └─ verify   guards → astro check → build → built-link check → chromium smoke
        ├─ FAIL → deploy SKIPPED, live site stays on last good build
        └─ PASS → deploy → blog.dotmavriq.life
                     └─ healthcheck (curl live URL: 200 + marker)
  audit (advisory, parallel, never blocks): Lighthouse, archive links, cross-browser
```

Defined in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
`concurrency: pages` with `cancel-in-progress: false` serializes deploys.

### Blocking gates (in `verify` — these stop a deploy)
1. `npm run guard:remotes` — no local filesystem remotes.
2. `npm run guard:links` — no trailing-slash internal links in post sources.
3. `npx astro check` — type check.
4. `npm run build` — full static build (`DOTBLOG_PUBLISH_POSTS=1`).
5. `npm run guard:builtlinks` — every internal `href`/`src` in `dist/**/*.html`
   resolves to a real file (artifact-level 404 backstop).
6. `npx playwright test --project=chromium` — fast single-browser smoke.

### Advisory signals (never block)
- Lighthouse budgets (`lighthouserc.json`), archive-link check, firefox/webkit
  smoke — all `continue-on-error`. Useful, but the site is not held hostage by a
  transient external checker.

### Post-deploy
- `healthcheck` job curls the live URL after deploy and asserts HTTP 200 plus a
  homepage marker string, retrying briefly for CDN propagation. A red
  `healthcheck` means the live site is actually broken — investigate immediately
  (the previous build is what visitors still see only if `deploy` itself failed;
  once `deploy` succeeds the new build is live).

## Structural invariants (do not violate without explicit user approval)

See [`SITE_NOTES.md`](SITE_NOTES.md) for full rationale. In brief: no SVG icons
or icon libraries; no client-side framework runtime; decorative visuals are
`<pre>` + JGS SingleLine and `aria-hidden="true"`; design tokens are the small
set of CSS variables in `src/styles/global.css`; OG/social-card images ≤ 200 KB;
`prefers-reduced-motion` honored by every animated component.

During the active EOD-push curation window, `src/content/blog/*.md` body content
is **owned by the user** (hand rewrite). Agents must not edit post bodies;
frontmatter additions are fine only as part of an explicit task.

## Pre-push checklist

Run locally before pushing to `main` (mirrors the blocking CI gates):

```bash
npm run guard:remotes
npm run guard:links
npx astro check
npm run build
npm run guard:builtlinks
npx playwright test --project=chromium
```

## Commit hygiene

Plain commit messages only. **Never** add `Co-Authored-By` trailers or any
AI/tool attribution footer to commits or PRs.
