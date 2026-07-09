#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="/tmp/clean-ollama.log"
echo "Starting clean-and-reinstall-ollama" | tee "$LOG"

echo "Stopping any ollama processes..." | tee -a "$LOG" || true
pkill -f ollama || true
sleep 1

echo "Removing Ollama data at /root/.ollama (if present)..." | tee -a "$LOG"
rm -rf /root/.ollama || true

echo "Re-running Ollama installer..." | tee -a "$LOG"
curl -fsSL https://ollama.com/install.sh | sh >> "$LOG" 2>&1 || true

echo "Resolving ollama command..." | tee -a "$LOG"
OLLAMA_CMD="$(command -v ollama || true)"
if [ -z "$OLLAMA_CMD" ] && [ -x /usr/local/bin/ollama ]; then
  OLLAMA_CMD="/usr/local/bin/ollama"
fi

if [ -z "$OLLAMA_CMD" ]; then
  echo "Ollama CLI not found after installer; aborting." | tee -a "$LOG"
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: installer failed to place ollama CLI" || true
  exit 1
fi

echo "Starting Ollama serve in background (non-blocking)..." | tee -a "$LOG"
nohup "$OLLAMA_CMD" serve >> "$LOG" 2>&1 &
sleep 5

if curl -sS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama API reachable" | tee -a "$LOG"
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: Ollama serve started and API reachable" || true
else
  echo "Ollama API not reachable after reinstall. Check $LOG" | tee -a "$LOG"
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: Ollama serve failed to start" || true
  tail -n 60 "$LOG" || true
  exit 1
fi

echo "Queuing model pull (non-blocking)..." | tee -a "$LOG"
nohup bash -lc 'sleep 3; "${0}" pull qwen2.5-coder:3b >> "${1}" 2>&1' "$OLLAMA_CMD" "$LOG" &

bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: installer ran, serve started, model pull queued" || true

echo "clean-and-reinstall-ollama complete. Logs: $LOG"
exit 0
#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="/tmp/clean-ollama.log"
echo "Starting clean-and-reinstall-ollama" | tee "$LOG"

echo "Stopping any ollama processes..." | tee -a "$LOG" || true
pkill -f ollama || true
sleep 1

echo "Removing Ollama data at /root/.ollama (if present)..." | tee -a "$LOG"
rm -rf /root/.ollama || true

echo "Re-running Ollama installer..." | tee -a "$LOG"
curl -fsSL https://ollama.com/install.sh | sh >> "$LOG" 2>&1 || true

echo "Resolving ollama command..." | tee -a "$LOG"
OLLAMA_CMD="$(command -v ollama || true)"
if [ -z "$OLLAMA_CMD" ] && [ -x /usr/local/bin/ollama ]; then
  OLLAMA_CMD="/usr/local/bin/ollama"
fi

if [ -z "$OLLAMA_CMD" ]; then
  echo "Ollama CLI not found after installer; aborting." | tee -a "$LOG"
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: installer failed to place ollama CLI" || true
  exit 1
fi

echo "Starting Ollama serve in background (non-blocking)..." | tee -a "$LOG"
nohup "$OLLAMA_CMD" serve >> "$LOG" 2>&1 &
sleep 5

if curl -sS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama API reachable" | tee -a "$LOG"
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: Ollama serve started and API reachable" || true
else
  echo "Ollama API not reachable after reinstall. Check $LOG" | tee -a "$LOG"
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: Ollama serve failed to start" || true
  tail -n 60 "$LOG" || true
  exit 1
fi

echo "Queuing model pull (non-blocking)..." | tee -a "$LOG"
nohup bash -lc 'sleep 3; "${0}" pull qwen2.5-coder:3b >> "${1}" 2>&1' "$OLLAMA_CMD" "$LOG" &

bash "$REPO_ROOT/.devcontainer/update-resume.sh" "clean-reinstall: installer ran, serve started, model pull queued" || true

echo "clean-and-reinstall-ollama complete. Logs: $LOG"
exit 0
