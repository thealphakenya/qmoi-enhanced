#!/usr/bin/env bash
# Simple healthcheck script for local QMOI services. Returns non-zero on failure.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/.qmoi/healthcheck.json"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
check() {
  url="$1"
  name="$2"
  if curl -sS --max-time 3 "$url" >/dev/null 2>&1; then
    echo "{\"name\": \"$name\", \"url\": \"$url\", \"ok\": true}" >> "$OUT.tmp"
  else
    echo "{\"name\": \"$name\", \"url\": \"$url\", \"ok\": false}" >> "$OUT.tmp"
  fi
}

rm -f "$OUT.tmp"
echo "{\"checked_at\": \"$NOW\", \"results\": [" > "$OUT.tmp"
first=true
for pair in "http://localhost:8765/health|adapter" "http://localhost:8770/health|gateway" "http://localhost:8775/health|memory" "http://127.0.0.1:8780/|admin"; do
  url=${pair%%|*}
  name=${pair##*|}
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$OUT.tmp"
  fi
  # append result
  if curl -sS --max-time 3 "$url" >/dev/null 2>&1; then
    echo "{\"name\": \"$name\", \"url\": \"$url\", \"ok\": true}" >> "$OUT.tmp"
  else
    echo "{\"name\": \"$name\", \"url\": \"$url\", \"ok\": false}" >> "$OUT.tmp"
  fi
done
echo "] }" >> "$OUT.tmp"
mv "$OUT.tmp" "$OUT"
echo "Wrote $OUT"

# exit non-zero if any service is down
if grep -q '"ok": false' "$OUT"; then
  echo "One or more services are down" >&2
  exit 2
fi
echo "All checks passed"
exit 0
