#!/usr/bin/env bash
set -euo pipefail

# Lightweight auto-fix script used by GitHub Actions and locally.
# - runs formatters/linters if available
# - runs tests if present
# - attempts to rebase current branch onto target branch and resolve trivial conflicts using 'ours' for generated files
# - if rebase succeeds, pushes branch and optionally creates a merge commit via API using provided token

TARGET_BRANCH=${TARGET_BRANCH:-main}
GITHUB_TOKEN=${GITHUB_TOKEN:-}
AUTO_FIX_PATHS=${AUTO_FIX_PATHS:-"scripts qmoi-enhanced"}

echo "Auto-fix script starting. Target branch: $TARGET_BRANCH"

# 1) Formatting / Linting: run common tools if present
if command -v npm >/dev/null 2>&1 && [ -f package.json ]; then
  if command -v npm >/dev/null 2>&1; then
    echo "Running npm install (ci if available)..."
    if [ -f package-lock.json ]; then
      npm ci --silent || true
    else
      npm install --silent || true
    fi
    echo "Running npm run format and lint (scoped if AUTO_FIX_PATHS set)"
    if [ "${AUTO_FIX_PATHS}" != "." ]; then
      for p in ${AUTO_FIX_PATHS}; do
        npx prettier --write "$p" 2>/dev/null || true
        npx eslint --fix "$p" --ext .js,.jsx,.ts,.tsx 2>/dev/null || true
      done
    else
      npm run format --silent || true
      npm run lint --silent || true
    fi
  fi
fi

if command -v black >/dev/null 2>&1; then
  echo "Running black on specified paths: ${AUTO_FIX_PATHS}"
  for p in ${AUTO_FIX_PATHS}; do
    if [ -e "$p" ]; then
      black "$p" || true
    fi
  done
fi

# 2) Run tests if a test runner is available
RUN_TESTS=${RUN_TESTS:-false}
if [ "$RUN_TESTS" = "true" ] && command -v pytest >/dev/null 2>&1; then
  echo "Running pytest"
  pytest -q || (echo "Tests failed" && exit 1)
else
  echo "Skipping tests (RUN_TESTS=$RUN_TESTS)"
fi

# 3) Attempt rebase onto target branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

git fetch origin "$TARGET_BRANCH"
echo "Attempting rebase onto origin/$TARGET_BRANCH"
set +e
git rebase "origin/$TARGET_BRANCH"
REBASE_EXIT=$?
set -e

if [ $REBASE_EXIT -ne 0 ]; then
  echo "Rebase encountered conflicts. Attempting trivial conflict resolution for generated files."
  # Try to abort and perform a merge strategy that favors theirs for non-code files
  git rebase --abort || true
  # Create a temporary merge commit with ours/theirs strategy
  git fetch origin "$TARGET_BRANCH"
  git merge --no-edit -X theirs "origin/$TARGET_BRANCH" || {
    echo "Merge failed. Leaving branch for manual resolution.";
    exit 1;
  }
fi

echo "Rebase/merge succeeded. Pushing branch to remote."
# Push the branch back
git push origin "$CURRENT_BRANCH" --force-with-lease

# Optionally create a merge via API if token present and branch can be auto-merged
if [ -n "$GITHUB_TOKEN" ]; then
  echo "Attempting to create a merge (auto) via GitHub API if possible"
  REPO_FULL_NAME=$(git remote get-url origin | sed -E 's#https://[^/]+/##' | sed -E 's#(.git)$##')
  API_URL="https://api.github.com/repos/$REPO_FULL_NAME/pulls"
  # Create a PR
  PR_TITLE="Automated: rebase and autofix from $CURRENT_BRANCH"
  PR_BODY="This PR was created by automated autofix workflow."
  PR_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -X POST $API_URL -d "{\"title\":\"$PR_TITLE\",\"head\":\"$CURRENT_BRANCH\",\"base\":\"$TARGET_BRANCH\",\"body\":\"$PR_BODY\"}")
  PR_NUMBER=$(echo "$PR_RESPONSE" | jq -r .number 2>/dev/null || echo "")
  if [ -n "$PR_NUMBER" ]; then
    echo "PR created: #$PR_NUMBER. Attempting to merge"
    MERGE_URL="https://api.github.com/repos/$REPO_FULL_NAME/pulls/$PR_NUMBER/merge"
    curl -s -H "Authorization: token $GITHUB_TOKEN" -X PUT $MERGE_URL -d '{"merge_method":"rebase"}' >/dev/null
    echo "Merge attempted via API. Check PR: $PR_NUMBER"
  else
    echo "PR not created (maybe one exists). Response: $PR_RESPONSE"
  fi
fi

echo "Auto-fix script finished."
