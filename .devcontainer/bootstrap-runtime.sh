#!/bin/bash
set -euo pipefail

LOG_DIR="/tmp/qmoi-bootstrap"
mkdir -p "$LOG_DIR"
LOCK_FILE="$LOG_DIR/bootstrap.lock"

if [ -f "$LOCK_FILE" ] && kill -0 "$(cat "$LOCK_FILE")" 2>/dev/null; then
  echo "bootstrap already running"
  exit 0
fi

echo "$$" > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

echo "Launching background bootstrap tasks..."
nohup bash "$PWD/.devcontainer/ensure-ollama.sh" > "$LOG_DIR/ensure-ollama.log" 2>&1 < /dev/null &
nohup bash "$PWD/.devcontainer/start-auto-continue.sh" > "$LOG_DIR/start-auto-continue.log" 2>&1 < /dev/null &
nohup bash "$PWD/.devcontainer/open-continue.sh" > "$LOG_DIR/open-continue.log" 2>&1 < /dev/null &
nohup sh -c 'sleep 15; bash "$PWD/.devcontainer/run-bulk-once.sh"' > "$LOG_DIR/run-bulk-once.log" 2>&1 < /dev/null &

echo "Bootstrap tasks launched in background. Logs: $LOG_DIR"
exit 0
