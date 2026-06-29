#!/bin/bash
set -euo pipefail

OLLAMA_PID_FILE="/tmp/ollama.pid"
OLLAMA_LOG_FILE="$HOME/.ollama/logs/auto-continue.log"
MAX_RESTART_ATTEMPTS=3
mkdir -p "$(dirname "$OLLAMA_LOG_FILE")"

log_message() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$OLLAMA_LOG_FILE"
}

check_ollama_health() {
  curl -sS http://127.0.0.1:11434/api/tags > /dev/null 2>&1
}

start_ollama() {
  if check_ollama_health; then
    return 0
  fi
  log_message "Starting Ollama..."
  pkill -f 'ollama serve' 2>/dev/null || true
  nohup ollama serve > "$HOME/.ollama/logs/daemon.log" 2>&1 &
  OLLAMA_PID=$!
  echo "$OLLAMA_PID" > "$OLLAMA_PID_FILE"
  sleep 3
}

continuous_monitor() {
  local restart_count=0
  log_message "=== AUTO-CONTINUE DAEMON STARTED ==="
  while true; do
    if ! check_ollama_health; then
      log_message "⚠️ Ollama health check failed"
      if [ "$restart_count" -lt "$MAX_RESTART_ATTEMPTS" ]; then
        restart_count=$((restart_count + 1))
        start_ollama
      else
        log_message "❌ Max restart attempts reached"
        sleep 30
      fi
    else
      restart_count=0
    fi
    sleep 15
  done
}

trap 'log_message "Received shutdown signal. Stopping daemon."; exit 0' SIGTERM SIGINT
continuous_monitor
