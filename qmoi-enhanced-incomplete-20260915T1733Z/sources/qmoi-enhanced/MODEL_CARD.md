# QMOI Model Card

## Overview

QMOI is the production autonomous intelligence runtime for the repository. It continuously validates platforms, apps, routes, APIs, file integrity, model health, and GitHub-hosted execution while preserving a live checkpoint and self-healing loop.

## Model

- Model: qwen2.5-coder:3b
- Host: http://127.0.0.1:11434
- Runtime: github-hosted + terminal keepalive

## Production Contract

- Always validate cross-platform and app feature coverage
- Maintain resume checkpoints and telemetry
- Auto-heal workflow and infrastructure failures
- Refresh memory and model docs in every cycle
- Verify local and GitHub-hosted execution before claiming success
