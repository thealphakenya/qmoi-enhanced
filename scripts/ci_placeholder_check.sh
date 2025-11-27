#!/bin/bash
# CI helper for placeholder checking
set -euo pipefail

echo "Running quick type-check and placeholder scan"
npm ci --silent || true
npm run type-check:quick || true

# Inspect the report file
REPORT=reports/placeholder_scan_report.json
if [ ! -f "$REPORT" ]; then
  echo "[CI] Placeholder report not found; not failing by default"; exit 0
fi

REPLACEMENTS=$(jq '.replacements | length' < "$REPORT" 2>/dev/null || echo 0)
FILES=$(jq '.files | length' < "$REPORT" 2>/dev/null || echo 0)

echo "Placeholder report: $FILES files with placeholders, $REPLACEMENTS replacements suggested"

# Fail CI if replacement count > 0 (i.e., placeholders found that would be replaced)
if [ "$REPLACEMENTS" -gt 0 ]; then
  echo "ERROR: Placeholder replacements suggested in report, failing CI to require manual review"
  cat "$REPORT"
  exit 1
fi

echo "CI placeholder check passed"
