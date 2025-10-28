#!/usr/bin/env bash
set -eu
# Ensure QMOI adapter, agent services and gateway are running and registered for Capilot.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Ensuring QMOI services are running..."
bash "$ROOT/scripts/register_qmoi_local.sh"
bash "$ROOT/scripts/optimize_qvs.sh" || true

# start adapter if not running
if ! pgrep -f services/qmoi_adapter/app.py >/dev/null 2>&1; then
  echo "Starting qmoi adapter..."
  bash "$ROOT/scripts/start_qmoi_adapter.sh"
else
  echo "qmoi adapter already running"
fi

# start memory/progress via agent runner
if ! pgrep -f qmoi_memory_service.py >/dev/null 2>&1 || ! pgrep -f qmoi_progress_tracker.py >/dev/null 2>&1; then
  echo "Starting agent runner"
  bash "$ROOT/scripts/qmoi_agent_runner.sh"
else
  echo "Agent components already running"
fi

# start gateway
if ! pgrep -f services/qmoi_adapter/gateway.py >/dev/null 2>&1; then
  echo "Starting gateway..."
  nohup python3 "$ROOT/services/qmoi_adapter/gateway.py" > "$ROOT/qmoi-data/gateway.log" 2>&1 &
  sleep 0.5
else
  echo "Gateway already running"
fi

echo "QMOI ensure complete. Model discovery URL: http://localhost:8770/v1/models"
