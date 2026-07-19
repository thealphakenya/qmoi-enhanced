# POST-REBUILD AUTOMATION & CHECKLIST

## 📋 Complete Post-Rebuild Checklist

This document guides you through verifying and activating all systems after container rebuild.

### Phase 1: Environment Verification (5 min)

After the container finishes rebuilding and restarts:

```bash
# 1. Verify libc type (should be glibc, not musl)
ldd --version | head -3
# Expected output:
#   ldd (GNU libc) 2.31
#   ...

# 2. Verify Ollama binary exists and is compatible
file /usr/local/bin/ollama
# Expected: ELF 64-bit LSB executable

# 3. Check Ollama service status
ps aux | grep ollama | grep -v grep
# Expected: ollama serve running as a process

# 4. Test Ollama endpoint
curl -s http://127.0.0.1:11434/api/tags | jq '.models | length'
# Expected: 1 or more (means model is loaded)

# 5. Check Continue extension
code --list-extensions 2>/dev/null | grep continue
# Expected: continue.continue
```

### Phase 2: Automated Verification (2 min)

Run the built-in verification script:

```bash
cd /workspaces/qmoi-enhanced
bash .devcontainer/rebuild-and-verify.sh
```

Expected output:
```
Checking libc type in container...
glibc detected — proceeding to run verification script
Running .devcontainer/verify-ollama.sh now...
🔍 Verifying Ollama AI Agent Setup...
✅ Ollama responding on http://127.0.0.1:11434
✅ Model is available and responding
✅ Continue is installed
✅ Continue is configured for Ollama
✅ Model response: 245ms (excellent)
```

### Phase 3: Continue Integration Test (2 min)

1. **Open Continue in VS Code**
   - Press `Ctrl+I` (or `Cmd+I` on Mac)
   - Continue panel should appear on the left

2. **Test a simple prompt**
   - Type: `write hello world in javascript`
   - Press Enter
   - Model should respond within 3 seconds

3. **Verify model is using local Ollama**
   - Click gear icon (⚙️) in Continue panel
   - Verify: Model = `qwen2.5-coder:3b`
   - Verify: Provider = `ollama`
   - Verify: Base URL = `http://127.0.0.1:11434` or similar

### Phase 4: Documentation Regeneration (5-10 min)

After verification passes, regenerate all documentation:

```bash
# Generate API documentation from codebase
python3 scripts/consolidate_api_endpoints.py

# Merge duplicate modules and components (if available)
if [ -f scripts/merge_executor.py ]; then
  python3 scripts/merge_executor.py
fi
```

Expected files updated:
- `API.md` (API documentation)
- `ENDPOINTS.md` (All endpoints)
- `ROUTES.md` (All routes)

### Phase 5: Bulk Operations (10-15 min)

If bulk automation scripts exist, run them:

```bash
# Full bulk pass with consolidation
python3 scripts/consolidate_api_endpoints.py

# Run any auto-fix or merge scripts
if [ -f scripts/merge_executor.py ]; then
  python3 scripts/merge_executor.py
fi

# Update inventory
if [ -f scripts/autoupdate_docs.sh ]; then
  bash scripts/autoupdate_docs.sh
fi
```

### Phase 6: Final Status Update (1 min)

Update the progress tracker:

```bash
cd /workspaces/qmoi-enhanced

# Add a completion note
cat >> resumefromhere.txt << 'EOF'

REBUILD COMPLETION ($(date -u +%Y-%m-%dT%H:%M:%SZ))
=====================================
✅ Container rebuilt successfully
✅ glibc environment confirmed
✅ Ollama service running at http://127.0.0.1:11434
✅ Model qwen2.5-coder:3b loaded and responding
✅ Continue extension installed and configured
✅ All documentation regenerated
✅ Bulk operations completed
✅ Ready for Continue-based development

Next: Open Continue with Ctrl+I to start using AI assistance
EOF

git add -A
git commit -m "chore: post-rebuild verification and documentation update"
```

---

## 🧪 Troubleshooting Commands

If any phase fails, use these commands:

### Check Libc (Phase 1 issue)
```bash
# If ldd shows musl, rebuild didn't work
ldd --version
# If musl → Rebuild again or contact Codespaces support

# If glibc → Rebuild successful
```

### Check Ollama (Phase 1-2 issue)
```bash
# Is Ollama running?
ps aux | grep ollama

# Logs
tail -50 ~/.ollama/logs/*.log

# Restart manually
pkill ollama
sleep 2
ollama serve > ~/.ollama/logs/server.log 2>&1 &
sleep 5
curl -s http://127.0.0.1:11434/api/tags | jq .
```

### Check Model (Phase 1-2 issue)
```bash
# List models
ollama list

# Pull model manually if missing
ollama pull qwen2.5-coder:3b

# Test model
curl -X POST http://127.0.0.1:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"model":"qwen2.5-coder:3b","prompt":"say hi","stream":false}' \
  | jq .response
```

### Check Continue (Phase 3 issue)
```bash
# Verify extension installed
code --list-extensions | grep continue

# Check configuration
cat ~/.continue/config.json

# Check if Ollama is reachable from Continue
curl -s http://127.0.0.1:11434/api/tags | head
```

### Check Python Scripts (Phase 4 issue)
```bash
# Verify Python and dependencies
python3 --version
pip list | grep -E "^(flask|requests|openai)"

# Test consolidate script
python3 scripts/consolidate_api_endpoints.py --help || python3 scripts/consolidate_api_endpoints.py

# View output
head -50 API.md
```

---

## 📊 Expected Post-Rebuild State

After all phases complete:

| Component | Status | Verification |
|-----------|--------|---|
| **Libc** | glibc | `ldd --version` shows "GNU libc" |
| **Ollama** | Running | `ps aux \| grep ollama` shows process |
| **Model** | Loaded | `curl http://127.0.0.1:11434/api/tags` returns models |
| **Continue** | Installed | `code --list-extensions \| grep continue` |
| **API Docs** | Updated | `API.md`, `ENDPOINTS.md` recently modified |
| **Tracker** | Updated | `resumefromhere.txt` shows completion timestamp |

---

## ⏱️ Timeline

- **Rebuild:** 3-5 minutes (automatic)
- **Verification:** ~9 minutes (Phases 1-3)
- **Documentation:** ~10 minutes (Phase 4-5)
- **Completion:** ~25-30 minutes total

---

## 🎯 Success Criteria

✅ **All items below must be true:**

- [ ] `ldd --version` shows glibc
- [ ] `ps aux | grep ollama` shows running process
- [ ] `curl http://127.0.0.1:11434/api/tags` returns status 200
- [ ] Continue extension appears in `code --list-extensions`
- [ ] `Ctrl+I` opens Continue panel in VS Code
- [ ] Continue can send prompt to Ollama
- [ ] Model responds within 5 seconds
- [ ] `API.md` has updated timestamp
- [ ] `resumefromhere.txt` documents completion

---

## 📞 Getting Help

If you get stuck:

1. **Check logs:**
   ```bash
   bash .devcontainer/status-dashboard.sh
   ```

2. **Run verification:**
   ```bash
   bash .devcontainer/rebuild-and-verify.sh
   ```

3. **Review REBUILD_GUIDE.md:**
   ```bash
   cat REBUILD_GUIDE.md
   ```

4. **Check automation logs:**
   ```bash
   ls -la /tmp/qmoi-bootstrap/
   cat /tmp/qmoi-bootstrap/*.log
   ```

---

**Status:** Ready for post-rebuild verification
**Last Updated:** Generated during session 2026-07-10

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:41.670825Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 299
- words: 1018
- characters: 7202
- headings: 52
- links: 0
- images: 0
- tables: 8
- lion validation block: present
<!-- LION_VALIDATION_END -->
