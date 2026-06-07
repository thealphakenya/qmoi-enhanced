#!/usr/bin/env bash
# Auto-triage script: runs tsc and eslint (when Node/npm available) and writes top error files
set -euo pipefail
OUT_DIR="/tmp/qmoi_triage"
mkdir -p "$OUT_DIR"
LOG="$OUT_DIR/triage.log"
TS_TOP="$OUT_DIR/ts_top50.txt"

echo "Auto-triage run: $(date -u)" > "$LOG"

if command -v node >/dev/null 2>&1; then
  echo "Node found: $(node -v)" >> "$LOG"
else
  echo "Node not found in PATH. Please install Node.js and npm to run full triage." >> "$LOG"
  echo "FAILED: node missing" >> "$LOG"
  exit 0
fi

# prefer local tsc if present
if [ -x "./node_modules/.bin/tsc" ]; then
  TSC="./node_modules/.bin/tsc"
else
  if command -v npx >/dev/null 2>&1; then
    TSC="npx tsc"
  else
    echo "npx not found; please install dependencies with npm ci or yarn." >> "$LOG"
    exit 1
  fi
fi

# run type-check and capture errors
echo "Running TypeScript check..." >> "$LOG"
$TSC -p tsconfig.json --noEmit --pretty false 2>&1 | awk -F'(' '{print $1}' | sed 's/^[[:space:]]*//' | sort | uniq -c | sort -nr | head -50 > "$TS_TOP" || true

echo "Top TypeScript error files (saved to $TS_TOP):" >> "$LOG"
cat "$TS_TOP" >> "$LOG" || true

# Run ESLint if available
if command -v npx >/dev/null 2>&1; then
  echo "Running ESLint for app and src..." >> "$LOG"
  npx eslint -c .eslintrc.cjs "app/**/*.{js,ts,tsx,jsx}" "src/**/*.{js,ts,tsx,jsx}" --format json -o "$OUT_DIR/eslint_results.json" || true
  echo "ESLint results saved to $OUT_DIR/eslint_results.json" >> "$LOG"
else
  echo "npx not found; skipping ESLint run." >> "$LOG"
fi

echo "Triage complete: $(date -u)" >> "$LOG"

echo "Log written to $LOG"
