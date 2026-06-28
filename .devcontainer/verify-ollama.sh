#!/bin/bash

# Ollama Setup Verification Script
# Run this after your Codespace rebuilds to verify everything is ready

echo "🔍 Verifying Ollama AI Agent Setup..."
echo "======================================"

# Check if Ollama is running
echo ""
echo "1. Checking Ollama service..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "   ✅ Ollama is running on port 11434"
else
    echo "   ⚠️  Ollama not responding. Starting service..."
    ollama serve > /dev/null 2>&1 &
    sleep 3
fi

# Check if model is available
echo ""
echo "2. Checking qwen2.5-coder:3b model..."
MODELS=$(curl -s http://localhost:11434/api/tags | grep -o "qwen2.5-coder:3b")
if [ -n "$MODELS" ]; then
    echo "   ✅ qwen2.5-coder:3b is available"
else
    echo "   ⚠️  Model not found. Pulling now (this takes ~2-3 minutes)..."
    ollama pull qwen2.5-coder:3b
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
  -d '{
    "model": "qwen2.5-coder:3b",
    "prompt": "say ok",
    "stream": false
  }')
END=$(date +%s%N)
DURATION=$(( (END - START) / 1000000 ))

if echo "$RESPONSE" | grep -q "ok"; then
    echo "   ✅ Model response: ${DURATION}ms"
    if [ "$DURATION" -lt 5000 ]; then
        echo "   ✅ Response time is excellent (model cached in RAM)"
    elif [ "$DURATION" -lt 30000 ]; then
        echo "   ℹ️  First load - next request will be faster"
    fi
else
    echo "   ⚠️  Model test failed - check Ollama logs"
fi

echo ""
echo "======================================"
echo "✨ Setup verification complete!"
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
