#!/usr/bin/env bash
set -eu
# Start the QMOI adapter in background (nohup) and write pid file.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PY="$ROOT/services/qmoi_adapter/app.py"
mkdir -p "$ROOT/qmoi-data"
PIDFILE="$ROOT/qmoi-data/qmoi_adapter.pid"
nohup python3 "$PY" > "$ROOT/qmoi-data/qmoi_adapter.log" 2>&1 &
echo $! > "$PIDFILE"
echo "QMOI adapter started (pid=$(cat $PIDFILE)). Logs: $ROOT/qmoi-data/qmoi_adapter.log"
