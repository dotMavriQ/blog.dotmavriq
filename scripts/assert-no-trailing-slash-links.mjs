#!/usr/bin/env node
// Guards against root-relative internal links that end in a trailing slash.
//
// The site builds with `build.format: 'file'` (pages emit as `<route>.html`),
// so the canonical URL is `/path` with no trailing slash. A link written as
// `/path/` makes the host look for `/path/index.html`, which does not exist,
// and 404s. External URLs (https://host/path/) are fine and ignored.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BLOG_DIR = "src/content/blog";
const files = readdirSync(BLOG_DIR)
  .filter((name) => name.endsWith(".md"))
  .map((name) => join(BLOG_DIR, name));

// Match markdown `](/path/)` and HTML `href="/path/"` where path is non-empty
// and root-relative (starts with a single `/`, i.e. not `//` or a scheme).
const patterns = [
  /\]\((\/[^)\s/][^)\s]*\/)\)/g, // ](/path/)
  /href="(\/[^"\s/][^"\s]*\/)"/g, // href="/path/"
];

const violations = [];

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const re of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        violations.push(`${file}:${i + 1}  ${m[1]}`);
      }
    }
  });
}

if (violations.length) {
  console.error(
    "[assert-no-trailing-slash-links] internal links must not end in '/' (they 404 under build.format 'file'):"
  );
  for (const v of violations) console.error(`  - ${v}`);
  console.error(
    `\nFix: drop the trailing slash (e.g. /blog/foo/ -> /blog/foo). ${violations.length} found.`
  );
  process.exit(1);
}

console.log(`[assert-no-trailing-slash-links] ok (${files.length} posts scanned)`);
