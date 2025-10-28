#!/usr/bin/env bash
# Simple supervisor that ensures key QMOI services are running. Intentionally conservative.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGDIR="$ROOT/.qmoi"
LOGDIR.mkdir 2>/dev/null || true
start_if_missing() {
  name=$1
  start_cmd="$2"
  # check by pgrep for a substring of the command
  if ! pgrep -f "$name" >/dev/null 2>&1; then
    echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') starting $name" >> "$LOGDIR/supervisor.log"
    nohup bash -c "$start_cmd" >> "$LOGDIR/supervisor.out" 2>&1 &
    sleep 0.5
  fi
}

while true; do
  # adapter
  start_if_missing "qmoi_adapter" "bash '$ROOT/scripts/start_qmoi_adapter.sh' || true"
  # gateway
  start_if_missing "qmoi_gateway" "python3 '$ROOT/services/qmoi_adapter/gateway.py' || true"
  # admin server
  start_if_missing "qmoi_admin" "nohup python3 '$ROOT/scripts/qmoi_admin.py' &> '$LOGDIR/admin.out' &"
  # friendship daemon
  start_if_missing "qmoi_friendship_daemon" "nohup python3 '$ROOT/scripts/qmoi_friendship_daemon.py' &> '$LOGDIR/friendship.out' &"
  # healthcheck every 30s
  sleep 30
done
