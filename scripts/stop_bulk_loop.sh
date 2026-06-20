#!/usr/bin/env bash
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT_DIR/var/daemon/bulk_loop.pid"
LOG_FILE="$ROOT_DIR/var/daemon/bulk_loop.log"

if [ ! -f "$PID_FILE" ]; then
  echo "No bulk loop PID file found; nothing to stop." >&2
  exit 0
fi

PID=$(cat "$PID_FILE")
if kill -0 "$PID" >/dev/null 2>&1; then
  kill "$PID"
  echo "Stopped bulk loop (pid=$PID). Logs: $LOG_FILE"
  rm -f "$PID_FILE"
  exit 0
else
  echo "Process $PID not running; removing stale PID file." >&2
  rm -f "$PID_FILE"
  exit 0
fi
