#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Scanning repository for exposed credential patterns..."

PATTERNS=(
  "ghp_[A-Za-z0-9_]\{20,\}"
  "vercel_[A-Za-z0-9_\-]\{10,\}"
  "ngrok"
)

FOUND=0

for p in "${PATTERNS[@]}"; do
  echo "Checking for pattern: $p"
  if grep -RIn --exclude-dir=.git --exclude-dir=node_modules -E "$p" . || true; then
    FOUND=$((FOUND+1))
  fi
done

if [ "$FOUND" -eq 0 ]; then
  echo "✅ No obvious credential patterns found in workspace"
  exit 0
else
  echo "❌ Found $FOUND suspicious matches. Inspect the output above and run manual remediation."
  exit 2
fi
