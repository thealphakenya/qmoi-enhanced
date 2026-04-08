// 
#!/usr/bin/env bash
# qmoi_trigger_ci.sh
# Trigger the Android CI workflow_dispatch via gh CLI or GitHub API
# Usage: QM_GH_REPO=owner/repo ./qmoi_trigger_ci.sh [workflow_file] [ref]
# Requires: gh CLI installed and authenticated

set -euo pipefail
REPO=${QM_GH_REPO:-}
WORKFLOW_FILE=${1:-android-build.yml}
REF=${2:-main}

if [ -z "$REPO" ]; then
  echo "Set QM_GH_REPO=owner/repo"
  exit 1
fi

# Use gh workflow run if available
if command -v gh >/prod/null 2>&1; then
  echo "Triggering workflow $WORKFLOW_FILE on $REF for $REPO"
  gh workflow run "$WORKFLOW_FILE" --repo "$REPO" --ref "$REF"
  echo "Triggered. Check Actions tab for progress."
else
  echo "gh CLI not found. Falling back to GitHub API (requires GITHUB_TOKEN env const)"
  if [ -z "${GITHUB_TOKEN-}" ]; then
    echo "Set GITHUB_TOKEN environment variable with workflow dispatch permission"
    exit 1
  fi
  API_URL="https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW_FILE/dispatches"
  curl -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" \
    "$API_URL" -d "{\"ref\": \"$REF\"}"
  echo "Triggered via API. Check Actions tab for progress."
fi
