#!/usr/bin/env node
// Guards against broken internal links in the *built* site.
//
// The source-level guard (assert-no-trailing-slash-links.mjs) catches one
// specific authoring mistake in markdown. This guard is the artifact-level
// backstop: it crawls the emitted `dist/**/*.html` and verifies every
// root-relative href/src actually resolves to a file on disk. Under
// `build.format: 'file'`, route `/about` is emitted as `dist/about.html`, so a
// link to a page that does not exist (or a renamed/missing asset) would 404 in
// production. This runs in CI before deploy, so such regressions never go live.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";

if (!existsSync(DIST)) {
  console.error(`[assert-no-broken-links] '${DIST}/' not found — run the build first.`);
  process.exit(1);
}

// Recursively collect every .html file under dist/.
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

// Resolve a root-relative URL path to an on-disk file under dist/.
// Returns true if it maps to something that exists.
function resolves(urlPath) {
  if (urlPath === "/") return existsSync(join(DIST, "index.html"));

  const rel = urlPath.replace(/^\/+/, ""); // strip leading slash(es)
  const direct = join(DIST, rel);

  // Exact file (assets: .css/.js/.png/.webp/.ico/.xml/.json/.txt, etc.)
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  // Route emitted as <path>.html (build.format: 'file')
  if (existsSync(`${direct}.html`)) return true;
  // Directory-style route, just in case the format ever changes
  if (existsSync(join(direct, "index.html"))) return true;

  return false;
}

const ATTR_RE = /(?:href|src)="([^"]+)"/g;
const violations = [];

for (const file of walk(DIST)) {
  const html = readFileSync(file, "utf8");
  let m;
  while ((m = ATTR_RE.exec(html)) !== null) {
    const raw = m[1].trim();

    // Only check internal, root-relative links. Skip external schemes,
    // protocol-relative, anchors, and non-navigational schemes.
    if (!raw.startsWith("/") || raw.startsWith("//")) continue;

    // Strip query string and fragment before resolving.
    const urlPath = raw.split(/[?#]/)[0];
    if (!urlPath) continue;

    if (!resolves(urlPath)) {
      violations.push(`${relative(".", file)}  ->  ${raw}`);
    }
  }
}

if (violations.length) {
  // De-duplicate; the same broken link often appears on many pages.
  const unique = [...new Set(violations)];
  console.error(
    "[assert-no-broken-links] internal links with no matching file in dist/:"
  );
  for (const v of unique) console.error(`  - ${v}`);
  console.error(`\n${unique.length} broken link(s) found.`);
  process.exit(1);
}

console.log("[assert-no-broken-links] ok (all internal links resolve)");
