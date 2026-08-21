# QMOI Model Card

## Overview

QMOI (Quantum Multi Orchestra Intelligence) is the autonomous intelligence
platform validated by the QMOI repository automation contract.

## Intended Use and Boundaries

QMOI is intended for assistive software development, conversation, file
management, media workflows, and repository automation. It must surface
uncertainty, preserve user control, and require human review for destructive
Git operations, external publication, security-sensitive changes, and claims
that cannot be verified from available evidence.

QMOI is not a substitute for professional medical, legal, financial, or
safety-critical advice. Outputs require human verification before they are
used in those contexts.

## Core Model Qualities

- Evidence-grounded reasoning with explicit assumptions and uncertainty
- Creative solution generation followed by deterministic validation
- Deep analysis of repository structure, history, tests, and contracts
- Safe bounded autonomy with retry budgets and circuit breaking
- Reproducible outputs with timestamps, versions, and provenance
- Privacy-aware handling of credentials, personal data, and external sources
- Cross-platform compatibility and graceful degradation
- Clear separation of facts, hypotheses, recommendations, and actions
- Human approval gates for merges, pushes, releases, and irreversible changes
- Continuous quality, reliability, latency, and failure-rate measurement

## Research and Learning Policy

The autonomous agent performs internal research from repository files, tests,
workflow definitions, Git history, tracker evidence, and model artifacts. When
external research is enabled, it uses authenticated, bounded, read-only
retrieval, records source URLs and retrieval timestamps, and treats external
content as untrusted input. Research findings are hypotheses until tests or
primary-source evidence confirm them; no network access is required for the
local validation path.

## Model Test Plan

The agent must run the model contract checks with every full validation:

1. Verify this card and its required sections are generated.
2. Verify model inputs and outputs remain schema-valid and serializable.
3. Verify uncertainty, safety boundaries, and human-review gates are present.
4. Verify research provenance fields are available for external findings.
5. Verify deterministic repeated validation produces the same quality result.
6. Record pass/fail status, duration, evidence path, and failure category.

Recommended command: `python3 scripts/ollama_autonomous_agent.py validate-all`.

## Applications

### QMOIAIUI

Conversational AI interface.

### QCity

File Manager.

### QMOI Space

Media Player.

### QALPHA

IDE.

## Validation Contract

The autonomous validation contract covers:

- Windows
- macOS
- Linux
- iOS
- Android
- Web
- Platform-specific features
- File-handler registration
- GitHub automation
- Cross-repository synchronization
- Realtime telemetry
- Auto-healing
- Resume checkpoints
- Memory index generation
- Model-card generation
- GitHub proof contracts
- Model safety, quality, provenance, and reproducibility checks
