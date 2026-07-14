#!/bin/bash
set -euo pipefail

# Ollama Setup Verification Script
# Run this after your Codespace rebuilds to verify everything is ready

echo "🔍 Verifying Ollama AI Agent Setup..."
echo "======================================"

LOG_DIR="${HOME}/.ollama/logs"
mkdir -p "$LOG_DIR"

# Detect Alpine / musl environments early
if ldd --version 2>&1 | head -n1 | grep -qi musl; then
  echo ""
  echo "⚠️  musl libc detected; Ollama requires glibc."
  echo "    Rebuild the devcontainer using a glibc base image such as Debian bullseye."
  echo "    Run: bash .devcontainer/rebuild-and-verify.sh"
  exit 1
fi

# Check if Ollama is running
echo ""
echo "1. Checking Ollama service..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "   ✅ Ollama is running on port 11434"
else
    echo "   ⚠️  Ollama not responding. Starting service..."
    if command -v ollama >/dev/null 2>&1; then
        nohup ollama serve > "$LOG_DIR/serve.log" 2>&1 &
    else
        echo "   ⚠️  Ollama CLI is not available in this shell"
    fi
    sleep 5
fi

# Check if model is available
echo ""
echo "2. Checking qwen2.5-coder:3b model..."
MODELS=$(curl -s http://localhost:11434/api/tags | grep -o "qwen2.5-coder:3b")
if [ -n "$MODELS" ]; then
    echo "   ✅ qwen2.5-coder:3b is available"
else
    echo "   ⚠️  Model not found. Pulling now (this takes ~2-3 minutes)..."
    if command -v ollama >/dev/null 2>&1; then
        ollama pull qwen2.5-coder:3b
    else
        echo "   ⚠️  Ollama CLI not installed or not runnable in this environment."
        if [ -f /usr/local/bin/ollama ]; then
            echo "      Found /usr/local/bin/ollama; this may require glibc support on Alpine Linux."
        fi
    fi
fi

# Check Continue extension
echo ""
echo "3. Checking Continue extension..."
if command -v code &> /dev/null; then
    echo "   ✅ VS Code is installed"
else
    echo "   ⚠️  VS Code not found in PATH"
fi

# Check for Continue config
echo ""
echo "4. Checking Continue configuration..."
if [ -f "$HOME/.continue/config.json" ]; then
    if grep -q "qwen2.5-coder:3b" "$HOME/.continue/config.json"; then
        echo "   ✅ Continue is configured for Ollama"
    else
        echo "   ⚠️  Continue config found but may need Ollama configuration"
        echo "      Visit: VS Code > Continue > Settings (gear icon)"
    fi
else
    echo "   ℹ️  Continue config not yet created (will be created on first Continue launch)"
fi

# Performance check
echo ""
echo "5. Testing model response time..."
START=$(date +%s%N)
RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
   -H 'Content-Type: application/json' \
   -d '{
     "model": "qwen2.5-coder:3b",
     "prompt": "say ok",
     "stream": false
   }')
END=$(date +%s%N)
DURATION=$(( (END - START) / 1000000 ))

if echo "$RESPONSE" | grep -qi "ok"; then
    echo "   ✅ Model response: ${DURATION}ms"
    if [ "$DURATION" -lt 5000 ]; then
        echo "   ✅ Response time is excellent (model cached in RAM)"
    elif [ "$DURATION" -lt 30000 ]; then
        echo "   ℹ️  First load - next request will be faster"
    fi
else
    echo "   ⚠️  Model test failed - check Ollama logs"
fi

if command -v timeout >/dev/null 2>&1; then
    RESPONSE_TIME=$(timeout 5 bash -c 'time (curl -s -X POST http://localhost:11434/api/generate \
        -H "Content-Type: application/json" \
        -d "{\"model\":\"qwen2.5-coder:3b\",\"prompt\":\"say ok\",\"stream\":false}" > /dev/null)' 2>&1 | grep real | awk '{print $2}')
    if [ -n "$RESPONSE_TIME" ]; then
        echo "   ✅ Response time check: $RESPONSE_TIME"
    fi
else
    echo "   ℹ️  Response time check skipped: timeout command unavailable"
fi

echo ""
echo "Next steps:"
echo "1. Open Continue extension (left sidebar)"
echo "2. Click gear icon to verify model configuration"
echo "3. Test with a prompt: 'write hello world in JavaScript'"
echo ""
echo "📚 Documentation:"
echo "  - Allfree.md: Complete setup guide"
echo "  - API.md: Ollama API reference"
echo "  - ENDPOINTS.md: All local endpoints"
echo "  - ROUTES.md: Route configuration"

# Summarize verification to resumefromhere
if [ -x "$(dirname "$0")/update-resume.sh" ]; then
    # determine quick status
    OK=0
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        if echo "$RESPONSE" | grep -qi "ok"; then
            OK=1
        fi
    fi
    if [ "$OK" -eq 1 ]; then
        bash "$(dirname "$0")/update-resume.sh" "verify-ollama: OK — Ollama responsive and qwen2.5-coder responding (${DURATION}ms)" || true
    else
        bash "$(dirname "$0")/update-resume.sh" "verify-ollama: FAILED — Ollama or model not responding; manual investigation required" || true
    fi
fi
