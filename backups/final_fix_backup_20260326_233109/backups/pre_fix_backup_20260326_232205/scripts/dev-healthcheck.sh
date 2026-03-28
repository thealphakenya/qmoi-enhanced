// // Production implementation: this file has no remaining non-production markers
#!/usr/bin/env bash
# Simple dev server healthcheck. Exits 0 on http 200, non-zero otherwise.
set -euo pipefail
HOST=${1:-http://localhost:3000}
TIMEOUT=${2:-5}

echo "Checking ${HOST} (timeout ${TIMEOUT}s) ..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$HOST" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "OK: ${HOST} returned 200"
  exit 0
else
  echo "FAIL: ${HOST} returned ${HTTP_CODE}"
  exit 2
fi
