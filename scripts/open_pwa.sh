#!/usr/bin/env bash
set -euo pipefail
# Open a specified PWA from pwa_apps in the host browser. Defaults to 'qmoi-ai'.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP=${1:-qmoi-ai}
PORT=${2:-3000}
URL="http://localhost:${PORT}/pwa_apps/${APP}/"

echo "Opening PWA: ${APP} at ${URL}" 

if ! curl -sSf -I "${URL}" >/dev/null 2>&1; then
  echo "PWA ${APP} not available at ${URL}. Ensure dev server is running (serve_frontend or Node dev)." >&2
  exit 2
fi

# Use $BROWSER if defined, otherwise try xdg-open, open
if [ -n "${BROWSER:-}" ]; then
  "$BROWSER" "${URL}" || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${URL}" || true
elif command -v open >/dev/null 2>&1; then
  open "${URL}" || true
else
  echo "No known browser open command found. Please open ${URL} manually." >&2
fi

exit 0
