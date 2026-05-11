#!/usr/bin/env node
/**
 * archive-links.mjs
 *
 * Scans blog posts for external URLs, archives them on the Wayback Machine,
 * checks liveness, and stores results in src/data/link-archive.json.
 *
 * Usage:
 *   node scripts/archive-links.mjs            # full run (archive + check)
 *   node scripts/archive-links.mjs --check    # liveness check only (skip saving, exit non-zero on dead links)
 *   node scripts/archive-links.mjs --dry-run  # scan & report, change nothing
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

const BLOG_DIR = resolve("src/content/blog");
const ARCHIVE_PATH = resolve("src/data/link-archive.json");
const WAYBACK_AVAIL = "https://archive.org/wayback/available?url=";
const WAYBACK_SAVE = "https://web.archive.org/save/";

// Rate limiting — be polite to archive.org
const DELAY_MS = 3000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const CHECK_ONLY = args.includes("--check");

// ── Extract URLs from markdown files ──

function extractUrlFromParens(md, startIdx) {
  // Extract URL from after `](`, handling balanced parentheses
  let depth = 1;
  let i = startIdx;
  while (i < md.length && depth > 0) {
    if (md[i] === "(") depth++;
    else if (md[i] === ")") depth--;
    if (depth > 0) i++;
  }
  return md.slice(startIdx, i);
}

function extractUrls(md) {
  const urls = new Set();
  // Markdown links: [text](url) — handle balanced parens (e.g. Wikipedia)
  const linkPattern = /\[.*?\]\(/g;
  let match;
  while ((match = linkPattern.exec(md)) !== null) {
    const url = extractUrlFromParens(md, match.index + match[0].length);
    if (/^https?:\/\//.test(url)) {
      urls.add(url.replace(/[.,;:!?]+$/, ""));
    }
  }
  // Bare URLs / autolinks
  for (const m of md.matchAll(/(?:^|[\s<])(https?:\/\/[^\s>)]+)/gm)) {
    urls.add(m[1].replace(/[.,;:!?]+$/, ""));
  }
  return urls;
}

function scanBlogPosts() {
  const allUrls = new Set();
  const files = readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));

  for (const file of files) {
    const content = readFileSync(join(BLOG_DIR, file), "utf-8");
    for (const url of extractUrls(content)) {
      // Skip internal links
      if (url.includes("blog.dotmavriq.life")) continue;
      allUrls.add(url);
    }
  }

  return [...allUrls].sort();
}

// ── Wayback Machine API ──

async function checkWayback(url) {
  // Try the Availability API first
  try {
    const res = await fetch(`${WAYBACK_AVAIL}${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(10000),
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      const snap = data?.archived_snapshots?.closest;
      if (snap?.available && snap?.url) {
        return snap.url.replace(/^http:/, "https:");
      }
    } catch {
      // Invalid JSON — try CDX fallback
    }
  } catch {
    // API down or timeout
  }

  // Fallback: CDX API
  try {
    const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&limit=1&fl=timestamp,original&filter=statuscode:200`;
    const res = await fetch(cdxUrl, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      if (data.length > 1) {
        const [timestamp, original] = data[1];
        return `https://web.archive.org/web/${timestamp}/${original}`;
      }
    }
  } catch {
    // CDX also failed — will retry
  }

  return null;
}

async function saveToWayback(url) {
  try {
    // The Save API (SPN2) accepts POST with the URL in the body
    const res = await fetch("https://web.archive.org/save", {
      method: "POST",
      signal: AbortSignal.timeout(45000),
      headers: {
        "User-Agent": "blog.dotmavriq.life link archiver",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `url=${encodeURIComponent(url)}&capture_all=1`,
    });

    // Also try the simple GET endpoint as fallback
    if (!res.ok) {
      await fetch(`${WAYBACK_SAVE}${url}`, {
        method: "GET",
        signal: AbortSignal.timeout(30000),
        headers: { "User-Agent": "blog.dotmavriq.life link archiver" },
        redirect: "manual",
      });
    }

    // Wait for archive to propagate, then check
    await sleep(3000);
    return await checkWayback(url);
  } catch {
    // Save failed — will retry next run
  }
  return null;
}

async function checkLiveness(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
      headers: { "User-Agent": "blog.dotmavriq.life link checker" },
    });
    return res.ok;
  } catch {
    // Try GET as fallback — some servers reject HEAD
    try {
      const res = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
        redirect: "follow",
        headers: { "User-Agent": "blog.dotmavriq.life link checker" },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

// ── Main ──

async function main() {
  console.log("Scanning blog posts for external links...");
  const urls = scanBlogPosts();
  console.log(`Found ${urls.length} external URLs.\n`);

  // Load existing archive
  let archive = {};
  if (existsSync(ARCHIVE_PATH)) {
    archive = JSON.parse(readFileSync(ARCHIVE_PATH, "utf-8"));
  }

  const today = new Date().toISOString().split("T")[0];
  let saved = 0;
  let checked = 0;
  let dead = 0;
  let newlyArchived = 0;

  for (const url of urls) {
    const existing = archive[url] || {};
    const entry = { ...existing };

    process.stdout.write(`  ${url}\n`);

    // Check liveness
    const alive = await checkLiveness(url);
    entry.alive = alive;
    entry.lastChecked = today;
    checked++;

    if (!alive) {
      dead++;
      process.stdout.write(`    ⚠ DEAD\n`);
    } else {
      process.stdout.write(`    ✓ alive\n`);
    }

    // Archive if not yet archived (skip if --check only)
    if (!CHECK_ONLY && !entry.archived) {
      process.stdout.write(`    → checking Wayback...`);
      let waybackUrl = await checkWayback(url);

      if (waybackUrl) {
        process.stdout.write(` found!\n`);
      } else if (!DRY_RUN) {
        process.stdout.write(` not found, saving...`);
        waybackUrl = await saveToWayback(url);
        if (waybackUrl) {
          process.stdout.write(` done!\n`);
        } else {
          process.stdout.write(` failed (will retry next run)\n`);
        }
      } else {
        process.stdout.write(` would save (dry run)\n`);
      }

      if (waybackUrl) {
        entry.archived = waybackUrl;
        newlyArchived++;
      }
      saved++;
      await sleep(DELAY_MS);
    } else if (!CHECK_ONLY && entry.archived) {
      process.stdout.write(`    ✓ already archived\n`);
    }

    archive[url] = entry;
  }

  // Remove URLs no longer in any blog post
  const urlSet = new Set(urls);
  for (const key of Object.keys(archive)) {
    if (!urlSet.has(key)) {
      delete archive[key];
    }
  }

  if (!DRY_RUN && !CHECK_ONLY) {
    writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2) + "\n");
    console.log(`\nResults written to ${ARCHIVE_PATH}`);
  } else if (CHECK_ONLY) {
    console.log(`\nCheck-only mode: archive data not modified.`);
  }

  console.log(`\nDone!`);
  console.log(`  Checked: ${checked}`);
  console.log(`  Dead: ${dead}`);
  console.log(`  Newly archived: ${newlyArchived}`);
  console.log(`  Total archived: ${Object.values(archive).filter((e) => e.archived).length}/${urls.length}`);

  if (CHECK_ONLY && dead > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
