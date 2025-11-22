#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Merge QMOI memory so the assistant has up-to-date memory
if command -v python3 >/dev/null 2>&1; then
  echo "Running qmoi_memory_sync.py to merge local memory artifacts..."
  python3 scripts/qmoi_memory_sync.py || true
fi

mkdir -p .qmoi_local_chat || true
CTX_FILE=".qmoi_local_chat/context_full_$(date -u +%Y%m%dT%H%M%SZ).json"
echo "Generating full context to $CTX_FILE"
if command -v python3 >/dev/null 2>&1; then
  python3 scripts/local_chat_helper.py context > "$CTX_FILE" || true
else
  echo "python3 not available; cannot generate context file"
  exit 1
fi

if command -v copilot >/dev/null 2>&1; then
  echo "Invoking Copilot CLI with context"
  copilot chat --input-file "$CTX_FILE" || true
else
  echo "Copilot CLI not installed. To install locally run: npm install -g @githubnext/copilot-cli"
  echo "Context saved to: $CTX_FILE"
fi

echo "run_local_copilot.sh finished"
