#!/usr/bin/env bash
set -euo pipefail

# Auto-sync script for safe pushes and pulls.
# Features:
# - fetches remote and checks for updates
# - stashes local uncommitted changes (and re-applies them)
# - tries to rebase onto remote (or merge if rebase fails)
# - runs project formatters/linters/tests and auto-commits fixes
# - pushes safely with force-with-lease when necessary
# - configurable via env vars: TARGET_BRANCH, GITHUB_TOKEN, AUTO_COMMIT

TARGET_BRANCH=${TARGET_BRANCH:-main}
REMOTE=${REMOTE:-origin}
AUTO_COMMIT=${AUTO_COMMIT:-true}
GITHUB_TOKEN=${GITHUB_TOKEN:-}

echo "==> Auto-sync starting (branch: $(git rev-parse --abbrev-ref HEAD))"

# Ensure we're in a git repo
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not a git repository" >&2
  exit 1
fi

# 1) Fetch remote
echo "Fetching $REMOTE/$TARGET_BRANCH..."
git fetch "$REMOTE" "$TARGET_BRANCH"

# 2) Check if remote has new commits
LOCAL=$(git rev-parse @)
REMOTE_REF=$(git rev-parse "$REMOTE/$TARGET_BRANCH")
BASE=$(git merge-base @ "$REMOTE/$TARGET_BRANCH")

if [ "$LOCAL" = "$REMOTE_REF" ]; then
  echo "Already up-to-date with $REMOTE/$TARGET_BRANCH"
else
  if [ "$LOCAL" = "$BASE" ]; then
    echo "Local behind remote. We will rebase onto $REMOTE/$TARGET_BRANCH"
    git stash push -u -m "auto_sync-$(date +%s)" || true
    set +e
    git rebase "$REMOTE/$TARGET_BRANCH"
    REBASE_EXIT=$?
    set -e
    if [ $REBASE_EXIT -ne 0 ]; then
      echo "Rebase failed, attempting merge fallback"
      git rebase --abort || true
      git merge --no-edit -X theirs "$REMOTE/$TARGET_BRANCH" || {
        echo "Merge failed — please resolve conflicts manually" >&2
        git stash pop || true
        exit 1
      }
    fi
    git stash pop || true
  elif [ "$REMOTE_REF" = "$BASE" ]; then
    echo "Local ahead of remote — will push"
  else
    echo "Local and remote have diverged. Creating backup branch and attempting merge."
    BACKUP_BRANCH="backup/auto-sync-$(date +%s)"
    git branch "$BACKUP_BRANCH"
    git checkout -q "$BACKUP_BRANCH"
    git merge --no-edit "$REMOTE/$TARGET_BRANCH" || {
      echo "Automatic merge into backup failed; please inspect $BACKUP_BRANCH" >&2
      git checkout -
      exit 1
    }
    git checkout -
  fi
fi

# 3) Run formatters/linters and tests (best-effort)
echo "Running formatters, linters, and tests (best-effort)"
if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  npm ci --silent || true
  npm run format --silent || true
  npm run lint --silent || true
fi

if command -v black >/dev/null 2>&1 && ls *.py >/dev/null 2>&1; then
  black . || true
fi

if command -v pytest >/dev/null 2>&1; then
  pytest -q || {
    echo "Tests failed — aborting auto-sync" >&2
    exit 1
  }
fi

# 4) Auto-commit formatting/lint fixes if any
if [ "$AUTO_COMMIT" = "true" ]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Committing auto-fix changes"
    git add -A
    git commit -m "chore(auto-sync): apply auto-fixes/formatting" || true
  else
    echo "No auto-fix changes to commit"
  fi
fi

# 5) Push changes safely
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Pushing branch $BRANCH to $REMOTE"
git push "$REMOTE" "$BRANCH" --force-with-lease

echo "Auto-sync completed successfully"
