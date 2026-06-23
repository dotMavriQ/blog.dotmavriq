#!/usr/bin/env node
// Deterministic performance guard: the site ships almost no client-side
// JavaScript by design (no framework runtime). This asserts that stays true by
// capping the total JS emitted into dist/_astro. A regression here usually means
// an island or dependency started shipping a runtime — exactly what we don't
// want — and it fails the build before deploy.
//
// Budgets are bytes. Current baseline is ~77 KB total; the cap leaves headroom
// for legitimate growth without silently absorbing a framework runtime.

import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST_JS_DIR = "dist/_astro";
const TOTAL_BUDGET_KB = 120; // total shipped JS
const SINGLE_BUDGET_KB = 60; // any single chunk

if (!existsSync(DIST_JS_DIR)) {
  console.error(`[assert-bundle-budget] '${DIST_JS_DIR}' not found — run the build first.`);
  process.exit(1);
}

const jsFiles = readdirSync(DIST_JS_DIR)
  .filter((name) => name.endsWith(".js"))
  .map((name) => ({ name, bytes: statSync(join(DIST_JS_DIR, name)).size }));

const totalKb = jsFiles.reduce((sum, f) => sum + f.bytes, 0) / 1024;
const oversized = jsFiles.filter((f) => f.bytes / 1024 > SINGLE_BUDGET_KB);

const problems = [];
if (totalKb > TOTAL_BUDGET_KB) {
  problems.push(`total shipped JS ${totalKb.toFixed(1)} KB exceeds budget ${TOTAL_BUDGET_KB} KB`);
}
for (const f of oversized) {
  problems.push(`chunk ${f.name} is ${(f.bytes / 1024).toFixed(1)} KB (max ${SINGLE_BUDGET_KB} KB)`);
}

if (problems.length) {
  console.error("[assert-bundle-budget] JS budget exceeded:");
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    `\nTotal ${totalKb.toFixed(1)} KB across ${jsFiles.length} chunk(s). ` +
      `If this growth is intentional, raise the budget deliberately.`
  );
  process.exit(1);
}

console.log(
  `[assert-bundle-budget] ok (${totalKb.toFixed(1)} KB across ${jsFiles.length} chunk(s), under ${TOTAL_BUDGET_KB} KB)`
);
