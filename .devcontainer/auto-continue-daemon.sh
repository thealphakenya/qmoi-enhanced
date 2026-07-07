#!/bin/bash
set -euo pipefail

OLLAMA_PID_FILE="/tmp/ollama.pid"
OLLAMA_LOG_FILE="$HOME/.ollama/logs/auto-continue.log"
MAX_RESTART_ATTEMPTS=3
mkdir -p "$(dirname "$OLLAMA_LOG_FILE")"

log_message() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$OLLAMA_LOG_FILE"
}

validate_ollama_binary() {
  local cmd="$1"
  [ -z "$cmd" ] && return 1
  if "$cmd" --version >/dev/null 2>&1; then
    return 0
  fi
  if [ -x /lib/libgcompat.so.0 ] && LD_PRELOAD=/lib/libgcompat.so.0 "$cmd" --version >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

resolve_ollama_cmd() {
  local candidate
  for candidate in "$(command -v ollama 2>/dev/null || true)" /usr/local/bin/ollama /usr/bin/ollama; do
    [ -z "$candidate" ] && continue
    if [ -x "$candidate" ] && validate_ollama_binary "$candidate"; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
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
  OLLAMA_CMD="$(resolve_ollama_cmd || true)"
  if [ -n "$OLLAMA_CMD" ]; then
    if validate_ollama_binary "$OLLAMA_CMD"; then
      nohup "$OLLAMA_CMD" serve > "$HOME/.ollama/logs/daemon.log" 2>&1 &
    elif [ -x /lib/libgcompat.so.0 ]; then
      nohup env LD_PRELOAD=/lib/libgcompat.so.0 "$OLLAMA_CMD" serve > "$HOME/.ollama/logs/daemon.log" 2>&1 &
    else
      log_message "❌ Ollama command found but cannot execute. Alpine compatibility issue likely."
      return 1
    fi
    OLLAMA_PID=$!
    echo "$OLLAMA_PID" > "$OLLAMA_PID_FILE"
      # record to resumefromhere tracker
      if [ -x "$(dirname "$0")/update-resume.sh" ]; then
        bash "$(dirname "$0")/update-resume.sh" "Ollama started (PID: $OLLAMA_PID)" || true
      fi
    sleep 3
  else
    log_message "❌ Ollama command not found; cannot start service"
  fi
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
