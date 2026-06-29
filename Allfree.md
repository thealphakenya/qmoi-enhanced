# Allfree: 100% Free, Unlimited, and Persistent AI Agent Environment

## Overview
This guide establishes a production-grade, completely free AI agent environment inside GitHub Codespaces using Ollama and the Continue extension. Your code never leaves your secure environment—zero leakage, zero mock services.

---

## Key Principles
- **Zero Leakage**: All code processing happens locally on your Codespace
- **Unlimited Usage**: No API rate limits or subscription costs
- **Persistent**: Models and configuration survive Codespace rebuilds
- **Production-Grade**: Environment variables and volume mounts ensure stability
- **Instant Assistance**: OLLAMA_KEEP_ALIVE ensures the model stays in RAM

---

## 1. The Configuration (.devcontainer/devcontainer.json)

Create or update `.devcontainer/devcontainer.json` in your repository root:

```json
{
  "name": "Qmoi-Production-Agent-Environment",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu-22.04",
  "customizations": {
    "vscode": {
      "extensions": [
        "continue.continue"
      ],
      "settings": {
        "continue.telemetry": false
      }
    }
  },
  "postCreateCommand": "curl -fsSL https://ollama.com/install.sh | sh && ollama serve > /dev/null 2>&1 & sleep 5 && ollama pull qwen2.5-coder:3b",
  "mounts": [
    "source=ollama_data,target=/root/.ollama,type=volume"
  ],
  "containerEnv": {
    "OLLAMA_KEEP_ALIVE": "-1",
    "OLLAMA_FLASH_ATTENTION": "1"
  }
}
```

### Configuration Breakdown

| Component | Purpose |
|-----------|---------|
| `name` | Identifies this as your production agent environment |
| `image` | Ubuntu 22.04 base with full dev tools |
| `extensions` | Installs Continue extension automatically |
| `settings` | Disables telemetry for privacy |
| `postCreateCommand` | Installs Ollama + automatically pulls qwen2.5-coder:3b model (~2GB) |
| `mounts` | Persists model data across rebuilds |
| `OLLAMA_KEEP_ALIVE: -1` | Keeps model loaded in RAM indefinitely |
| `OLLAMA_FLASH_ATTENTION: 1` | Enables optimized inference |

---

## 2. How to Connect the Agent (One-Time Setup)

### Step 1: Rebuild Your Codespace
Push the `.devcontainer/devcontainer.json` to your repository and rebuild your Codespace:
```bash
git add .devcontainer/devcontainer.json
git commit -m "feat: add production-grade ollama AI environment"
git push
```

Then in GitHub, click "Rebuild container" to trigger the postCreateCommand.

### Step 2: Verify Ollama is Running
```bash
curl http://localhost:11434/api/tags
```

Expected output shows your model is available:
```json
{
  "models": [
    {
      "name": "qwen2.5-coder:3b:latest",
      "modified_at": "2024-...",
      "size": 2000000000,
      "digest": "..."
    }
  ]
}
```

### Step 3: Open Continue in VS Code
1. Click the **Continue icon** in the VS Code sidebar (left panel)
2. Click the **gear icon** ⚙️ at the bottom right of the Continue panel
3. This opens `config.json` in your editor

### Step 4: Configure the Model
Replace the `models` array in your Continue `config.json`:

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

### Step 5: Test the Connection
In Continue, type a simple prompt:
```
Write a hello world function in JavaScript
```

You should see the model respond instantly (model is already loaded in RAM).

---

## 3. Why This Configuration Works Best

| Feature | Benefit |
|---------|---------|
| **Local Execution** | Zero API calls, zero data leakage—everything stays on your Codespace |
| **Persistent Volume** | Model survives container rebuilds via Docker named volume |
| **Instant Response** | OLLAMA_KEEP_ALIVE=-1 keeps qwen2.5-coder:3b loaded in RAM (~3GB) |
| **Small Footprint** | qwen2.5-coder:3b is ~2GB—faster downloads and lower resource usage than larger models |
| **Production Grade** | Environment variables ensure reliability and optimal performance |
| **Zero Cost** | No subscriptions, no API limits, no rate-limiting |
| **Always On** | Ollama runs as background daemon—ready instantly when you return to your Codespace |

---

## 4. Advanced: Customizing Your Ollama Setup

### Pull Additional Models
```bash
# Pull other models if needed
ollama pull qwen2.5:7b          # More capable (7B parameters)
ollama pull mistral             # Alternative general-purpose model
ollama pull neural-chat         # Optimized for chat
```

### Switch Default Model in Continue
Update your Continue `config.json` to use a different model:
```json
{
  "models": [
    {
      "title": "Local Qwen 7B",
      "provider": "ollama",
      "model": "qwen2.5:7b"
    }
  ]
}
```

### Monitor Ollama Performance
```bash
# Check running processes
ps aux | grep ollama

# Monitor model memory usage
free -h

# View Ollama logs
tail -f ~/.ollama/logs/
```

---

## 5. Troubleshooting

### Verified environment status (2026-06-28)
- Ollama is now running locally at http://127.0.0.1:11434
- The model qwen2.5-coder:3b is installed and responding to requests
- Continue is configured to use the local Ollama endpoint via ~/.continue/config.json
- The workspace is ready for Continue-based bulk operations


| Problem | Solution |
|---------|----------|
| **Continue shows "No model available"** | Verify Ollama is running: `curl http://localhost:11434/api/tags` |
| **Model takes 30+ seconds to respond** | Model might not be loaded. Check: `ps aux \| grep ollama` or wait for first response (caches after) |
| **Codespace rebuilds lose the model** | Verify `mounts` in devcontainer.json is present and Docker volume is preserved |
| **Ollama not starting after rebuild** | SSH into Codespace and run: `ollama serve > /dev/null 2>&1 &` |
| **"Connection refused" error** | Ensure Ollama is running on port 11434: `netstat -tulpn \| grep 11434` |

---

## 6. Integration with Your Codebase

### Update API.md
Document your local Ollama API endpoints:
- **Base URL**: `http://localhost:11434`
- **Models Endpoint**: `GET /api/tags`
- **Generate Endpoint**: `POST /api/generate`
- **Chat Endpoint**: `POST /api/chat`

### Update ENDPOINTS.md
Add to your endpoints documentation:
```
## Local Ollama Endpoints (Free AI Agent)

### GET /api/tags
Lists available models
**Response**: `{ "models": [ { "name": "qwen2.5-coder:3b", ... } ] }`

### POST /api/generate
Generate completions from a prompt
**Request**: `{ "model": "qwen2.5-coder:3b", "prompt": "...", "stream": false }`
**Response**: `{ "response": "...", "done": true }`

### POST /api/chat
Chat interface (similar to OpenAI)
**Request**: `{ "model": "qwen2.5-coder:3b", "messages": [...] }`
**Response**: Streaming or complete message response
```

### Update ROUTES.md

## 7. Automation & Devcontainer Integration

To ensure every Codespace automatically installs and configures Ollama and the Continue extension, this repository includes hardened devcontainer automation and helper scripts.

### What is automated
- `.devcontainer/ensure-ollama.sh` installs Ollama if missing, starts the service if it is down, and pulls `qwen2.5-coder:3b`.
- `.devcontainer/start-auto-continue.sh` starts a lightweight background daemon that keeps Ollama alive and restarts it if needed.
- `.devcontainer/open-continue.sh` installs Continue if it is missing and attempts to open it in the VS Code UI.
- `.devcontainer/run-bulk-once.sh` runs the documentation and merge scripts once per container lifecycle.
- `.devcontainer/devcontainer.json` runs the startup helpers on create/start/attach to make the environment self-healing.
- `.vscode/settings.json` and `.vscode/extensions.json` ensure the Continue extension is recommended and configured for this repo.

### Recommended workflow for any new Codespace
```bash
# 1) Let the devcontainer bootstrap run automatically
# 2) If needed, run the helpers manually
bash .devcontainer/ensure-ollama.sh
bash .devcontainer/start-auto-continue.sh
bash .devcontainer/open-continue.sh

# 3) Regenerate canonical docs when routes or APIs change
python3 scripts/consolidate_api_endpoints.py
```

### How to use Continue automatically
1. Open the repository in a Codespace.
2. The devcontainer will install Continue and Ollama automatically.
3. Open the Continue panel with Ctrl+I if the UI does not appear immediately.
4. Start with `@bulk-consolidate-api` or `@bulk-update-docs`.
5. Continue will keep working across the repo until the task is complete.

### Recovery and stability notes
- The startup scripts use lock files so repeated lifecycle events do not retrigger the same setup repeatedly.
- The devcontainer now uses a non-blocking bootstrap entry point so installs and model pulls do not hang the container during startup.
- The devcontainer is configured to run the startup helpers on create, start, and attach events to recover from transient restarts.
- If the panel does not open automatically in a given Codespace build, the extension is still installed and available in the VS Code UI; use Ctrl+I to open it.
- Ollama and Continue are treated as persistent state: once installed and verified, the scripts skip redundant reinstall work and prefer recovery over fresh installation.

## 8. Continue: Setup, Usage, and Always-Automatic Configuration

This repository includes automation to install, configure, and use the Continue extension together with a local Ollama instance. The automation is best-effort and attempts to make the workspace "always continue" — i.e., on every Codespace open the environment will try to install Ollama, pull the recommended model, install Continue, run an initial consolidation pass, and focus the Continue panel when possible.

Files and helpers added for this purpose:
- `.devcontainer/ensure-ollama.sh` — ensures Ollama is installed, starts the service, and pulls `qwen2.5-coder:3b` if missing.
- `.devcontainer/start-auto-continue.sh` — starts the auto-continue background daemon which monitors Ollama and restarts it if needed.
- `.devcontainer/open-continue.sh` — best-effort helper that calls the VS Code CLI to focus the Continue panel (works where the Code CLI supports `--command`).
- `.devcontainer/run-bulk-once.sh` — runs `scripts/consolidate_api_endpoints.py` and `scripts/merge_executor.py` (if present) to perform the initial bulk consolidation pass.
- `.vscode/extensions.json` — recommends the `continue.continue` extension for the workspace.
- `.vscode/settings.json` — workspace settings to minimize noise and disable Continue telemetry.

Devcontainer hooks
The devcontainer will run these helpers automatically via `postStartCommand`:

```bash
bash .devcontainer/ensure-ollama.sh || true
bash .devcontainer/start-auto-continue.sh || true
bash .devcontainer/open-continue.sh || true
bash .devcontainer/run-bulk-once.sh || true
```

Manual commands (copy-paste)
If you need to run the setup manually in a Codespace or local dev container, run:

```bash
# Ensure Ollama installed and running
bash .devcontainer/ensure-ollama.sh

# Start the auto-continue daemon
bash .devcontainer/start-auto-continue.sh

# Install Continue extension (if VS Code CLI available)
code --install-extension continue.continue || true

# Attempt to open Continue (best-effort)
bash .devcontainer/open-continue.sh || true

# Run a one-time bulk consolidation pass
bash .devcontainer/run-bulk-once.sh || true
```

Notes and caveats
- The `open-continue.sh` helper uses the VS Code CLI (`code --command`) which some Codespace CLI builds ignore; when `code` ignores `--command`, automatic focusing of the Continue panel is not available. In that case Continue is still installed and configured — open it manually with Ctrl+I.
- The devcontainer installs the `continue.continue` extension via the `customizations.vscode.extensions` list in `.devcontainer/devcontainer.json` so that Codespaces will add the extension automatically on container create/start.
- We cannot reliably force a UI view to open in every remote environment using shell scripts alone; the best robust approach is a small helper VS Code extension that activates on workspace open and calls the Continue command. If you want, I can add such an extension to this repo and wire it into the devcontainer to guarantee the panel opens.

Advanced: Guaranteed open via a helper extension (optional)
If absolute reliability is required (auto-open on every Codespace regardless of CLI), we can add a tiny VS Code extension that:

- Declares a dependency on `continue.continue` in `package.json` and lists an `activationEvent` of `*` so it runs on startup.
- On activation, calls `vscode.commands.executeCommand('continue.open')` (or other Continue command) to focus the panel.

This repo currently uses a best-effort `open-continue.sh` and devcontainer wiring. Tell me if you want me to add the helper VS Code extension and I will scaffold, test, and wire it into `.devcontainer/devcontainer.json`.


Add routing information:
```
## Local AI Routes

- `ollama serve` → Runs on `localhost:11434` (persistent background daemon)
- Continue Extension → Auto-connects to `http://localhost:11434` (configured in config.json)
- Qwen2.5-Coder:3b → Automatically pulled and cached by postCreateCommand
```

---

## 7. Quick Start Checklist

- [ ] Push `.devcontainer/devcontainer.json` to repository
- [ ] Rebuild GitHub Codespace
- [ ] Wait for postCreateCommand to complete (~5-10 minutes first time)
- [ ] Verify Ollama: `curl http://localhost:11434/api/tags`
- [ ] Open Continue panel in VS Code
- [ ] Click Settings (gear icon) and configure models
- [ ] Test with a simple prompt
- [ ] Update API.md, ENDPOINTS.md, ROUTES.md with Ollama documentation
- [ ] Start coding with unlimited, free AI assistance!

---

## 8. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Codespace                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────────────┐    │
│  │  VS Code Editor  │──────│  Continue Extension      │    │
│  └──────────────────┘      └──────────────────────────┘    │
│              │                        │                      │
│              │                        │ (config.json)        │
│              │                        │                      │
│              └────────────────────────┘                      │
│                        │                                     │
│                        ▼ HTTP                                │
│              ┌──────────────────────┐                        │
│              │  Ollama (localhost:  │                        │
│              │     11434)           │                        │
│              └──────────────────────┘                        │
│                        │                                     │
│              ┌─────────┴──────────┐                          │
│              ▼                    ▼                          │
│        ┌──────────────┐   ┌──────────────────────┐          │
│        │  Model: qwen │   │  Persistent Volume   │          │
│        │  2.5-coder:3b│   │  (/root/.ollama)     │          │
│        │  (RAM: 3GB)  │   │  → Model Cache       │          │
│        └──────────────┘   └──────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Security & Privacy

✅ **Your code never leaves your Codespace**
✅ **No telemetry** (disabled in devcontainer.json)
✅ **No external API calls** (everything runs locally)
✅ **No rate limiting** (unlimited usage)
✅ **No subscription costs** (100% free)

---

## 10. Next Steps

1. **Configure your workflow**: Update your IDE shortcuts to use Continue
2. **Customize models**: Experiment with different Ollama models
3. **Monitor performance**: Track resource usage and optimize
4. **Extend integrations**: Add Ollama API calls to your codebase
5. **Share configuration**: Distribute `.devcontainer/devcontainer.json` across your team

---

## Support & Resources

- **Ollama Documentation**: https://github.com/ollama/ollama
- **Continue Documentation**: https://docs.continue.dev/
- **Qwen2.5-Coder Model**: https://huggingface.co/Qwen/Qwen2.5-Coder-3B
- **GitHub Codespaces**: https://docs.github.com/en/codespaces

---

**Last Updated**: 2026-06-28  
**Status**: Production-Ready ✅
