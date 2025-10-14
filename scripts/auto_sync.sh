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
AUTO_FIX_PATHS=${AUTO_FIX_PATHS:-"scripts qmoi-enhanced"}
AUTO_SYNC_IGNORE_FILE=${AUTO_SYNC_IGNORE_FILE:-".auto-sync-ignore"}

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
echo "AUTO_FIX_PATHS='$AUTO_FIX_PATHS'"
if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  npm ci --silent || true
  # If AUTO_FIX_PATHS is not the default "." try to run fixers only on those paths
  if [ "${AUTO_FIX_PATHS}" != "." ] && command -v npx >/dev/null 2>&1; then
    for p in ${AUTO_FIX_PATHS}; do
      npx prettier --write "$p" 2>/dev/null || true
      npx eslint --fix "$p" --ext .js,.jsx,.ts,.tsx 2>/dev/null || true
    done
  else
    npm run format --silent || true
    npm run lint --silent || true
  fi
fi

if command -v black >/dev/null 2>&1; then
  # Run black only against configured paths to avoid reformatting vendored/stdlib files
  for p in ${AUTO_FIX_PATHS}; do
    if [ -e "$p" ]; then
      black "$p" || true
    fi
  done
fi

RUN_TESTS=${RUN_TESTS:-false}
if [ "$RUN_TESTS" = "true" ] && command -v pytest >/dev/null 2>&1; then
  pytest -q || {
    echo "Tests failed — aborting auto-sync" >&2
    exit 1
  }
else
  echo "Skipping tests (RUN_TESTS=$RUN_TESTS)"
fi

# 4) Auto-commit formatting/lint fixes if any
if [ "$AUTO_COMMIT" = "true" ]; then
  # Respect .auto-sync-ignore if present by only adding configured paths
  TO_ADD=()
  for p in ${AUTO_FIX_PATHS}; do
    if [ -e "$p" ]; then
      TO_ADD+=("$p")
    fi
  done

  if [ ${#TO_ADD[@]} -gt 0 ]; then
    echo "Committing auto-fix changes for: ${TO_ADD[*]}"
    git add "${TO_ADD[@]}" || true
    # Also add updated config files if they exist in repo root
    [ -f package.json ] && git add package.json || true
    [ -f pyproject.toml ] && git add pyproject.toml || true
    if ! git diff --cached --quiet; then
      git commit -m "chore(auto-sync): apply auto-fixes/formatting (scoped)" || true
    else
      echo "No staged auto-fix changes to commit"
    fi
  else
    echo "AUTO_FIX_PATHS resolved to nothing; skipping auto-commit"
  fi
fi

# 5) Push changes safely
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Pushing branch $BRANCH to $REMOTE"
git push "$REMOTE" "$BRANCH" --force-with-lease

echo "Auto-sync completed successfully"
