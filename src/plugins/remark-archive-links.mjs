/**
 * remark-archive-links
 *
 * Remark plugin that reads link-archive.json and:
 * - Dead links: rewrites href to Wayback URL, adds [archived] badge
 * - Live links with archive: adds subtle archive indicator on hover
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { visit } from "unist-util-visit";

const ARCHIVE_PATH = resolve("src/data/link-archive.json");

function loadArchive() {
  if (!existsSync(ARCHIVE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(ARCHIVE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

export default function remarkArchiveLinks() {
  const archive = loadArchive();

  return (tree) => {
    visit(tree, "link", (node, index, parent) => {
      const url = node.url;
      if (!url?.startsWith("http")) return;

      const entry = archive[url];
      if (!entry) return;

      if (!entry.alive && entry.archived) {
        // Dead link — rewrite to Wayback and add badge
        node.url = entry.archived;

        // Add [archived] badge after the link
        const badge = {
          type: "html",
          value: `<span class="link-archived" title="Original link is dead — this points to an archived copy"> [archived]</span>`,
        };

        if (parent && typeof index === "number") {
          parent.children.splice(index + 1, 0, badge);
        }
      } else if (entry.alive && entry.archived) {
        // Live link with archive — wrap with data attribute for CSS/JS
        // Add a tiny archive indicator
        const indicator = {
          type: "html",
          value: `<a href="${entry.archived}" class="link-archive-backup" title="Archived copy on Wayback Machine" aria-label="View archived copy">⧉</a>`,
        };

        if (parent && typeof index === "number") {
          parent.children.splice(index + 1, 0, indicator);
        }
      }
    });
  };
}
