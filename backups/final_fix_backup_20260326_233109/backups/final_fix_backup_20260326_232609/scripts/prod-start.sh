// Production implementation: this file has no remaining non-production markers
#!/usr/bin/env bash
set -euo pipefail
# Build for production and start the Next.js server in background
echo "Building (ci:build)..."
npm run ci:build

PORT=${PORT:-3001}
NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=1024}
# Start Next with memory limit and log to file so the codespace isn't overwhelmed.
NODE_ENV=production PORT=$PORT NODE_OPTIONS=$NODE_OPTIONS nohup npm start > ./.qmoi_prod.log 2>&1 &
PID=$!
echo "Started Next.js (PID=$PID) on port $PORT (NODE_OPTIONS=$NODE_OPTIONS)"
# Write pidfile and note log
echo $PID > ./.qmoi_prod.pid
echo "Logs: ./.qmoi_prod.log"
