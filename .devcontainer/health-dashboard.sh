#!/bin/bash
set -euo pipefail

# Health Dashboard: Monitor Ollama and Continue setup status
# Run this to check current health without any blocking operations

OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"
STATE_DIR="${HOME}/.ollama/state"
CONTINUE_STATE_DIR="${HOME}/.vscode-remote/state"
LOG_DIR="/tmp/qmoi-bootstrap"

echo "════════════════════════════════════════════════════════════════"
echo "        QMOI HEALTH DASHBOARD - $(date '+%Y-%m-%d %H:%M:%S')"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check Ollama Binary
echo "📦 OLLAMA BINARY"
if command -v ollama >/dev/null 2>&1; then
  OLLAMA_VERSION=$(ollama --version 2>/dev/null || echo "unknown")
  echo "  ✅ Binary: $OLLAMA_VERSION"
else
  echo "  ❌ Binary: Not found in PATH"
fi
echo ""

# Check Ollama Service
echo "🚀 OLLAMA SERVICE"
if curl -sS "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
  echo "  ✅ API: Reachable at $OLLAMA_HOST"
  MODELS=$(curl -sS "$OLLAMA_HOST/api/tags" 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | tr '\n' ', ' | sed 's/,$//')
  if [ -n "$MODELS" ]; then
    echo "  ✅ Models: $MODELS"
  else
    echo "  ⚠️  Models: None loaded"
  fi
else
  echo "  ❌ API: Not reachable"
fi
echo ""

# Check Ollama State
echo "💾 OLLAMA PERSISTENCE"
if [ -f "$STATE_DIR/installed" ]; then
  echo "  ✅ Installed marker: Present"
else
  echo "  ⚠️  Installed marker: Not found (may be first run)"
fi
if [ -f "$STATE_DIR/qwen2.5-coder:3b" ]; then
  echo "  ✅ Model marker: qwen2.5-coder:3b"
else
  echo "  ⚠️  Model marker: Not found"
fi
echo ""

# Check Continue Extension
echo "🔧 CONTINUE EXTENSION"
if command -v code >/dev/null 2>&1; then
  if code --list-extensions 2>/dev/null | grep -q 'continue.continue'; then
    echo "  ✅ Installed: continue.continue"
  else
    echo "  ❌ Installed: Not found"
  fi
else
  echo "  ⚠️  VS Code CLI: Not available"
fi

if [ -f "$CONTINUE_STATE_DIR/continue-installed" ]; then
  echo "  ✅ Install marker: Present"
else
  echo "  ⚠️  Install marker: Not found"
fi
echo ""

# Check Bootstrap Logs
echo "📝 BOOTSTRAP LOGS"
if [ -d "$LOG_DIR" ]; then
  echo "  Location: $LOG_DIR"
  for log in "$LOG_DIR"/*.log; do
    if [ -f "$log" ]; then
      BASENAME=$(basename "$log")
      LINES=$(wc -l < "$log")
      LAST_LINE=$(tail -n1 "$log" 2>/dev/null || echo "")
      echo "  📄 $BASENAME ($LINES lines)"
      if [ -n "$LAST_LINE" ]; then
        echo "     └─ $(echo "$LAST_LINE" | cut -c1-70)"
      fi
    fi
  done
else
  echo "  ⚠️  Bootstrap log directory not found"
fi
echo ""

# System Resources
echo "💻 SYSTEM RESOURCES"
if command -v free >/dev/null 2>&1; then
  MEM=$(free -h | awk 'NR==2 {print $3 "/" $2}')
  echo "  Memory: $MEM"
fi
if command -v df >/dev/null 2>&1; then
  DISK=$(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')
  echo "  Disk: $DISK"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "Use: bash .devcontainer/health-dashboard.sh to check again"
echo "════════════════════════════════════════════════════════════════"
