#!/usr/bin/env bash
# Small helper to run per-file TypeScript checks for pending files.
# Usage: ./scripts/verify_pending.sh
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

# Ensure node is on PATH
if ! command -v node >/dev/null 2>&1; then
  echo "node not found. Please install node (or run this script on a machine with node)."
  exit 2
fi

# Ensure tsc is available via npx
if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found. Install npm/npx or run 'npm install -g typescript'"
  exit 2
fi

# List of pending files (update if you add more)
PENDING=(
  "app/api/qmoi-gitlab/pipelines/route.ts"
  "app/api/qmoi-gitlab/jobs/route.ts"
  "app/api/qmoi-gitlab/deployments/route.ts"
)

for f in "${PENDING[@]}"; do
  echo "--- checking $f ---"
  npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts "$f"
  if [ $? -eq 0 ]; then
    echo "$f: OK"
  else
    echo "$f: TYPECHECK FAILED"
    exit 1
  fi
done

echo "All pending files passed type checks."