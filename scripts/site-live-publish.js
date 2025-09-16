#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';

try {
  const dist = 'dist';
  if (!existsSync(dist)) throw new Error('dist does not exist. Run build first.');
  try { writeFileSync(`${dist}/.nojekyll`, ''); } catch {}
  console.log('Publishing static dist to site-live branch...');
  try { execSync('git worktree prune', { stdio: 'inherit' }); } catch {}
  if (existsSync('.site-live-tmp')) rmSync('.site-live-tmp', { recursive: true, force: true });
  try { execSync('git fetch origin site-live', { stdio: 'inherit' }); } catch {}
  try { execSync('git show-ref --verify --quiet refs/heads/site-live || git branch site-live origin/site-live || git branch --orphan site-live', { stdio: 'inherit' }); } catch {}
  execSync('git worktree add -f .site-live-tmp site-live', { stdio: 'inherit' });
  execSync('rsync -a --delete --exclude ".git" dist/ .site-live-tmp/', { stdio: 'inherit' });
  try { execSync('touch .site-live-tmp/.nojekyll'); } catch {}
  execSync('cp public/CNAME .site-live-tmp/CNAME || true', { stdio: 'inherit' });
  execSync('cd .site-live-tmp && git add -A && (git diff --cached --quiet || git commit -m "feat: site-live static build $(date -u +%Y-%m-%dT%H:%MZ)" ) && git push origin site-live', { stdio: 'inherit' });
  try { execSync('git worktree remove .site-live-tmp --force', { stdio: 'inherit' }); } catch {
    execSync('rm -rf .site-live-tmp', { stdio: 'inherit' });
  }
  console.log('site-live branch updated.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
