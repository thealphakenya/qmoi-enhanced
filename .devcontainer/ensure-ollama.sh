#!/bin/bash
set -e
echo "→ Ensuring Ollama is installed and running..."

if command -v ollama >/dev/null 2>&1; then
  echo "ollama CLI present"
else
  echo "ollama not found — attempting installer"
  curl -fsSL https://ollama.com/install.sh | sh || true
fi

# Check service
if curl -sS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama API reachable"
else
  echo "Starting ollama serve in background"
  nohup ollama serve > "$HOME/.ollama/logs/ollama-serve.log" 2>&1 &
  sleep 5
fi

# Ensure model is present
if curl -sS http://127.0.0.1:11434/api/tags | grep -q "qwen2.5-coder:3b"; then
  echo "Model qwen2.5-coder:3b present"
else
  echo "Pulling model qwen2.5-coder:3b (may take several minutes)"
  ollama pull qwen2.5-coder:3b || true
fi

echo "→ Ollama ensured"
exit 0
