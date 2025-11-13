#!/usr/bin/env bash
# Dispatch packaging workflows for the given ref using a PAT with workflow scope.
# Usage: ./tools/dispatch_packaging.sh <ref>

set -euo pipefail

REF="${1:-auto/release-inventory-20251113160839}"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN must be set in environment to dispatch workflows via API"
  exit 1
fi

dispatch() {
  local wf="$1"
  echo "Dispatching $wf -> ref=$REF"
  res=$(curl -s -o /tmp/dispatch_resp -w "%{http_code}" -X POST -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/thealphakenya/qmoi-enhanced/actions/workflows/$wf/dispatches" \
    -d "{\"ref\": \"$REF\"}")
  echo "HTTP status: $res"
  cat /tmp/dispatch_resp || true
}

dispatch package-electron.yml
dispatch package-mobile.yml

echo "Dispatch requests sent. If you see HTTP 204, the dispatch was accepted. Verify runs in Actions UI or via API."
