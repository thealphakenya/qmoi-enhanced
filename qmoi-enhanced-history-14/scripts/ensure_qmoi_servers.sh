#!/usr/bin/env bash
# Supervisor script to start and health-check core QMOI services locally.
# This is intentionally lightweight and for development use only.

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting QMOI supervisor..."

# Start control server (Flask) if not running
if ! pgrep -f "qmoi_control_server.py" >/dev/null; then
  echo "Starting qmoi_control_server.py"
  nohup python3 qmoi_control_server.py > logs/qmoi_control_server.log 2>&1 &
  sleep 1
fi

# Start anomaly service
if ! pgrep -f "ai-anomaly-service.py" >/dev/null; then
  echo "Starting ai-anomaly-service.py"
  nohup python3 ai-anomaly-service.py > logs/ai-anomaly-service.log 2>&1 &
  sleep 1
fi

# Start download endpoint (FastAPI) if present
if [ -f downloadqmoiaiexe.py ] && ! pgrep -f "downloadqmoiaiexe.py" >/dev/null; then
  echo "Starting downloadqmoiaiexe.py (uvicorn)"
  nohup uvicorn downloadqmoiaiexe:app --host 0.0.0.0 --port 3001 > logs/downloadqmoiaiexe.log 2>&1 &
  sleep 1
fi

# Simple health checks
echo "Checking health endpoints..."
sleep 1
CONTROL_OK=1
if ! curl -sS --max-time 3 http://127.0.0.1:8000/health >/dev/null; then
  echo "Control server health check failed"
  CONTROL_OK=0
else
  echo "Control server OK"
fi

ANOM_OK=1
if ! curl -sS --max-time 3 http://127.0.0.1:8000/monitor/status >/dev/null 2>&1; then
  echo "Anomaly service health check possibly unavailable (check ai-anomaly-service)"
  ANOM_OK=0
else
  echo "Anomaly service OK"
fi

if [ $CONTROL_OK -eq 1 ]; then
  echo "QMOI core servers running"
else
  echo "One or more servers are not running correctly"
fi

echo "Supervisor finished"
