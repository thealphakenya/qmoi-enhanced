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

### GitHub / PR
- /github/pull-requests
- /github/workflows
- /github/branches
- /github/trigger
- /github/validate

### Sync & Repo Ops
- /sync/branches
- /sync/main
- /sync/backup
- /sync/reconcile
- /sync/monitor

### Agent & Automation
- /agent/run
- /agent/validate
- /agent/repair
- /agent/recover
- /agent/checkpoint

### Model & Evolution
- /model/evolution
- /model/stages
- /model/countdown
- /model/status

## Notes
This document is the operational endpoint registry for the repository and should remain aligned with the live automation and agent implementation.
