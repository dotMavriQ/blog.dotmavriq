#!/usr/bin/env bash
set -euo pipefail

echo "== blog deployment (static export) =="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "refactor" ]; then
  echo "⚠️  You are on '$BRANCH'. Typically deploy from main/refactor." >&2
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node (nvm recommended)." >&2
  exit 1
fi

echo "Installing deps (ci if lock present)";
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi

echo "Building + exporting static site"
npm run build

OUT_DIR="out"
[ -d "$OUT_DIR" ] || { echo "Missing $OUT_DIR after build" >&2; exit 1; }

# Ensure CNAME retained
if [ -f CNAME ]; then
  cp CNAME "$OUT_DIR/" 2>/dev/null || true
fi

GH_BRANCH="gh-pages"
TMP_WORKTREE=".gh-pages-worktree"

echo "Preparing worktree for $GH_BRANCH"
if git show-ref --verify --quiet refs/heads/$GH_BRANCH; then
  :
elif git ls-remote --exit-code --heads origin $GH_BRANCH >/dev/null 2>&1; then
  git fetch origin $GH_BRANCH:$GH_BRANCH
else
  git branch $GH_BRANCH || true
fi

rm -rf "$TMP_WORKTREE"
git worktree add "$TMP_WORKTREE" "$GH_BRANCH"

echo "Syncing files to worktree"
rsync -a --delete "$OUT_DIR"/ "$TMP_WORKTREE"/

cd "$TMP_WORKTREE"
touch .nojekyll
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy.";
else
  git commit -m "Deploy $(date -u +'%Y-%m-%dT%H:%MZ') from $BRANCH"
  git push origin $GH_BRANCH
fi

cd "$ROOT_DIR"
git worktree remove "$TMP_WORKTREE" --force
echo "Deployment complete."