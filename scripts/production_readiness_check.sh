#!/usr/bin/env bash
set -euo pipefail

# production_readiness_check.sh
# Scans the repository for common non-production markers and outputs a report.

WORKDIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTDIR="$WORKDIR/reports"
mkdir -p "$OUTDIR"
OUT="$OUTDIR/production_readiness.txt"

PATTERNS=(
  "DEBUG"
  "DEBUG_MODE"
  "QMOI_DEBUG"
  "QMOI_DEBUG_MODE"
  "STAGING"
  "STAGE_"
  "production_IMPLEMENTED=false"
  "TODO: non-prod"
  "PLACEHOLDER"
  "XXX"
  "REPLACE_ME"
  "adPRODUCTIONentListener"
  "reques.t"
  "/debug/"
)

echo "Production readiness scan run at: $(date -u)" > "$OUT"
echo "Scanning files for common non-production markers..." >> "$OUT"

for p in "${PATTERNS[@]}"; do
  echo "\n--- PATTERN: $p ---" >> "$OUT"
  # Use find + xargs + grep to be portable
  find "$WORKDIR" -type f \( -path "*/.git/*" -o -path "*/node_modules/*" -o -path "*/.venv/*" -o -path "*/mobile/node_modules/*" \) -prune -o -type f -print0 \
    | xargs -0 grep -In --line-number --color=never -e "$p" || true >> "$OUT"
done

echo "\nSummary: count occurrences per pattern:" >> "$OUT"
for p in "${PATTERNS[@]}"; do
  cnt=$(grep -I --line-number -R --exclude-dir=.git --exclude-dir=node_modules -e "$p" "$WORKDIR" | wc -l || true)
  echo "$p: $cnt" >> "$OUT"
done

echo "Wrote $OUT"
echo "Report: $OUT"
