# Container Rebuild Guide — Enable Ollama & Continue

## ⚠️ Critical Issue

The current container is **Alpine Linux (musl libc)**, but Ollama requires **Debian/Ubuntu (glibc)**. The devcontainer is already configured for glibc, but needs a rebuild to apply the change.

**Status:** `Error relocating /usr/local/bin/ollama: fcntl64: symbol not found`

---

## 🚀 How to Rebuild

### Option 1: Codespaces Web UI (Easiest)

1. **Open Codespaces** in browser (github.dev or full Codespace)
2. **Look for the container icon** in the bottom-left toolbar (usually shows "Codespaces")
3. **Right-click the container indicator** or find the menu
4. **Select "Rebuild Container"**
5. **Wait 3-5 minutes** for the rebuild to complete
6. **Codespace will restart automatically**

### Option 2: VS Code Command Palette

1. **Press Ctrl+Shift+P** (Cmd+Shift+P on Mac)
2. **Type:** `Codespaces: Rebuild Container`
3. **Press Enter**
4. **Wait 3-5 minutes** for rebuild
5. **Codespace restarts automatically**

### Option 3: Terminal Command (Advanced)

```bash
# This only works if Codespaces CLI is available
gh codespace rebuild --full
```

---

## ✅ What Happens During Rebuild

1. **New base image** is pulled: `mcr.microsoft.com/devcontainers/base:bullseye` (Debian with glibc)
2. **All features are installed**: Node 20, Python 3.11, Git, GitHub CLI
3. **Ollama is installed** automatically via postCreateCommand
4. **Model is pulled**: `qwen2.5-coder:3b` (~2GB)
5. **Continue extension is installed** and configured
6. **Bootstrap automation runs** to verify everything works

**Expected time:** 3-5 minutes

---

## 🔍 Verify Rebuild Success

After rebuild completes and Codespace restarts, run:

```bash
cd /workspaces/qmoi-enhanced
bash .devcontainer/rebuild-and-verify.sh
```

You should see:

```
Checking libc type in container...
glibc detected — proceeding to run verification script
Running .devcontainer/verify-ollama.sh now...
🔍 Verifying Ollama AI Agent Setup...
======================================

1. Checking Ollama service...
   ✅ Ollama responding on http://127.0.0.1:11434

2. Checking qwen2.5-coder:3b model...
   ✅ Model is available and responding

3. Checking Continue extension...
   ✅ Continue is installed

4. Checking Continue configuration...
   ✅ Continue is configured for Ollama

5. Testing model response time...
   ✅ Model response: 245ms (excellent)
   ✅ Response time is excellent (model cached in RAM)

Next steps:
1. Open Continue extension (left sidebar, Ctrl+I)
2. Click gear icon to verify model configuration
3. Test with a prompt: 'write hello world in JavaScript'

Verification complete. Check resumefromhere.txt for details.
```

---

## 📋 Post-Rebuild Checklist

- [ ] Rebuild completes successfully
- [ ] Run `bash .devcontainer/rebuild-and-verify.sh`
- [ ] Verify Ollama is responding at http://127.0.0.1:11434
- [ ] Verify model `qwen2.5-coder:3b` is available
- [ ] Open Continue extension (Ctrl+I in VS Code)
- [ ] Test Continue with a simple prompt
- [ ] Run documentation generation:
  ```bash
  python3 scripts/consolidate_api_endpoints.py
  ```
- [ ] Run merge executor (if available):
  ```bash
  python3 scripts/merge_executor.py
  ```
- [ ] Update `resumefromhere.txt` with final status

---

## 🛠️ Manual Verification Commands

If automated verification fails, run these commands manually:

### Check Libc
```bash
ldd --version | head -3
# Should show: musl libc (Alpine) — WRONG
# Or: glibc (GNU libc) — CORRECT
```

### Check Ollama
```bash
which ollama
ollama --version
curl -s http://127.0.0.1:11434/api/tags | jq .
```

### Check Model
```bash
ollama list | grep qwen
# Should show: qwen2.5-coder:3b   2.0 GB
```

### Test Continue Connection
```bash
curl -X POST http://127.0.0.1:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "qwen2.5-coder:3b",
    "prompt": "say hello",
    "stream": false
  }' | jq .response
```

---

## 📦 Environment Info

| Component | Current (Alpine) | After Rebuild (Debian) |
|-----------|------------------|------------------------|
| Base Image | Alpine:3.23 | Debian:bullseye |
| Libc | musl | **glibc** |
| Node | 20 | 20 |
| Python | 3.11 | 3.11 |
| Ollama | ❌ Fails | ✅ Works |
| Continue | Installed | ✅ Works with Ollama |

---

## 🚨 Troubleshooting

### Rebuild Won't Start
- Check Codespaces quota in GitHub Settings
- Ensure stable internet connection
- Try rebuilding again after a few minutes

### Ollama Still Fails After Rebuild
- Verify Libc: `ldd --version` should show glibc
- Check Ollama binary: `file /usr/local/bin/ollama`
- Check logs: `cat ~/.ollama/logs/*.log`

### Continue Can't Connect
- Verify Ollama is running: `ps aux | grep ollama`
- Verify port: `curl http://127.0.0.1:11434/api/tags`
- Check Continue config: `cat ~/.continue/config.json`
- Restart Continue: Close and reopen VS Code

### Port Already in Use
```bash
# Find what's using port 11434
lsof -i :11434
# Kill if needed
kill -9 <PID>
# Restart Ollama
ollama serve &
```

---

## 📚 Related Files

- `.devcontainer/devcontainer.json` — Container configuration (already updated)
- `.devcontainer/bootstrap-runtime.sh` — Auto-start scripts
- `.devcontainer/ensure-ollama.sh` — Ollama installation helper
- `.devcontainer/rebuild-and-verify.sh` — This guide's automation
- `~/.continue/config.json` — Continue configuration (auto-created)
- `resumefromhere.txt` — Session progress tracker

---

## ✨ After Successful Rebuild

Once Ollama and Continue are working:

1. **Continue is ready for use**
   ```
   Ctrl+I to open
   Type your question
   Press Enter to get AI assistance
   ```

2. **Bulk operations can resume**
   ```bash
   python3 scripts/consolidate_api_endpoints.py
   python3 scripts/merge_executor.py
   ```

3. **All documentation can be regenerated**
   - API.md
   - ENDPOINTS.md
   - ROUTES.md
   - Component inventory
   - Error inventory

---

**Estimated rebuild time: 3-5 minutes**

**Need help?** Run: `bash .devcontainer/rebuild-and-verify.sh` after rebuild

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:42.897810Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 253
- words: 907
- characters: 6462
- headings: 30
- links: 0
- images: 0
- tables: 8
- lion validation block: present
<!-- LION_VALIDATION_END -->
