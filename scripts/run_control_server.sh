#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$ROOT/.venv_qmoi_control"
REQ="$ROOT/requirements-control.txt"
LOG="$ROOT/logs/control_server.log"

mkdir -p "$ROOT/logs"
if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
fi
source "$VENV/bin/activate"
pip install --upgrade pip
pip install -r "$REQ"
nohup "$VENV/bin/python" "$ROOT/qmoi_control_server.py" > "$LOG" 2>&1 &
echo "Started control server, logs: $LOG"
