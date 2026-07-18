#!/bin/bash
set -euo pipefail

OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"
LOG_DIR="${HOME}/.ollama/logs"
STATE_DIR="${HOME}/.ollama/state"
BIN_DIR="${HOME}/.ollama/bin"
LOCK_FILE="/tmp/ensure-ollama.lock"
INSTALL_MARKER="$STATE_DIR/installed"
MODEL_MARKER="$STATE_DIR/qwen2.5-coder:3b"
mkdir -p "$LOG_DIR" "$STATE_DIR" "$BIN_DIR"
export PATH="$BIN_DIR:/home/node/.ollama/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

ensure_runtime_compat() {
  bash "$(dirname "$0")/check-glibc.sh"
}

is_alpine() {
  [ -f /etc/alpine-release ]
}

ensure_runtime_compat || exit 1

if [ -f "$LOCK_FILE" ] && kill -0 "$(cat "$LOCK_FILE")" 2>/dev/null; then
  echo "ensure-ollama already running"
  exit 0
fi

echo "$$" > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

echo "→ Ensuring Ollama is installed and running..."

export LOG_DIR STATE_DIR

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
  for candidate in "$BIN_DIR/ollama" "$(command -v ollama 2>/dev/null || true)" /usr/local/bin/ollama /usr/bin/ollama; do
    [ -z "$candidate" ] && continue
    if [ -x "$candidate" ] && validate_ollama_binary "$candidate"; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

OLLAMA_CMD="$(resolve_ollama_cmd || true)"

if [ ! -f "$INSTALL_MARKER" ]; then
  if [ -z "$OLLAMA_CMD" ]; then
    if is_alpine; then
      echo "Alpine host detected; building Ollama from source for musl compatibility"
      bash "$(dirname "$0")/build-ollama-from-source.sh"
      OLLAMA_CMD="$BIN_DIR/ollama"
    else
      echo "ollama not found — attempting installer"
      curl -fsSL https://ollama.com/install.sh | sh || true
      OLLAMA_CMD="$(resolve_ollama_cmd || true)"
    fi
  fi

  if [ -z "$OLLAMA_CMD" ] && [ -x /usr/bin/ollama ] && validate_ollama_binary /usr/bin/ollama; then
    ln -sf /usr/bin/ollama /usr/local/bin/ollama || true
    OLLAMA_CMD="/usr/local/bin/ollama"
  fi

  if [ -n "$OLLAMA_CMD" ]; then
    mkdir -p "$BIN_DIR"
    if [ ! -x "$BIN_DIR/ollama" ]; then
      if cp "$OLLAMA_CMD" "$BIN_DIR/ollama" 2>/dev/null; then
        chmod +x "$BIN_DIR/ollama"
      else
        ln -sf "$OLLAMA_CMD" "$BIN_DIR/ollama"
      fi
    fi
    if validate_ollama_binary "$BIN_DIR/ollama"; then
      touch "$INSTALL_MARKER"
      echo "Installed Ollama and cached binary state"
    else
      echo "Warning: Ollama binary was cached but is not yet runnable in this environment."
      if is_alpine; then
        echo "         Alpine host detected; the source build may still require additional dependencies or compatibility fixes."
      else
        echo "         This may indicate a musl host; rebuild to a glibc-based devcontainer or use Alpine source build."
      fi
    fi
  else
    echo "Ollama command not available; cannot start service"
    if is_alpine; then
      echo "         Alpine source build failed or Ollama is not installed. See $HOME/.ollama/logs/build-source.log"
    fi
  fi
else
  echo "Ollama install marker found; skipping reinstall"
fi

if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
  echo "Ollama API reachable"
else
  if [ -n "$OLLAMA_CMD" ]; then
    echo "Starting Ollama serve in background"
    if [ -d "$SRC_DIR/build/llama-server-cpu/bin" ]; then
      export GGML_BACKEND_PATH="$SRC_DIR/build/llama-server-cpu/bin"
      export LD_LIBRARY_PATH="$SRC_DIR/build/llama-server-cpu/bin:${LD_LIBRARY_PATH:-}"
      echo "INFO: Using source-built runtime libs from $GGML_BACKEND_PATH"
    fi
    if validate_ollama_binary "$OLLAMA_CMD"; then
      nohup "$OLLAMA_CMD" serve > "$LOG_DIR/serve.log" 2>&1 &
    elif [ -x /lib/libgcompat.so.0 ]; then
      nohup env LD_PRELOAD=/lib/libgcompat.so.0 "$OLLAMA_CMD" serve > "$LOG_DIR/serve.log" 2>&1 &
    else
      echo "Ollama command found but unable to execute. Alpine compatibility may be required."
    fi
    for _ in $(seq 1 40); do
      if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
        break
      fi
      sleep 1
    done
  else
    echo "Ollama command not available; cannot start service"
  fi
fi

if curl -sS "$OLLAMA_HOST/api/tags" 2>/dev/null | grep -q 'qwen2.5-coder:3b'; then
  echo "Model qwen2.5-coder:3b present"
  touch "$MODEL_MARKER"
else
  if [ ! -f "$MODEL_MARKER" ]; then
    echo "Model pull queued for background (non-blocking)"
    if [ -n "$OLLAMA_CMD" ]; then
      nohup bash -lc 'sleep 5; echo "→ Pulling model qwen2.5-coder:3b..." >> "$LOG_DIR/model-pull.log"; "$OLLAMA_CMD" pull qwen2.5-coder:3b >> "$LOG_DIR/model-pull.log" 2>&1 && touch "$MODEL_MARKER"' > /dev/null 2>&1 < /dev/null &
    else
      echo "Cannot queue model pull: Ollama command not available"
    fi
  else
    echo "Model marker exists; skipping redundant pull"
  fi
fi

if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
  echo "Ollama verified and ready"
else
  echo "Ollama did not become ready; check logs"
fi

echo "→ Ollama ensured"
# update resumefromhere tracker about Ollama status
if [ -x "$(dirname "$0")/update-resume.sh" ]; then
  if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    bash "$(dirname "$0")/update-resume.sh" "Ollama ensured and API reachable" || true
  else
    bash "$(dirname "$0")/update-resume.sh" "Ollama install present but service not reachable or incompatible on this host" || true
  fi
fi
exit 0
