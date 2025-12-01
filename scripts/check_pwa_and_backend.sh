# Simple PWA and backend checker
#!/usr/bin/env bash
set -euo pipefail

APP=${1:-qmoi-ai}
PORT=${2:-3000}
PWA_URL="http://127.0.0.1:${PORT}/pwa_apps/${APP}/"
BACKEND_URL="http://127.0.0.1:8000"

echo "[PWA] Checking ${APP} at ${PWA_URL}"
if curl -sSf -I "${PWA_URL}" >/dev/null 2>&1; then
  echo "[PWA] reachable"
else
  echo "[PWA] not reachable at ${PWA_URL}" >&2
  exit 1
fi

echo "[PWA] manifest:"
curl -sS "${PWA_URL}manifest.webmanifest" || echo "manifest unavailable"

echo "[PWA] service worker:"
curl -sS "${PWA_URL}sw.js" || echo "service worker unavailable"

echo "[Backend] API docs:"
curl -sS -I "${BACKEND_URL}/api/docs" | head -n 1 || true

echo "[Backend] qcity status:"
curl -sS "${BACKEND_URL}/api/qcity/status" || echo "qcity/status not available"

echo "All checks completed"
exit 0
#!/usr/bin/env bash
set -euo pipefail
APP=${1:-qmoi-ai}
PORT=${2:-3000}
PWA_URL="http://127.0.0.1:${PORT}/pwa_apps/${APP}/"
BACKEND_URL="http://127.0.0.1:8000"

echo "Checking PWA: ${APP} at ${PWA_URL}"
if curl -sSf -I "${PWA_URL}" >/dev/null 2>&1; then
  echo "PWA is reachable"
else
  echo "PWA not reachable at ${PWA_URL}" >&2
  exit 1
fi

echo "Checking manifest..."
curl -sS "${PWA_URL}manifest.webmanifest" || echo "manifest unavailable"
echo "Checking service worker..."
curl -sS "${PWA_URL}sw.js" || echo "service worker unavailable"
echo "Checking backend doc and qcity endpoints..."
curl -sS -I "${BACKEND_URL}/api/docs" | head -n 1 || true
curl -sS "${BACKEND_URL}/api/qcity/status" || echo "qcity/status not available"

echo "All checks completed"
exit 0
#!/usr/bin/env bash#!/usr/bin/env bash



























exit 0echo "All checks completed"curl -sS "${BACKEND_URL}/api/qcity/status" || echo "qcity/status not available"curl -sS -I "${BACKEND_URL}/api/docs" | head -n 1 || trueecho "Checking backend doc and qcity endpoints..."curl -sS "${PWA_URL}sw.js" || echo "service worker unavailable"echo "Checking service worker..."curl -sS "${PWA_URL}manifest.webmanifest" || echo "manifest unavailable"echo "Checking manifest..."fi  exit 1  echo "PWA not reachable at ${PWA_URL}" >&2else  echo "PWA is reachable"if curl -sSf -I "${PWA_URL}" >/dev/null 2>&1; thenecho "Checking PWA: ${APP} at ${PWA_URL}"BACKEND_URL="http://127.0.0.1:8000"PWA_URL="http://127.0.0.1:${PORT}/pwa_apps/${APP}/"PORT=${2:-3000}APP=${1:-qmoi-ai}set -euo pipefailset -euo pipefail
APP=${1:-qmoi-ai}
PORT=${2:-3000}
PWA_URL="http://127.0.0.1:${PORT}/pwa_apps/${APP}/"
BACKEND_URL="http://127.0.0.1:8000"

echo "Checking PWA: ${APP} at ${PWA_URL}"
if curl -sSf -I "${PWA_URL}" >/dev/null 2>&1; then
  echo "PWA is reachable"
else
  echo "PWA not reachable at ${PWA_URL}" >&2
  exit 1
fi

echo "Checking manifest..."
curl -sS "${PWA_URL}manifest.webmanifest" || echo "manifest unavailable"

echo "Checking service worker..."
curl -sS "${PWA_URL}sw.js" || echo "service worker unavailable"

echo "Checking backend doc and qcity endpoints..."
curl -sS -I "${BACKEND_URL}/api/docs" | head -n 1 || true
curl -sS "${BACKEND_URL}/api/qcity/status" || echo "qcity/status not available"

echo "All checks completed"
exit 0
