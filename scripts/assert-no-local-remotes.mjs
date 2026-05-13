#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { isAbsolute } from "node:path";

const result = spawnSync("git", ["remote", "-v"], { encoding: "utf8" });
if (result.status !== 0) {
  console.error(result.stderr || result.error?.message || "[assert-no-local-remotes] git remote failed");
  process.exit(result.status ?? 1);
}

const output = result.stdout.trim();
const badRemotes = [];

for (const line of output.split("\n").filter(Boolean)) {
  const [, url, direction] = line.match(/^\S+\s+(\S+)\s+\((fetch|push)\)$/) ?? [];
  if (!url) continue;

  const isLocal =
    url.startsWith("file://") ||
    isAbsolute(url) ||
    url.startsWith("./") ||
    url.startsWith("../");

  if (isLocal) badRemotes.push(`${url} (${direction})`);
}

if (badRemotes.length) {
  console.error("[assert-no-local-remotes] local filesystem remotes are not allowed:");
  for (const remote of badRemotes) console.error(`  - ${remote}`);
  process.exit(1);
}

console.log("[assert-no-local-remotes] ok");
