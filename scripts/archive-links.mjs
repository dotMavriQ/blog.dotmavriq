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

// Browser-like headers cut down on anti-bot 403/429 responses from sites that
// reject obvious scrapers (Wikipedia, LinkedIn, Cloudflare-fronted hosts, …).
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

// Only these status codes mean the resource is genuinely gone. Any other
// response (401/403/405/429/451/5xx/999/…) means the server is reachable and is
// blocking or transiently erroring — NOT dead. No response at all
// (timeout/DNS) is inconclusive, also not dead.
const DEAD_CODES = new Set([404, 410]);

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

async function fetchStatus(url, method) {
  const res = await fetch(url, {
    method,
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
    headers: BROWSER_HEADERS,
  });
  return res.status;
}

// Classify a URL's liveness. Returns { state, code } where state is:
//   "alive"   — 2xx/3xx: resource is there
//   "dead"    — 404/410: genuinely gone (the only state that fails --check)
//   "blocked" — got a response, but it's an anti-bot/transient code (403/429/5xx/…)
//   "unknown" — no response at all (timeout/DNS); inconclusive
// HEAD is tried first (cheap); GET is the fallback because many servers reject
// HEAD or bot-block it differently than a full GET.
async function checkLiveness(url) {
  let lastCode = null;
  for (const method of ["HEAD", "GET"]) {
    let code;
    try {
      code = await fetchStatus(url, method);
    } catch {
      continue; // network error/timeout for this method — try the next
    }
    lastCode = code;
    if (code >= 200 && code < 400) return { state: "alive", code };
    if (DEAD_CODES.has(code)) return { state: "dead", code };
    // reachable but blocked/transient — fall through to try GET before concluding
  }
  if (lastCode !== null) return { state: "blocked", code: lastCode };
  return { state: "unknown", code: null };
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
  let blocked = 0;
  let unknown = 0;
  let newlyArchived = 0;
  const deadUrls = [];

  for (const url of urls) {
    const existing = archive[url] || {};
    const entry = { ...existing };

    process.stdout.write(`  ${url}\n`);

    // Check liveness
    const result = await checkLiveness(url);
    entry.alive = result.state === "alive";
    entry.linkStatus = result.state;
    if (result.code != null) entry.lastStatusCode = result.code;
    else delete entry.lastStatusCode;
    entry.lastChecked = today;
    checked++;

    if (result.state === "dead") {
      dead++;
      deadUrls.push({ url, code: result.code });
      process.stdout.write(`    ✗ DEAD (${result.code})\n`);
    } else if (result.state === "alive") {
      process.stdout.write(`    ✓ alive\n`);
    } else if (result.state === "blocked") {
      blocked++;
      process.stdout.write(`    ● ${result.code} — reachable but blocked/transient (not dead)\n`);
    } else {
      unknown++;
      process.stdout.write(`    ○ no response (timeout/DNS) — inconclusive (not dead)\n`);
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
  console.log(`  Dead (404/410): ${dead}`);
  console.log(`  Blocked/transient (not dead): ${blocked}`);
  console.log(`  Inconclusive — timeout/DNS (not dead): ${unknown}`);
  console.log(`  Newly archived: ${newlyArchived}`);
  console.log(`  Total archived: ${Object.values(archive).filter((e) => e.archived).length}/${urls.length}`);

  // Machine-readable dead-link list, fenced with stable markers so the weekly
  // workflow (archive-check.yml) can extract it into a GitHub issue body.
  if (deadUrls.length > 0) {
    console.log("\n<<<DEAD_LINKS_START>>>");
    for (const { url, code } of deadUrls) console.log(`- ${url} (HTTP ${code})`);
    console.log("<<<DEAD_LINKS_END>>>");
  }

  // Only genuine rot (404/410) fails the check. Bot-blocks and transient
  // errors are reported above but never break CI — that was the false-positive
  // source that made this signal untrustworthy.
  if (CHECK_ONLY && dead > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
