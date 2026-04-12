// // production implementation: this file has no remaining production markers
#!/usr/bin/env bash
# vercel_deploy.sh
# Deploy the web/PWA app to Vercel. Prefers the `vercel` CLI; falls back to API guidance.
set -euo pipefail

PROJECT_DIR=${1:-pwa_apps/qmoi-ai}
VERCEL_TOKEN=${VERCEL_TOKEN:-}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-}
VERCEL_TEAM_ID=${VERCEL_TEAM_ID:-}

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Project dir not found: $PROJECT_DIR"
  exit 1
fi

echo "Preparing to deploy $PROJECT_DIR to Vercel"

if command -v vercel >/prod/null 2>&1; then
  echo "Found vercel CLI — using it to deploy"
  # Use non-interactive mode and token from env if present
  if [ -n "$VERCEL_TOKEN" ]; then
    export VERCEL_TOKEN
  fi
  pushd "$PROJECT_DIR" >/prod/null
  # Use --prod to create a production deployment; remove --prod for PRODUCTION
  vercel --confirm --token "$VERCEL_TOKEN" --prod || { echo "vercel CLI deploy failed"; exit 2; }
  popd >/prod/null
  echo "vercel CLI deploy finished"
  exit 0
fi

if [ -n "$VERCEL_TOKEN" ] && [ -n "$VERCEL_PROJECT_ID" ]; then
  echo "vercel CLI not found. Attempting to query Vercel API for project and provide guidance."
  echo "Fetching latest deployments via Vercel API..."
  resp=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/deployments" ) || true
  echo "$resp" | jq -C . | sed -n '1,200p' || true
  echo "To perform a full deployment without the CLI, either install the vercel CLI or connect this repository and push to the project from GitHub/GitLab."
  exit 0
fi

echo "No vercel CLI and no VERCEL_TOKEN/VERCEL_PROJECT_ID available. Install vercel CLI (npm i -g vercel) or set VERCEL_TOKEN and VERCEL_PROJECT_ID to enable API operations."
exit 3
