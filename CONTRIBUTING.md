# Contributing

This is a solo project, but it runs on a real workflow so that every change is
reviewed, gated, and reversible. The operating contract lives in
[`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md); this file is the
quick "how do I land a change" version.

## The flow (solo-fast PR)

Code and infrastructure changes go through a pull request — even solo. It costs
almost nothing (auto-merge handles the merge) and it buys a reviewable diff, a
green check, and a paper trail.

```bash
git checkout -b <type>/<short-description>   # e.g. ci/deterministic-gates
# ...make the change...
npm run verify:local                          # run the gates before pushing
git push -u origin HEAD
gh pr create --fill
gh pr merge --auto --squash                   # merges itself once checks pass
```

`main` is protected: a PR merges only when the deterministic checks are green.
A failing build can never replace the live site.

## Content fast-path

Blog post bodies (`src/content/blog/*.md`) are hand-written prose, not code.
During the curation window they may be pushed directly and are excluded from AI
review. Everything else (components, layouts, scripts, config, CI) goes through a
PR.

## Issue & PR templates, labels

New issues pick a type from `.github/ISSUE_TEMPLATE/`; each applies its label and
a matching title prefix. PRs use `.github/PULL_REQUEST_TEMPLATE.md` (summary,
test plan, related issues). The same vocabulary is used for the title prefix, the
branch name (`<type>/<short-description>`), and the commit subject, so a change
reads the same from issue to branch to PR to log.

| Type | Label | Prefix | For |
|------|-------|--------|-----|
| Feature | `enhancement` | `feat:` | New capability or improvement |
| Bug | `bug` | `bug:` | Incorrect render/build/behavior |
| Chore | `chore` | `chore:` | Tooling, CI, deps, housekeeping |
| Accessibility | `accessibility` | `a11y:` | Contrast, semantics, keyboard, motion |
| Performance | `performance` | `perf:` | Page weight, runtime cost, jank, budgets |
| SEO/AEO | `seo` | `seo:` | Metadata, structured data, sitemap, feeds |
| Content | `content` | `content:` | Blog prose, dead links, new writing |

Other in-use labels: `ci`, `refactor`, `documentation`, `dependencies` (Dependabot).

## Pre-push checklist

Mirror the blocking CI gates locally before opening a PR:

```bash
npm run guard:remotes      # no local filesystem git remotes
npm run guard:links        # no trailing-slash internal links in sources
npm run guard:structure    # image budgets, no framework/icon deps, <pre> aria
npm run guard:deps         # no unused deps / exports / files (knip)
npx astro check            # type-check (strict)
npm run build              # static build
npm run guard:builtlinks   # every internal link resolves in the build
npm run guard:bundle       # shipped JS stays under budget
npx playwright test --project=chromium
```

## Review tooling

- **CodeRabbit** reviews every PR automatically (free for this public repo).
  Path-filtered to skip blog prose and lockfiles. Advisory — it does not gate.
- **Qodo** is intentionally *not* installed on the repo. Use it locally (IDE
  plugin / CLI) for test generation and deep-dives on larger changes. No metered
  AI bot is allowed to comment in the public repo.
- The hard guarantees are the deterministic CI gates above, which we own
  outright and which cannot run out of credits.

## Commit hygiene

Plain commit messages. **Never** add `Co-Authored-By` trailers or any AI/tool
attribution footer to commits or PRs.
