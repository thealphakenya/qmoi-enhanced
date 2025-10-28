#!/usr/bin/env bash
set -eu
# Minimal agent runner: starts memory service and progress tracker and keeps them running.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

start_one() {
  name="$1"
  cmd="$2"
  logfile="$LOG_DIR/$name.log"
  if pgrep -f "$cmd" >/dev/null 2>&1; then
    echo "$name already running"
    return
  fi
  nohup bash -lc "$cmd" > "$logfile" 2>&1 &
  echo "$name started, log: $logfile"
}

echo "Starting QMOI agent components..."
PY="$(which python3 || which python)"
start_one qmoi-memory "$PY $ROOT/scripts/qmoi_memory_service.py"
start_one qmoi-progress "$PY $ROOT/scripts/qmoi_progress_tracker.py"
echo "All components started. Check logs in $LOG_DIR"

echo "To stop services: pkill -f qmoi_memory_service.py || true; pkill -f qmoi_progress_tracker.py || true"
