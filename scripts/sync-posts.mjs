#!/usr/bin/env node
import { readdir, mkdir, copyFile, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const SOURCE = process.env.DOTBLOG_POST_SOURCE ?? join(homedir(), 'Documents/NOTES/LIFE/WRITING/dotblog');
const DEST = join(process.cwd(), 'src/content/blog');
const syncRequired = process.env.DOTBLOG_SYNC_REQUIRED === '1';

if (!existsSync(SOURCE)) {
  const existingPosts = existsSync(DEST)
    ? (await readdir(DEST)).filter((f) => /\.(md|mdx)$/.test(f)).length
    : 0;

  const message = `[sync-posts] source missing: ${SOURCE}`;
  if (syncRequired) {
    console.error(message);
    process.exit(1);
  }

  console.warn(`${message}; using ${existingPosts} existing posts in ${DEST}`);
  process.exit(0);
}

await mkdir(DEST, { recursive: true });

const allSourceFiles = (await readdir(SOURCE)).filter((f) => /\.(md|mdx)$/.test(f));

const sourceFiles = [];
for (const f of allSourceFiles) {
  const src = join(SOURCE, f);
  const content = await readFile(src, 'utf8');
  if (!content.startsWith('---\n')) {
    console.warn(`[sync-posts] skipping ${f}: missing frontmatter`);
    continue;
  }
  const frontmatterEnd = content.indexOf('\n---', 4);
  const frontmatter = frontmatterEnd === -1 ? '' : content.slice(4, frontmatterEnd);
  if (/^draft:\s*true\s*$/m.test(frontmatter)) {
    console.warn(`[sync-posts] skipping ${f}: draft`);
    continue;
  }
  sourceFiles.push(f);
}

let copied = 0;
for (const f of sourceFiles) {
  const src = join(SOURCE, f);
  const dst = join(DEST, f);
  const srcStat = await stat(src);
  const dstStat = existsSync(dst) ? await stat(dst) : null;
  if (!dstStat || srcStat.mtimeMs > dstStat.mtimeMs) {
    await copyFile(src, dst);
    copied++;
  }
}

console.log(`[sync-posts] ${sourceFiles.length} posts (${copied} updated) ← ${SOURCE}`);
