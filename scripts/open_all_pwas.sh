#!/usr/bin/env bash
set -euo pipefail
PWAS=(admin deals q-alpha qmoi qmoi-ai qmoi-space)
PORT=${1:-3000}
for p in "${PWAS[@]}"; do
  echo "Opening $p at http://localhost:${PORT}/pwa_apps/$p/"
  ./open_pwa.sh "$p" "$PORT" || true
  sleep 0.5
done
exit 0
