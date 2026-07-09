#!/bin/bash
set -euo pipefail

PID_FILE="/tmp/auto-continue-daemon.pid"
LOG_FILE="/tmp/auto-continue.log"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Auto-continue daemon already running"
  exit 0
fi

echo "🚀 Starting Ollama Auto-Continue Daemon..."
chmod +x "$(dirname "$0")/auto-continue-daemon.sh"
nohup bash "$(dirname "$0")/auto-continue-daemon.sh" > "$LOG_FILE" 2>&1 &
DAEMON_PID=$!
echo "$DAEMON_PID" > "$PID_FILE"
echo "✅ Auto-Continue Daemon started (PID: $DAEMON_PID)"
# update resume tracker (best-effort)
if [ -x "$(dirname "$0")/update-resume.sh" ]; then
  bash "$(dirname "$0")/update-resume.sh" "Auto-Continue Daemon started (PID: $DAEMON_PID)" || true
fi
exit 0
