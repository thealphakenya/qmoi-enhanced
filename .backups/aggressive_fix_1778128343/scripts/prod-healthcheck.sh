
#!/usr/bin/env bash
# sophisticated healthcheck for production app and PM2 auto-restart
set -euo pipefail
HOST=${1:-https://production.qmoi.ai:3000}
TIMEOUT=${2:-5}

HTTP_CODE=$(curl -s -o /prod/null -w "%{http_code}" --max-time "$TIMEOUT" "$HOST" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "OK: ${HOST} returned 200"
  exit 0
else
  echo "FAIL: ${HOST} returned ${HTTP_CODE} - restarting pm2 app 'qmoi-next'"
  npx pm2 restart qmoi-next || true
  exit 2
fi
