#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

try {
  const dist = 'dist';
  if (!existsSync(dist)) throw new Error('dist does not exist. Run build first.');
  console.log('Publishing to gh-pages...');
  execSync('git fetch origin gh-pages:gh-pages || git branch gh-pages', { stdio: 'inherit' });
  if (existsSync('.gh-pages-tmp')) rmSync('.gh-pages-tmp', { recursive: true, force: true });
  execSync('git worktree add .gh-pages-tmp gh-pages', { stdio: 'inherit' });
  execSync('rsync -a --delete dist/ .gh-pages-tmp/', { stdio: 'inherit' });
  execSync('cp public/CNAME .gh-pages-tmp/CNAME || true', { stdio: 'inherit' });
  execSync('cd .gh-pages-tmp && git add -A && (git diff --cached --quiet || git commit -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)" ) && git push origin gh-pages', { stdio: 'inherit' });
  execSync('git worktree remove .gh-pages-tmp --force', { stdio: 'inherit' });
  console.log('Done.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
