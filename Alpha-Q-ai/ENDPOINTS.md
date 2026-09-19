# ENDPOINTS.md - Consolidated Endpoint Map

## Purpose
This document lists the endpoint families used by the QMOI system and the repository automation stack.

## Endpoint Inventory

### Core System
- /health
- /status
- /ready
- /metrics
- /version
- /repo/inventory
- /repo/history
- /repo/structure

### GitHub / PR
- /github/pull-requests
- /github/workflows
- /github/branches
- /github/trigger
- /github/validate
- /github/proof-contract
- /github/dispatch
- /github/trigger-workflow

### Sync & Repo Ops
- /sync/branches
- /sync/main
- /sync/backup
- /sync/reconcile
- /sync/monitor
- /sync/reconcile-history
- /sync/qmoi-enhanced
- /sync/alpha-q-ai
- /sync/merge

### Agent & Automation
- /agent/run
- /agent/validate
- /agent/validate-all
- /agent/validate-platforms
- /agent/validate-features
- /agent/repair
- /agent/recover
- /agent/checkpoint
- /agent/health
- /agent/summary

### Model & Evolution
- /model/evolution
- /model/stages
- /model/countdown
- /model/status
- /model/files
- /model/memory

### File and History Inventory
- /files/index
- /files/markdown
- /files/repo-tree
- /files/archive-scan
- /history/all-repos
- /history/branches
- /history/refs
- /history/clones

### Historical / Clone Coverage
- /history/qmoi-enhanced
- /history/alpha-q-ai
- /history/qmoi-enhanced-history-14
- /history/archives
- /history/snapshots

## Notes
This document is the canonical operational endpoint registry for the repository and its historical snapshots, and it must remain aligned with the live automation, GitHub dispatchers, and cross-repo agent implementation.
