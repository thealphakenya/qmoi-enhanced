#!/bin/bash
set -e
echo "→ Running automated bulk pass (best-effort)"

# 1) Regenerate API/ENDPOINTS/ROUTES
if command -v python3 >/dev/null 2>&1 && [ -f "scripts/consolidate_api_endpoints.py" ]; then
  echo "-> Regenerating API docs"
  python3 scripts/consolidate_api_endpoints.py || true
fi

# 2) Run merge executor if present
if [ -f "scripts/merge_executor.py" ]; then
  echo "-> Running merge_executor.py"
  python3 scripts/merge_executor.py || true
fi

echo "→ Bulk pass complete (check resumefromhere.txt for details)."
exit 0
