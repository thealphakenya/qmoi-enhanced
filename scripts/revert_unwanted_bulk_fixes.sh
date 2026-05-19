#!/usr/bin/env bash
set -euo pipefail

# Revert automated 'bulk' replacements by restoring sed .bak files
# Targets: .venv, node_modules, mobile/node_modules, .backups

DRY_RUN=0
if [[ ${1-} == "--dry-run" ]]; then
  DRY_RUN=1
fi

WORKDIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Working in $WORKDIR"

TARGET_DIRS=("$WORKDIR/.venv" "$WORKDIR/node_modules" "$WORKDIR/mobile/node_modules" "$WORKDIR/.backups")
REPORT="$WORKDIR/reports/revert_report.txt"
mkdir -p "$(dirname "$REPORT")"
echo "Revert run at $(date -u +'%Y-%m-%dT%H:%M:%SZ')" > "$REPORT"

for d in "${TARGET_DIRS[@]}"; do
  if [[ -d "$d" ]]; then
    echo "Scanning $d for .bak files..." | tee -a "$REPORT"
    if [[ $DRY_RUN -eq 1 ]]; then
      find "$d" -type f -name '*.bak' -print | tee -a "$REPORT" || true
    else
      find "$d" -type f -name '*.bak' -print0 | while IFS= read -r -d '' bak; do
        orig="${bak%.bak}"
        echo "Restoring $orig from $bak" | tee -a "$REPORT"
        mv -f "$bak" "$orig" || echo "WARN: failed to mv $bak" | tee -a "$REPORT"
      done
    fi
  else
    echo "Skip missing $d" | tee -a "$REPORT"
  fi
done

echo "Revert complete. Report: $REPORT"
echo "(Use --dry-run to preview)"
