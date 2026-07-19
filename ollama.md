# Ollama Autonomous Agent Guide

This guide explains how to run Ollama as a fully autonomous local agent in the QMOI Enhanced repository.
It contains exact runtime issues, permanent fixes, and the validated script to instruct Ollama to complete everything in `resumefromhere.txt`.

## Why this guide exists

- Ollama can operate independently of the Continue extension.
- The repository uses a local Ollama runtime at `http://127.0.0.1:11434`.
- The agent workflow reads `resumefromhere.txt` and drives bulk, parallel, self-correcting work.
- This guide documents live Ollama errors, root causes, and permanent fixes.

## Core workflow

- Ensure Ollama CLI and local server are installed and running.
- Ensure `qwen2.5-coder:3b` is available locally.
- Read actionable tasks from `resumefromhere.txt` and backlog files.
- Send a production-grade prompt to Ollama.
- Stream progress to the terminal.
- Update `resumefromhere.txt` with progress and verification blocks.
- Run the continuation helper after the agent completes.
- Follow the self-contained automation requirements from `copilotchat.md`: do not depend on Continue, do not require Copilot Chat, and keep `resumefromhere.txt` as the canonical tracker.

## Documentation Index

Fetch the complete Ollama documentation index at:

```text
https://docs.ollama.com/llms.txt
```

Use this file to discover all available pages before exploring further. It is the authoritative reference for Ollama CLI commands, model names, runtime options, and integration guidance.

## Validated run command

Use the canonical agent script:

```bash
python3 scripts/ollama_autonomous_agent.py --continue
```

This script will:

- start or verify the Ollama service
- pull the model if missing
- generate `TREE_FULL_STRUCTURE.md` and update `TREE.md` with canonical repo structure guidance
- extract tasks from `resumefromhere.txt`
- instruct Ollama to work in bulk and parallel when safe
- verify each task with markers like [IN PROGRESS], [DONE], [VERIFY], [CONFIRMED]
- append progress and summary blocks to `resumefromhere.txt`
- run `scripts/auto_continue_resumefromhere.py` automatically when the agent succeeds

## Full structure and documentation references

- `TREE.md` is the canonical app tree and structure index for the repo.
- `TREE_FULL_STRUCTURE.md` is generated on each autonomous agent run and contains the full repository file listing.
- `ollama.md` should always document the current canonical Ollama workflow and the script used to drive the bulk tracker.
- Reference the Ollama docs directly from:
  - `https://docs.ollama.com/llms.txt`
  - `https://docs.ollama.com/command-reference`
  - `https://docs.ollama.com/` for the latest CLI and API semantics.

## Execution and verification rules

The agent now uses strict success criteria to avoid false-positive completion.

- `ollama` responses must include explicit verification markers or a completed task list.
- `done: true` from the Ollama API is not sufficient by itself.
- The agent requires evidence of final completion, such as:
  - `FINAL COMPLETION SUMMARY`
  - `CONFIRMED` and `VERIFY` markers together
  - an explicit task list where all statuses are `DONE`, `CONFIRMED`, or `VERIFIED`
- If verification fails, the script will retry the prompt and will not mark the run as complete until the output is verified.

## CLI Reference

### Run a model

```bash
ollama run gemma4
```

### Launch integrations

```bash
ollama launch
```

Configure and launch external applications to use Ollama models. This provides an interactive way to set up and start integrations with supported apps.

#### Supported integrations

* **OpenCode** - Open-source coding assistant
* **Claude Code** - Anthropic's agentic coding tool
* **Codex** - OpenAI's coding assistant
* **VS Code** - Microsoft's IDE with built-in AI chat
* **Droid** - Factory's AI coding agent

#### Examples

Launch an integration interactively:

```bash
ollama launch
```

Launch a specific integration:

```bash
ollama launch claude
```

Launch with a specific model:

```bash
ollama launch claude --model qwen3.5
```

Configure without launching:

```bash
ollama launch droid --config
```

#### Multiline input

For multiline input, you can wrap text with `"""`:

```bash
>>> """Hello,
... world!
... """
I'm a basic program that prints the famous "Hello, world!" message to the console.
```

#### Multimodal models

```bash
ollama run gemma4 "What's in this image? /Users/jmorgan/Desktop/smile.png"
```

### Generate embeddings

```bash
ollama run embeddinggemma "Hello world"
```

Output is a JSON array:

```bash
echo "Hello world" | ollama run nomic-embed-text
```

### Download a model

```bash
ollama pull gemma4
```

### Remove a model

```bash
ollama rm gemma4
```

### List models

```bash
ollama ls
```

### Sign in to Ollama

```bash
ollama signin
```

### Sign out of Ollama

```bash
ollama signout
```

### Create a customized model

First, create a `Modelfile`

```text
FROM gemma4
SYSTEM """You are a happy cat."""
```

Then run `ollama create`:

```bash
ollama create -f Modelfile
```

### List running models

```bash
ollama ps
```

### Stop a running model

```bash
ollama stop gemma4
```

### Start Ollama

```bash
ollama serve
```

To view a list of environment variables that can be set run `ollama serve --help`

## Ollama CLI reference

The current Ollama CLI uses `run`, not `generate`.

Example direct CLI usage:

```bash
~/.ollama/bin/ollama run qwen2.5-coder:3b "Hello world"
```

If the model is missing:

```bash
~/.ollama/bin/ollama pull qwen2.5-coder:3b
```

If the local server is required:

```bash
~/.ollama/bin/ollama serve
```

## Known Ollama runtime issues and permanent fixes

### 1. `Ollama agent prompt failed` / `unknown command "generate"`

Cause:
- The repository previously used `ollama generate`, but the installed Ollama CLI now uses `ollama run`.

Permanent fix:
- The agent script has been updated to use:
  ```bash
  echo "..." | ollama run qwen2.5-coder:3b
  ```
  or equivalently:
  ```bash
  ollama run qwen2.5-coder:3b "..."
  ```
- The `scripts/ollama_autonomous_agent.py` file is the canonical agent entrypoint.

### 2. `llama-server binary not found` even when `~/.ollama/bin/llama-server` exists

Cause:
- Ollama checks for `llama-server` in several expected locations.
- The runtime may still fail if shared libraries or the correct build path are not available.
- `ollama` may be launching a different runtime environment than the one in `~/.ollama/bin`.

Permanent fix:
- Build the runtime from source with the repository helper.
- Ensure the runtime binary is installed into `~/.ollama/bin/llama-server`.
- Ensure necessary shared libs are available under `~/.ollama/source/build/llama-server-cpu/bin`.

Validated fix command:

```bash
bash .devcontainer/build-ollama-from-source.sh
```

After build, confirm:

```bash
ls -l ~/.ollama/bin/ollama ~/.ollama/bin/llama-server
~/.ollama/bin/llama-server --version
```

### 3. `llama-server process has terminated: exit status 1`

Cause:
- `ollama` starts the runtime, but the child `llama-server` process exits immediately.
- This can happen due to insufficient runtime libraries, missing model binaries, or a stale build path.

Permanent fix:
- Confirm `llama-server` runs independently:
  ```bash
  LD_LIBRARY_PATH=$HOME/.ollama/source/build/llama-server-cpu/bin ~/.ollama/bin/llama-server --help
  ```
- If the binary does not start normally, rebuild the runtime.
- Make sure the build output contains these files:
  - `~/.ollama/bin/llama-server`
  - `~/.ollama/source/build/llama-server-cpu/bin/libllama-server-impl.so`
  - `~/.ollama/source/build/llama-server-cpu/bin/libllama-common.so.0`

### 4. `POST /api/generate` returns 500 from Ollama server

Cause:
- The Ollama HTTP server is reachable, but the model runtime backend failed to start.
- The 500 error is typically triggered by the same `llama-server` startup failure.

Permanent fix:
- Fix the underlying runtime binary and library path issue.
- Verify the model is installed locally:
  ```bash
  curl -sS http://127.0.0.1:11434/api/tags
  ```
- Confirm the model name appears as `qwen2.5-coder:3b`.

### 5. `POST /api/completions` returns 404

Cause:
- The local Ollama server supports `/api/generate` and `/api/chat`, not the legacy `/api/completions` endpoint.

Permanent fix:
- Use the supported endpoint or CLI command.
- The agent script now uses the local Ollama CLI instead of the unsupported endpoint.

## Recommended verification steps

1. Verify Ollama service is available:
   ```bash
   curl -sS http://127.0.0.1:11434/api/tags
   ```
2. Verify the model is present:
   ```bash
   ~/.ollama/bin/ollama list | grep qwen2.5-coder:3b
   ```
3. Verify the runtime binary exists:
   ```bash
   ls -l ~/.ollama/bin/llama-server
   ~/.ollama/bin/llama-server --version
   ```
4. Run the agent script:
   ```bash
   python3 scripts/ollama_autonomous_agent.py --continue
   ```
5. Inspect `resumefromhere.txt` for appended progress and confirmation blocks.

## Full script chain

The canonical agent workflow is:

1. `bash .devcontainer/ensure-ollama.sh`
2. `bash .devcontainer/build-ollama-from-source.sh` (if runtime rebuild is needed)
3. `python3 scripts/ollama_autonomous_agent.py --continue`
4. `scripts/auto_continue_resumefromhere.py` is run automatically by the agent after success

## Logs to inspect

- `~/.ollama/logs/serve.log`
- `~/.ollama/logs/daemon.log`
- `~/.ollama/logs/ollama_autonomous_agent.log`
- `~/.ollama/logs/auto-continue.log`

## Permanent best fix checklist

- [x] Use `ollama run` instead of `ollama generate`.
- [x] Keep `~/.ollama/bin/llama-server` present and executable.
- [x] Keep `~/.ollama/bin/ollama` present and executable.
- [x] Build runtime with `.devcontainer/build-ollama-from-source.sh` when any Ollama source build changes.
- [x] Keep `~/.ollama/source/build/llama-server-cpu/bin` available for shared runtime libraries.
- [x] Use `scripts/ollama_autonomous_agent.py --continue` as the agent entrypoint.
- [x] Keep `resumefromhere.txt` as the canonical progress tracker.
- [x] After the agent completes, verify `resumefromhere.txt` contains [DONE] and [CONFIRMED] markers.

## Notes

- If the environment is Alpine/musl, the container should still support the local Ollama runtime via the source build and runtime compatibility path.
- If `ollama serve` fails because of libc issues, use the container rebuild or glibc compatibility fallback from `.devcontainer/ensure-ollama.sh` and `.devcontainer/auto-continue-daemon.sh`.
- This guide is the canonical reference for Ollama issues in this repository.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:24.199599Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 394
- words: 1496
- characters: 11087
- headings: 37
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
