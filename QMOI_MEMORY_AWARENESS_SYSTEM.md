# QMOI_MEMORY_AWARENESS_SYSTEM.md

This document describes the memory-aware operational architecture of the QMOI agent and its credential-aware autonomous behavior.

## Purpose
- Track the repository’s active memory layers, credential stores, and automation awareness.
- Document how the Ollama autonomous agent discovers finance integrations, updates credential manifests, and preserves resume state.
- Serve as a canonical reference for secure account automation and master authorization gating.

## Autonomous execution surface
- Primary entrypoint: `python scripts/ollama_autonomous_agent.py`.
- GitHub workflow triggers: `.github/workflows/ollama-autonomous-agent.yml` and `.github/workflows/ollamatrigger.yml`.
- Default runtime behavior: `AUTO_CONTINUE=1`, `AUTO_PUSH=1`, `TARGET_BRANCH=autosync`.

## Credential and account automation
- The agent discovers finance and payment provider integrations by environment variable names and repository references only.
- It generates and maintains `FINANCE_CREDENTIALS.md` as the secure provisioning manifest for account automation.
- Live provisioning actions are gated by master authorization and are not executed without explicit approval.
- Secret values are never persisted by the agent; only env var names, sources, and secure guidance are recorded.

## Verification and persistence
- Persistent runtime state is stored in `.ollama_agent_state.json`.
- Execution progress and pending work are tracked in `resumefromhere.txt`.
- Live activity summaries are recorded in `OLLAMA_ACTIVITY_FEED.md`.
- The agent verifies required artifacts and documentation manifests before finalizing each run.

## Notes
- This document is part of the repository’s self-awareness inventory and is included in the agent’s documentation manifests.
- Keep this file synchronized with `ALLMDFILES.md`, `ALLLINKS.md`, `DOCS.md`, and `FINANCE_CREDENTIALS.md`.
