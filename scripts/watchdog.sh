#!/usr/bin/env bash
set -eu
# Simple watchdog to ensure core QMOI services are running; restarts them if missing.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PY="$(which python3 || which python)"

ensure() {
  name="$1"
  match="$2"
  cmd="$3"
  if pgrep -f "$match" >/dev/null 2>&1; then
    echo "$name running"
  else
    echo "$name not running; starting"
    nohup bash -lc "$cmd" > "$ROOT/logs/$name.watch.log" 2>&1 &
  fi
}

mkdir -p "$ROOT/logs"
ensure "qmoi-adapter" "services/qmoi_adapter/app.py" "$PY $ROOT/services/qmoi_adapter/app.py"
ensure "qmoi-gateway" "services/qmoi_adapter/gateway.py" "$PY $ROOT/services/qmoi_adapter/gateway.py"
ensure "qmoi-memory" "scripts/qmoi_memory_service.py" "$PY $ROOT/scripts/qmoi_memory_service.py"
ensure "qmoi-progress" "scripts/qmoi_progress_tracker.py" "$PY $ROOT/scripts/qmoi_progress_tracker.py"
ensure "webhook-dispatcher" "scripts/webhook_dispatcher.py" "$PY $ROOT/scripts/webhook_dispatcher.py"

echo "Watchdog completed checks"
