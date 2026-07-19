# Continue + Ollama Local Workflow

This guide captures the verified local Ollama + Continue workflow for this repository.
It is designed for Alpine/musl hosts where the devcontainer rebuild path is not available,
and also works for the standard glibc devcontainer once the local Ollama service is running.

## 1. Purpose

- Use the local Ollama runtime at `http://127.0.0.1:11434`
- Keep Continue configured to target the local Ollama provider
- Provide a repeatable, robust startup and verification flow
- Preserve `resumefromhere.txt` tracking for every bulk operation

## 2. Build Ollama on Alpine (source-build fallback)

Run the repo helper:

```bash
bash .devcontainer/build-ollama-from-source.sh
```

This script:
- installs Alpine build dependencies
- clones the Ollama repository if needed
- builds the Ollama binary for the current host
- places the binary in `~/.ollama/bin/ollama`

Verify the binary and runtime:

```bash
ls -l ~/.ollama/bin/ollama ~/.ollama/bin/llama-server
~/.ollama/bin/ollama --version
```

## 3. Start and verify the local Ollama service

Start or ensure Ollama is running:

```bash
bash .devcontainer/ensure-ollama.sh
```

Then verify the service endpoint:

```bash
curl -sS http://127.0.0.1:11434/api/version
```

Expected result: valid JSON with version information.

## 4. Prepare Continue configuration

This repo already includes a repository-local Continue guide config in `.continue/config.json`.
It also prepares the runtime config in `~/.continue/config.json` when `.devcontainer/open-continue.sh` runs.

Run:

```bash
bash .devcontainer/open-continue.sh
```

That script ensures the local runtime config contains:

- `provider`: `ollama`
- `model`: `qwen2.5-coder:3b`
- `apiBase`: `http://127.0.0.1:11434`
- `useLocalOllamaByDefault`: `true`

## 5. Install and open Continue

Continue installation is intentionally opt-in.
If the extension is not already installed, install it from the VS Code Marketplace.

Then open the Continue panel in VS Code and confirm it is using the local Ollama provider.

## 6. Verify local Continue config

Check the runtime config:

```bash
cat ~/.continue/config.json | grep -E 'ollama|apiBase|useLocalOllamaByDefault'
```

Confirm the output includes the local endpoint and model name.

## 7. What to do next

- Keep the local Ollama service running before launching bulk work
- Use `resumefromhere.txt` to record every major step
- Run bulk consolidation or merge workflows once Continue is active
- Use `python3 scripts/ollama_autonomous_agent.py --continue` as the preferred self-directed bulk workflow when Continue is unavailable or optional
- If the host rebuild path is available, prefer the `.devcontainer` glibc devcontainer for long-term stability

## 8. Troubleshooting

If the Ollama binary fails to start on Alpine:

- Confirm the host is Alpine/musl with `ldd --version`
- Confirm the built binary exists at `~/.ollama/bin/ollama`
- Confirm the local port is open:
  ```bash
  curl -sS http://127.0.0.1:11434/api/version
  ```
- If `Continue` does not connect, restart VS Code and reopen the Continue panel
- If the config was not written, rerun `bash .devcontainer/open-continue.sh`

## 9. Notes

This file is the canonical local Ollama + Continue workflow for the repo.
Keep it updated whenever the startup scripts or Continue settings change.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:46.874592Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 128
- words: 535
- characters: 3804
- headings: 11
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
