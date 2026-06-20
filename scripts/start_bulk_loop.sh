#!/usr/bin/env bash
# Start the auto-continue loop in background (until clean)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_DIR="$ROOT_DIR/var/daemon"
LOG_FILE="$PID_DIR/bulk_loop.log"
PID_FILE="$PID_DIR/bulk_loop.pid"

mkdir -p "$PID_DIR"

if [ -f "$PID_FILE" ]; then
  if kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1; then
    echo "Bulk loop already running (pid=$(cat "$PID_FILE"))." >&2
    exit 0
  else
    echo "Stale PID file found; removing." >&2
    rm -f "$PID_FILE"
  fi
fi

nohup python3 "$ROOT_DIR/scripts/auto_continue_resumefromhere_loop.py" --until-clean --interval 60 > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
echo "Started bulk loop (pid=$(cat "$PID_FILE")); logs: $LOG_FILE"
