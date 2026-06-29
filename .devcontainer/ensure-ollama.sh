#!/bin/bash
set -euo pipefail

OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"
LOG_DIR="${HOME}/.ollama/logs"
LOCK_FILE="/tmp/ensure-ollama.lock"
mkdir -p "$LOG_DIR"

if [ -f "$LOCK_FILE" ] && kill -0 "$(cat "$LOCK_FILE")" 2>/dev/null; then
  echo "ensure-ollama already running"
  exit 0
fi

echo "$$" > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

echo "→ Ensuring Ollama is installed and running..."

if ! command -v ollama >/dev/null 2>&1; then
  echo "ollama not found — attempting installer"
  curl -fsSL https://ollama.com/install.sh | sh || true
  if ! command -v ollama >/dev/null 2>&1; then
    if [ -x /usr/bin/ollama ]; then
      ln -sf /usr/bin/ollama /usr/local/bin/ollama || true
    fi
  fi
fi

if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
  echo "Ollama API reachable"
else
  echo "Starting ollama serve in background"
  nohup ollama serve > "$LOG_DIR/serve.log" 2>&1 &
  for _ in $(seq 1 20); do
    if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

if curl -sS "$OLLAMA_HOST/api/tags" | grep -q 'qwen2.5-coder:3b'; then
  echo "Model qwen2.5-coder:3b present"
else
  echo "Pulling model qwen2.5-coder:3b (may take several minutes)"
  ollama pull qwen2.5-coder:3b > "$LOG_DIR/model-pull.log" 2>&1 || true
fi

echo "→ Ollama ensured"
exit 0
