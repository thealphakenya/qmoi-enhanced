#!/usr/bin/env bash
set -euo pipefail
# Build for production and start the Next.js server in background
echo "Building (ci:build)..."
npm run ci:build

PORT=${PORT:-3000}
NODE_ENV=production PORT=$PORT npm start &
PID=$!
echo "Started Next.js (PID=$PID) on port $PORT"
# Optionally write pidfile
echo $PID > ./.qmoi_prod.pid
