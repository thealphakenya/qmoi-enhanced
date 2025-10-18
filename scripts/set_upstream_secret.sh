#!/usr/bin/env bash
# Helper to set the UPSTREAM_PAT Actions secret using the GitHub CLI (gh)
# Usage: ./scripts/set_upstream_secret.sh <owner> <repo> <secret_name> <path-to-token-file>
# Example: ./scripts/set_upstream_secret.sh thevictorofkenya qmoi-enhanced-new-thevictorofkenya UPSTREAM_PAT ~/token.txt

set -euo pipefail

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <owner> <repo> <secret_name> <path-to-token-file>"
  exit 1
fi

OWNER=$1
REPO=$2
SECRET_NAME=$3
TOKEN_FILE=$4

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install it from https://github.com/cli/cli"
  exit 1
fi

if [ ! -f "$TOKEN_FILE" ]; then
  echo "Token file not found: $TOKEN_FILE"
  exit 1
fi

TOKEN=$(cat "$TOKEN_FILE")

echo "Setting secret $SECRET_NAME in $OWNER/$REPO"

gh secret set "$SECRET_NAME" -R "$OWNER/$REPO" --body "$TOKEN"

echo "Secret set"
