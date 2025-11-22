#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p .qmoi_local_chat || true
python3 scripts/local_chat_helper.py context > .qmoi_local_chat/context_$(date -u +%Y%m%dT%H%M%SZ).json || true

if command -v copilot >/dev/null 2>&1; then
  echo "Invoking copilot chat with context"
  copilot chat --input-file .qmoi_local_chat/context_*.json || true
else
  echo "copilot CLI not installed. Install: npm install -g @githubnext/copilot-cli"
  echo "Context saved to .qmoi_local_chat/*.json"
fi
