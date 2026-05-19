#!/usr/bin/env bash
# Serve the repository `public/` folder as a robust static production fallback.
# Usage: scripts/serve-static.sh [port]

set -euo pipefail

PORT=${1:-8000}
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public"

if [ ! -d "$ROOT_DIR" ]; then
  echo "ERROR: public/ directory not found at $ROOT_DIR" >&2
  exit 2
fi

echo "Serving static production fallback from: $ROOT_DIR on port $PORT"

# Try to find a running server on that port
if nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
  echo "Server already running on port $PORT"
else
  echo "Starting python3 -m http.server $PORT in background..."
  (cd "$ROOT_DIR" && python3 -m http.server "$PORT") &
  sleep 0.8
fi

URL="http://127.0.0.1:$PORT/pwa_apps/qmoi-ai/index.html"

echo "Static QMOI AI URL: $URL"

# Try to open in host browser using several methods. If none work, print the URL.
if [ -n "${BROWSER:-}" ]; then
  echo "Trying BROWSER: $BROWSER"
  "$BROWSER" "$URL" 2>/dev/null || true
fi

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
fi

if command -v python3 >/dev/null 2>&1; then
  python3 -c "import webbrowser; webbrowser.open_new('$URL')" >/dev/null 2>&1 || true
fi

echo "If the browser did not open, open this URL manually: $URL"

exit 0
