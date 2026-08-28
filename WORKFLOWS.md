# QMOI Workflow Contract

This file is the canonical workflow map for `qmoi-enhanced`. GitHub Actions are the independent execution environment; a codespace is never required.

## Execution Order

1. `ollama-pr-validation.yml` validates source, tests, documentation, and workflow structure.
2. `ollama-master-orchestrator.yml` coordinates validated main-branch work and dispatches the agent once.
3. `ollama-autonomous-agent.yml` checks out trusted `main`, installs dependencies, bootstraps Ollama, verifies `qwen2.5-coder:3b` with real inference, runs a bounded LLM repair loop, validates, checkpoints, uploads evidence, and enforces `OLLAMA_SUCCESS.json`.
4. `ollama-autonomous-agent-realtime-monitor.yml`, `workflow-tracker.yml`, and `pr-monitor.yml` observe runs and must report `SUCCESS` only from a passed contract.
5. `branch-sync.yml` maintains `main` and `autosync-backup`; cross-repository sync is explicit and must create auditable changes.

## Success Contract

The message `Autonomous agent executed successfully.` is valid only when `ollamatracks/OLLAMA_SUCCESS.json` has `final_status: SUCCESS` and all of these are true: Ollama healthy, model available, inference verified, LLM coding started, post-agent validation passed, and checkpoint created. A Python-only validation pass is not agent success.

## Bounds And Safety

`MAX_ITERATIONS`, `MAX_TASKS_PER_ITERATION`, and `MAX_RECOVERY_ATTEMPTS` bound work. Repeated failures, repeated model responses, invalid plans, protected paths, credentials, workflow edits, traversal, and untrusted checkpoints fail closed. Secrets are supplied through GitHub Actions secrets and are never sent in model prompts or tracking artifacts.

## Manual Execution

```bash
OLLAMA_MODEL=qwen2.5-coder:3b python scripts/ollama_autonomous_agent.py health
OLLAMA_APPLY_REPAIRS=false python scripts/ollama_autonomous_agent.py autonomous
```

Set `OLLAMA_APPLY_REPAIRS=true` only in a trusted, explicitly authorized run. Scheduled runs are bounded and use the same contract as manual runs; workflow recursion is prevented by trusted-branch and concurrency conditions.

## Evidence

Diagnostics live under `ollamatracks/`, including `OLLAMA_HEALTH.json`, `OLLAMA_SUCCESS.json`, telemetry, logs, and resume state. Failed or blocked runs upload diagnostics and do not emit success.

## Sister Repository

`Alpha-Q-ai` uses the same contract when its setup instructions in `zx.txt` are installed. Shared documentation and sync changes are classified, audited, validated, and proposed through a PR rather than copied blindly.
