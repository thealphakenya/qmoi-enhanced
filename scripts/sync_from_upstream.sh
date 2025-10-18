#!/usr/bin/env bash
# Fetch all branches from the target upstream repo (thealphakenya/qmoi-enhanced)
# and create local tracking branches for any remote branches that are missing locally.
# Usage: source .env && ./scripts/sync_from_upstream.sh
set -euo pipefail

if [ -f .env ]; then
  source .env
fi

: ${GITHUB_TOKEN:?'GITHUB_TOKEN is not set. Create a .env from .env.example and set GITHUB_TOKEN'}
: ${GITHUB_USER:='thealphakenya'}
: ${GITHUB_REPO:='qmoi-enhanced'}
: ${GIT_PUSH_REMOTE:='upstream'}

TOKENED_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

# Add or update upstream remote
if git remote | grep -q "^${GIT_PUSH_REMOTE}$"; then
  git remote set-url ${GIT_PUSH_REMOTE} "${TOKENED_URL}"
else
  git remote add ${GIT_PUSH_REMOTE} "${TOKENED_URL}"
fi

# Fetch all remote branches from upstream
git fetch ${GIT_PUSH_REMOTE} --prune

# Create local tracking branches for any remote branches not present locally
for remote_ref in $(git for-each-ref --format='%(refname:short)' refs/remotes/${GIT_PUSH_REMOTE}/); do
  branch_name=${remote_ref#${GIT_PUSH_REMOTE}/}
  if ! git show-ref --verify --quiet refs/heads/${branch_name}; then
    echo "Creating local branch ${branch_name} tracking ${GIT_PUSH_REMOTE}/${branch_name}"
    git branch --track ${branch_name} ${GIT_PUSH_REMOTE}/${branch_name} || true
  fi
done

echo "Sync complete. Local branches now include branches from ${GIT_PUSH_REMOTE}."
