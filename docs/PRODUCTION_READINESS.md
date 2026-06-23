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

## Deploy model — solo-fast PR flow

Code and infrastructure changes land via a pull request (even solo); blog post
bodies may use the content fast-path (see below). `main` is protected and merges
only when the deterministic checks are green, so a broken build can never replace
the live site. Merge to `main` triggers the deploy.

```
branch → PR → verify (deterministic gates) + CodeRabbit (advisory)
            ├─ checks red → cannot merge
            └─ checks green → auto-merge (squash) → push main
                                 └─ deploy → blog.dotmavriq.life
                                       └─ healthcheck (curl live URL: 200 + marker)
  audit (advisory, parallel, never blocks): Lighthouse, archive links, cross-browser
```

Workflow how-to lives in [`CONTRIBUTING.md`](../CONTRIBUTING.md). Pipeline is
defined in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml);
`concurrency: pages` with `cancel-in-progress: false` serializes deploys.

### Blocking gates (in `verify` — own-CI, vendor-free, cannot meter/spam)
1. `npm run guard:remotes` — no local filesystem remotes.
2. `npm run guard:links` — no trailing-slash internal links in post sources.
3. `npm run guard:structure` — structural invariants: image budgets, no framework
   runtime / icon-library deps, every `<pre>` labelled for assistive tech.
4. `npm run guard:deps` — `knip`: no unused dependencies, exports, or files.
5. `npx astro check` — type check (`astro/tsconfigs/strict`).
6. `npm run build` — full static build (`DOTBLOG_PUBLISH_POSTS=1`).
7. `npm run guard:builtlinks` — every internal `href`/`src` in `dist/**/*.html`
   resolves to a real file (artifact-level 404 backstop).
8. `npm run guard:bundle` — shipped JS stays under budget (no runtime creep).
9. `npx playwright test --project=chromium` — fast single-browser smoke.

`npm run verify:local` runs the deterministic subset in one shot.

### Advisory signals (never block)
- **CodeRabbit** — AI PR review, free for this public repo, path-filtered to skip
  blog prose + lockfiles. Judgment, not a gate.
- Lighthouse budgets (`lighthouserc.json`), archive-link check, firefox/webkit
  smoke — all `continue-on-error`. Real budgets, loud signal, but the site is not
  held hostage by a flaky external checker.

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

## Review tooling

No metered AI bot may post into the public repo — ever. The hard guarantees are
the deterministic gates above, which we own outright.

- **CodeRabbit** — the public PR reviewer. Free because the repo is public;
  configured concise + path-filtered. Advisory only.
- **Qodo** — deliberately *not* installed on the repo (its hosted bot was the
  source of "out of credits" comments). Used **local-only** (IDE plugin / CLI)
  for test generation and deep-dives on larger changes.

## Pre-push checklist

Run locally before opening a PR (mirrors the blocking CI gates):

```bash
npm run verify:local                      # all deterministic gates in one shot
npx playwright test --project=chromium    # smoke
```

## Commit hygiene

Plain commit messages only. **Never** add `Co-Authored-By` trailers or any
AI/tool attribution footer to commits or PRs.
