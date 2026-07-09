#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="${LOG_DIR:-/tmp/qmoi-bootstrap}"
mkdir -p "$LOG_DIR" "$REPO_ROOT/.devcontainer/tmp"
LOCK_FILE="$LOG_DIR/bootstrap.lock"

if [ -f "$LOCK_FILE" ] && kill -0 "$(cat "$LOCK_FILE" 2>/dev/null)" 2>/dev/null; then
  echo "bootstrap already running"
  exit 0
fi

echo "$$" > "$LOCK_FILE"
cleanup() {
  rm -f "$LOCK_FILE"
}
trap cleanup EXIT

run_step() {
  local label="$1"
  local script="$2"
  local log_file="$LOG_DIR/${label}.log"

  echo "[bootstrap] running ${label}"
  if [ -f "$script" ]; then
    if bash "$script" > "$log_file" 2>&1; then
      echo "[bootstrap] ${label} completed"
    else
      echo "[bootstrap] ${label} failed; see $log_file"
    fi
  else
    echo "[bootstrap] missing script: $script"
  fi
}

if [ ! -d "$REPO_ROOT" ]; then
  echo "[bootstrap] repository root not found"
  exit 1
fi

run_step ensure-ollama "$REPO_ROOT/.devcontainer/ensure-ollama.sh"
run_step start-auto-continue "$REPO_ROOT/.devcontainer/start-auto-continue.sh"
run_step open-continue "$REPO_ROOT/.devcontainer/open-continue.sh"
(
  sleep 15
  run_step run-bulk-once "$REPO_ROOT/.devcontainer/run-bulk-once.sh"
) > "$LOG_DIR/run-bulk-once-wrapper.log" 2>&1 &

echo "Bootstrap tasks launched. Logs: $LOG_DIR"
exit 0
