# Quick Start: Continue + Ollama Setup

## Step 1: Rebuild Your Codespace (First Time Only)

Your `.devcontainer/devcontainer.json` now includes automatic Ollama setup and a glibc-based container build. When you rebuild:

```bash
# In GitHub, click "Rebuild container" to trigger this automatically:
# - Uses a Debian bullseye glibc base image
# - Installs Ollama
# - Pulls qwen2.5-coder:3b model (~2GB)
# - Starts Ollama as background daemon
# - Mounts persistent volumes for model and Continue config persistence
```

> Note: If your workspace is currently running Alpine/musl, Ollama will fail. Rebuild using the devcontainer config above before continuing.

**Estimated time:** 5-10 minutes on first rebuild

## Step 2: Verify Ollama is Running

Once your Codespace loads, open the terminal and run:

```bash
curl http://localhost:11434/api/tags
```

Expected output:
```json
{
  "models": [
    {
      "name": "qwen2.5-coder:3b:latest",
      ...
    }
  ]
}
```

Or use the automated verification script:
```bash
bash .devcontainer/verify-ollama.sh
```

## Step 3: Configure Continue Extension

1. Open VS Code
2. Click the **Continue icon** in the left sidebar
3. Click the **gear icon** ⚙️ at the bottom right
4. Replace the `models` array in `config.json` with:

```json
{
  "models": [
    {
      "title": "Local Qwen Coder",
      "provider": "ollama",
      "model": "qwen2.5-coder:3b"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Local Qwen Coder",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b"
  }
}
```

5. Save the file

## Step 4: Test the Connection

In the Continue panel, type a simple prompt:

```
Write a hello world function in JavaScript
```

You should see:
- ✅ Instant response (model is loaded in RAM)
- ✅ Clean, formatted code
- ✅ No API calls (everything local)

## Step 5: Start Using Continue

### Chat Mode
- Press `Ctrl+Shift+J` (or `Cmd+Shift+J` on Mac)
- Ask questions about your code
- Get context-aware suggestions

### Code Generation
- Highlight code and ask Continue to refactor, explain, or generate
- Use prompts like: "Add error handling", "Write unit tests", "Optimize this function"

### Tab Autocomplete
- Start typing and Continue will suggest completions
- Press Tab to accept

### Custom Models

If you want faster responses with less memory:
```bash
ollama pull qwen2.5-coder:1.5b
```

Then update Continue config to use `qwen2.5-coder:1.5b`.

For more advanced queries:
```bash
ollama pull qwen2.5:7b
```

## Troubleshooting

### "No model available" error
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not responding, restart manually
ollama serve > /dev/null 2>&1 &
```

### Model takes 30+ seconds
This only happens on the first request (model loads into RAM). Subsequent requests are <100ms.

### Codespace rebuilds lose the model
The persistent volume (`ollama_data`) automatically preserves models. If missing:
```bash
ollama pull qwen2.5-coder:3b
```

### "Connection refused" on port 11434
```bash
# Check if Ollama process exists
ps aux | grep ollama

# Verify port is open
netstat -tulpn | grep 11434

# If not running, start it
ollama serve > /dev/null 2>&1 &
sleep 3
```

## Performance Optimization

Your environment is already optimized with:

| Setting | Value | Effect |
|---------|-------|--------|
| OLLAMA_KEEP_ALIVE | -1 | Model stays in RAM indefinitely |
| OLLAMA_FLASH_ATTENTION | 1 | Faster inference (if supported) |
| Container Memory | 4GB | Sufficient for model + app |
| Container CPUs | 2 | Optimized for Codespace |

## API Access

You can also call Ollama directly from your code:

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen2.5-coder:3b',
    prompt: 'write hello world',
    stream: false
  })
});
const data = await response.json();
console.log(data.response);
```

### Python
```python
import requests

response = requests.post('http://localhost:11434/api/generate', json={
    'model': 'qwen2.5-coder:3b',
    'prompt': 'write hello world',
    'stream': False
})
print(response.json()['response'])
```

### Curl
```bash
curl -X POST http://localhost:11434/api/generate \
  -d '{
    "model": "qwen2.5-coder:3b",
    "prompt": "write hello world",
    "stream": false
  }'
```

## Documentation Reference

- **[Allfree.md](../Allfree.md)** - Complete setup and architecture guide
- **[API.md](../API.md)** - All API endpoints (including Ollama)
- **[ENDPOINTS.md](../ENDPOINTS.md)** - Detailed endpoint reference
- **[ROUTES.md](../ROUTES.md)** - Route configuration and startup sequence

## Next Steps

1. ✅ Rebuild Codespace
2. ✅ Verify Ollama is running
3. ✅ Configure Continue
4. ✅ Test with a simple prompt
5. 🚀 Start building with unlimited AI assistance!

---

**Status:** Production-Ready ✅  
**Cost:** $0.00  
**Rate Limits:** None  
**Data Privacy:** 100% local
