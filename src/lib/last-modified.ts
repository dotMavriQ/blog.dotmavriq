import { execFileSync } from "node:child_process";

/**
 * Date of the last commit touching `path`, as YYYY-MM-DD.
 *
 * Hand-typed "last updated" stamps drift — a CV that claims April in July reads
 * as a stale candidate (issue #85). Deriving from git means the stamp cannot lie.
 *
 * Requires full history: `actions/checkout` must set `fetch-depth: 0`, otherwise
 * the shallow clone has no commit touching this path and we fail the build rather
 * than print a wrong date.
 */
export function lastCommitDate(path: string): Date {
  let stamp = "";
  try {
    stamp = execFileSync("git", ["log", "-1", "--format=%cs", "--", path], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    stamp = "";
  }

  if (!stamp) {
    if (import.meta.env.PROD) {
      throw new Error(
        `[last-modified] no commit found for ${path}. ` +
          `A shallow clone cannot date it — set \`fetch-depth: 0\` on actions/checkout.`,
      );
    }
    // Dev servers run against dirty trees and shallow clones alike; today is fine.
    return new Date();
  }

  const parsed = new Date(`${stamp}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`[last-modified] git returned an unparseable date "${stamp}" for ${path}`);
  }
  return parsed;
}

/** "Jun 2026" */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
