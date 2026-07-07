#!/bin/bash
set -euo pipefail

LOCK_FILE="/tmp/run-bulk-once.lock"
if [ -f "$LOCK_FILE" ] && kill -0 "$(cat "$LOCK_FILE")" 2>/dev/null; then
  echo "Bulk automation already running"
  exit 0
fi

echo "$$" > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

echo "→ Running automated bulk pass (best-effort)"

if command -v python3 >/dev/null 2>&1 && [ -f "scripts/consolidate_api_endpoints.py" ]; then
  echo "-> Regenerating API docs"
  # record start
  bash "$(dirname "$0")/update-resume.sh" "Bulk pass started: regenerating API docs" || true
  python3 scripts/consolidate_api_endpoints.py || true
fi

if [ -f "scripts/merge_executor.py" ]; then
  echo "-> Running merge_executor.py"
  python3 scripts/merge_executor.py || true
fi

echo "→ Bulk pass complete (check resumefromhere.txt for details)."
# record completion
bash "$(dirname "$0")/update-resume.sh" "Bulk pass complete" || true
exit 0
