#!/usr/bin/env node
// Enforces the project's structural invariants (see CLAUDE.md / docs/SITE_NOTES.md)
// across the whole repo, deterministically, with no external services:
//
//   1. Image budgets — public/img/blog/* ≤ 200 KB (social cards),
//      other public/img/* ≤ 500 KB.
//   2. No client-side framework runtime or icon library in dependencies.
//   3. Every <pre> in a .astro source carries aria-hidden / aria-label /
//      aria-labelledby (decorative ASCII must be hidden from assistive tech).
//
// This replaces the never-installed .qodo/pre-push-guardian.sh with a real,
// CI-enforced gate.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const violations = [];

// ── 1. Image budgets ────────────────────────────────────────────────────────
function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

for (const path of walkFiles("public/img")) {
  const kb = statSync(path).size / 1024;
  const limit = path.includes("/blog/") ? 200 : 500;
  if (kb > limit) {
    violations.push(`image budget: ${path} is ${Math.round(kb)} KB (max ${limit} KB)`);
  }
}

// ── 2. No framework runtime / icon library ───────────────────────────────────
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
const banned = [
  /^react$/, /^react-dom$/, /^vue$/, /^svelte$/, /^solid-js$/, /^preact$/,
  /^lucide-react$/, /^@fortawesome\//, /^astro-icon$/, /^@iconify\//,
  /^react-icons$/, /^@heroicons\//,
];
for (const name of Object.keys(allDeps)) {
  if (banned.some((re) => re.test(name))) {
    violations.push(`banned dependency (framework runtime or icon library): ${name}`);
  }
}

// ── 3. <pre> elements must be labelled for assistive tech ────────────────────
const PRE_RE = /<pre\b[^>]*>/gis;
const ARIA_RE = /aria-(hidden|label|labelledby)=/i;
function astroFiles(dir) {
  return walkFiles(dir).filter((p) => p.endsWith(".astro"));
}
for (const path of astroFiles("src")) {
  const src = readFileSync(path, "utf8");
  let m;
  while ((m = PRE_RE.exec(src)) !== null) {
    if (!ARIA_RE.test(m[0])) {
      const line = src.slice(0, m.index).split("\n").length;
      violations.push(
        `${relative(".", path)}:${line}  <pre> without aria-hidden / aria-label / aria-labelledby`
      );
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
if (violations.length) {
  console.error("[assert-structural-invariants] invariant violations:");
  for (const v of violations) console.error(`  - ${v}`);
  console.error(`\n${violations.length} violation(s).`);
  process.exit(1);
}

console.log("[assert-structural-invariants] ok (image budgets, no framework/icon deps, <pre> labelled)");
