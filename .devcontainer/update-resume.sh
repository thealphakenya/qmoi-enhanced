#!/bin/bash
set -euo pipefail

# update-resume.sh
# Appends a timestamped message to the repo resumefromhere.txt tracker.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_FILE="$REPO_ROOT/resumefromhere.txt"

MSG="$*"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "$(dirname "$OUT_FILE")"
if [ -x "$REPO_ROOT/scripts/autoupdate_resume.py" ]; then
  python3 "$REPO_ROOT/scripts/autoupdate_resume.py" || true
fi
echo "$TS - $MSG" >> "$OUT_FILE"

exit 0
