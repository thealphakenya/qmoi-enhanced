# ROUTES.md - Route Map for QMOI Automation

## Route Overview
This file defines the main route families that connect the repository automation, GitHub workflows, and autonomous validation layers.

## Route Families

### Public Routes
- /README
- /BUILD
- /INSTALL
- /DOWNLOAD
- /MONITORING
- /SYNC
- /MERGE
- /MODELEVOLUTIONO

### Operational Routes
- /agent/validate-all
- /agent/validate-platforms
- /agent/validate-features
- /agent/auto-heal
- /agent/checkpoint
- /repo/status
- /repo/structure

### Sync Routes
- /sync/qmoi-enhanced
- /sync/alpha-q-ai
- /sync/backup
- /sync/reconcile
- /sync/monitor

### PR & Workflow Routes
- /pr/contract
- /pr/validate
- /pr/summary
- /workflow/run
- /workflow/monitor

## Implementation Notes
Routes are represented as contract-level guideposts and should remain consistent with GitHub Action triggers and the agent orchestration layer.
