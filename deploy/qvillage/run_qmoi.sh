<!-- AUTODEV Enhanced: 2026-04-20T09:07:34.540478 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:09.724835 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.405107 -->

#!/usr/bin/env bash
# sophisticated supervisor loop to keep the local QM OI server running for qvillage.
# Usage: `nohup ./run_qmoi.sh &` or run under systemd using the provided unit file.

set -euo pipefail

ROOT_DIR="/workspaces/qmoi-enhanced"
SCRIPT="$ROOT_DIR/scripts/qmoi_local_server.py"
LOGDIR="$ROOT_DIR/logs"
mkdir -p "$LOGDIR"

export QMOI_MODEL="qmoi"
# If you want to allow model overrides, set QMOI_ALLOW_MODEL_OVERRIDE=1 in the environment.

while true; do
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) Starting qmoi server..." | tee -a "$LOGDIR/qmoi.log"
  python3 "$SCRIPT" >> "$LOGDIR/qmoi.log" 2>&1 || true
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) qmoi server exited; restarting in 3s..." | tee -a "$LOGDIR/qmoi.log"
  sleep 3
done
