#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';

try {
  const dist = 'dist';
  if (!existsSync(dist)) throw new Error('dist does not exist. Run build first.');
  // Ensure GitHub Pages does not run Jekyll (which would ignore folders starting with an underscore like _astro)
  try { writeFileSync(`${dist}/.nojekyll`, ''); } catch {}
  console.log('Publishing to gh-pages...');
  // Clean up any stale worktree metadata first
  try { execSync('git worktree prune', { stdio: 'inherit' }); } catch {}
  if (existsSync('.gh-pages-tmp')) rmSync('.gh-pages-tmp', { recursive: true, force: true });
  // Ensure we have latest remote reference (won't fail if branch exists locally already)
  try { execSync('git fetch origin gh-pages', { stdio: 'inherit' }); } catch {}
  // Create local branch if missing
  try { execSync('git show-ref --verify --quiet refs/heads/gh-pages || git branch gh-pages origin/gh-pages || git branch --orphan gh-pages', { stdio: 'inherit' }); } catch {}
  // Add / force-add worktree
  execSync('git worktree add -f .gh-pages-tmp gh-pages', { stdio: 'inherit' });
  // Sync built files while keeping the worktree's .git metadata intact
  execSync('rsync -a --delete --exclude ".git" dist/ .gh-pages-tmp/', { stdio: 'inherit' });
  // Redundant safety: ensure .nojekyll exists in target
  try { execSync('touch .gh-pages-tmp/.nojekyll'); } catch {}
  execSync('cp public/CNAME .gh-pages-tmp/CNAME || true', { stdio: 'inherit' });
  execSync('cd .gh-pages-tmp && git add -A && (git diff --cached --quiet || git commit -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)" ) && git push origin gh-pages', { stdio: 'inherit' });
  try {
    execSync('git worktree remove .gh-pages-tmp --force', { stdio: 'inherit' });
  } catch(remErr){
    console.warn('[deploy] worktree remove failed, falling back to manual cleanup');
    execSync('rm -rf .gh-pages-tmp', { stdio: 'inherit' });
  }
  console.log('Done.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
