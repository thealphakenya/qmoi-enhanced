#!/usr/bin/env bash
# Start the always-on resume automation in the background using nohup.
# Writes PID to var/daemon/resume_daemon.pid and logs to var/daemon/resume_daemon.log

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_DIR="$ROOT_DIR/var/daemon"
LOG_FILE="$PID_DIR/resume_daemon.log"
PID_FILE="$PID_DIR/resume_daemon.pid"

mkdir -p "$PID_DIR"

if [ -f "$PID_FILE" ]; then
  if kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1; then
    echo "Resume daemon already running (pid=$(cat "$PID_FILE"))." >&2
    exit 0
  else
    echo "Stale PID file found; removing." >&2
    rm -f "$PID_FILE"
  fi
fi

nohup python3 "$ROOT_DIR/scripts/always_auto_resume.py" --until-clean > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
echo "Started resume daemon (pid=$(cat "$PID_FILE")); logs: $LOG_FILE"
