#!/bin/bash
set -euo pipefail

export PATH="$HOME/.ollama/bin:$PATH"
OLLAMA_PID_FILE="/tmp/ollama.pid"
OLLAMA_LOG_FILE="$HOME/.ollama/logs/auto-continue.log"
AUTO_CONTINUE_ENABLED="${AUTO_CONTINUE_ENABLED:-true}"
AUTO_CONTINUE_CHECK_INTERVAL="${AUTO_CONTINUE_CHECK_INTERVAL:-10}"
AUTO_CONTINUE_MAX_RESTARTS="${AUTO_CONTINUE_MAX_RESTARTS:-0}"
MAX_RESTART_ATTEMPTS="$AUTO_CONTINUE_MAX_RESTARTS"
mkdir -p "$(dirname "$OLLAMA_LOG_FILE")"

log_message() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$OLLAMA_LOG_FILE"
}

if [ "$AUTO_CONTINUE_ENABLED" = "false" ] || [ "$AUTO_CONTINUE_ENABLED" = "0" ]; then
  log_message "AUTO_CONTINUE_ENABLED=$AUTO_CONTINUE_ENABLED; auto-continue disabled, exiting."
  exit 0
fi

log_message "Auto-continue daemon configuration: check interval=${AUTO_CONTINUE_CHECK_INTERVAL}s, max restarts=${MAX_RESTART_ATTEMPTS}"

validate_ollama_binary() {
  local cmd="$1"
  [ -z "$cmd" ] && return 1
  if "$cmd" --version >/dev/null 2>&1; then
    return 0
  fi
  if [ -x /lib/libgcompat.so.0 ] && LD_PRELOAD=/lib/libgcompat.so.0 "$cmd" --version >/dev/null 2>&1; then
    return 0
  fi
  if [ -x /usr/glibc-compat/lib/libc.so.6 ] && LD_PRELOAD=/usr/glibc-compat/lib/libc.so.6 "$cmd" --version >/dev/null 2>&1; then
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
  # prefer HTTP health, fall back to PID check
  if curl -sS http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    return 0
  fi
  if [ -f "$OLLAMA_PID_FILE" ]; then
    local p
    p=$(cat "$OLLAMA_PID_FILE" 2>/dev/null || true)
    if [ -n "$p" ] && kill -0 "$p" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

start_ollama() {
  if check_ollama_health; then
    return 0
  fi
  log_message "Starting Ollama..."
  pkill -f 'ollama serve' 2>/dev/null || true
  OLLAMA_CMD="$(resolve_ollama_cmd || true)"
  if [ -n "$OLLAMA_CMD" ]; then
    # Try direct, then fallbacks with LD_PRELOAD/LD_LIBRARY_PATH
    local started=0
    local try_env
    if validate_ollama_binary "$OLLAMA_CMD"; then
      nohup "$OLLAMA_CMD" serve > "$HOME/.ollama/logs/daemon.log" 2>&1 &
      started=1
    else
      # fallback libraries to try (order: gcompat, sgerrand glibc)
      local FALLBACK_LIBS=("/lib/libgcompat.so.0" "/usr/glibc-compat/lib/libc.so.6")
      for try_env in "${FALLBACK_LIBS[@]}"; do
        if [ -x "$try_env" ]; then
          nohup env LD_PRELOAD="$try_env" LD_LIBRARY_PATH="$(dirname "$try_env")" "$OLLAMA_CMD" serve > "$HOME/.ollama/logs/daemon.log" 2>&1 &
          started=1
          break
        fi
      done
    fi
    if [ "$started" -eq 1 ]; then
      OLLAMA_PID=$!
      echo "$OLLAMA_PID" > "$OLLAMA_PID_FILE"
      # record to resumefromhere tracker
      if [ -x "$(dirname "$0")/update-resume.sh" ]; then
        bash "$(dirname "$0")/update-resume.sh" "Ollama started (PID: $OLLAMA_PID)" || true
      fi
      sleep 3
      # quick health check and capture logs on failure
      if ! check_ollama_health; then
        log_message "Ollama failed to start; capturing tail of daemon log"
        tail -n 80 "$HOME/.ollama/logs/daemon.log" >> "$OLLAMA_LOG_FILE" 2>&1 || true
      fi
    else
      log_message "❌ Ollama command found but cannot execute with any fallback."
      # write diagnostic to resume tracker
      if [ -x "$(dirname "$0")/update-resume.sh" ]; then
        bash "$(dirname "$0")/update-resume.sh" "Ollama start failed: no viable libc/runtime. Check container glibc state." || true
      fi
      return 1
    fi
  else
    log_message "❌ Ollama command not found; cannot start service"
  fi
}

continuous_monitor() {
  local restart_count=0
  local backoff=5
  log_message "=== AUTO-CONTINUE DAEMON STARTED ==="
  while true; do
    if ! check_ollama_health; then
      log_message "⚠️ Ollama health check failed (attempt: $restart_count)"
      if [ "$MAX_RESTART_ATTEMPTS" -eq 0 ] || [ "$restart_count" -lt "$MAX_RESTART_ATTEMPTS" ]; then
        restart_count=$((restart_count + 1))
        start_ollama || true
        sleep "$backoff"
        backoff=$(( backoff * 2 ))
        if [ "$backoff" -gt 300 ]; then
          backoff=300
        fi
      else
        log_message "❌ Max restart attempts reached"
        sleep 30
      fi
    else
      restart_count=0
      backoff=5
    fi
    sleep "$AUTO_CONTINUE_CHECK_INTERVAL"
  done
}

trap 'log_message "Received shutdown signal. Stopping daemon."; exit 0' SIGTERM SIGINT
continuous_monitor
