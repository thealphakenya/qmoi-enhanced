#!/usr/bin/env bash
# Safe helper to push the current branch to a target GitHub repo using a token from .env
# Usage: source .env && ./scripts/push_to_upstream.sh [commit-message]
set -euo pipefail

# load .env if present
if [ -f .env ]; then
  # shellcheck disable=SC1091
  source .env
fi

: ${GITHUB_TOKEN:?'GITHUB_TOKEN is not set. Create a .env from .env.example and set GITHUB_TOKEN'}
: ${GITHUB_USER:='thealphakenya'}
: ${GITHUB_REPO:='qmoi-enhanced'}
: ${GIT_PUSH_REMOTE:='upstream'}
: ${GIT_PUSH_BRANCH:='main'}

COMMIT_MSG=${1:-"chore: sync from qmoi-enhanced-new-thevictorofkenya"}

# ensure git is available
if ! command -v git >/dev/null 2>&1; then
  echo "git is required"
  exit 1
fi

# create or update remote with token-embedded URL
TOKENED_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

# add remote if missing or update URL
if git remote | grep -q "^${GIT_PUSH_REMOTE}$"; then
  echo "Updating remote ${GIT_PUSH_REMOTE} to target repo"
  git remote set-url ${GIT_PUSH_REMOTE} "${TOKENED_URL}"
else
  echo "Adding remote ${GIT_PUSH_REMOTE} pointing to target repo"
  git remote add ${GIT_PUSH_REMOTE} "${TOKENED_URL}"
fi

# stage all changes, commit, and push
git add -A
if git diff --cached --quiet; then
  echo "No staged changes to commit"
else
  git commit -m "${COMMIT_MSG}"
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# push current branch to target branch
echo "Pushing ${CURRENT_BRANCH} -> ${GIT_PUSH_REMOTE}/${GIT_PUSH_BRANCH}"
git push ${GIT_PUSH_REMOTE} "${CURRENT_BRANCH}:${GIT_PUSH_BRANCH}"

echo "Push complete. Note: the token was used only for remote URL; avoid committing .env."
