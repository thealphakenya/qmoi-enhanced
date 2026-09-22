# ROUTES.md - Route Map for QMOI Automation

## Route Overview
This file defines the main route families that connect the repository automation, GitHub workflows, and autonomous validation layers.

## Route Families

### Ollama autonomous agent and merge routes
- /agent/merge-history
- /agent/reconcile-markdown
- /agent/scan-archive
- /agent/validate-ui-styles
- /agent/validate-user-auth
- /agent/sync-documentation
- /agent/validate-routes
- /agent/validate-ports
- /agent/validate-history

### Public Routes
- /README
- /BUILD
- /INSTALL
- /DOWNLOAD
- /MONITORING
- /SYNC
- /MERGE
- /MODELEVOLUTIONO
- /API
- /ENDPOINTS
- /ROUTES
- /ALLPORTS
- /ALLMDFILESREFS

### Operational Routes
- /agent/validate-all
- /agent/validate-platforms
- /agent/validate-features
- /agent/auto-heal
- /agent/checkpoint
- /agent/recover
- /agent/summary
- /repo/status
- /repo/structure
- /repo/inventory
- /repo/history

### Sync Routes
- /sync/qmoi-enhanced
- /sync/alpha-q-ai
- /sync/backup
- /sync/reconcile
- /sync/reconcile-history
- /sync/monitor
- /sync/merge

### PR & Workflow Routes
- /pr/contract
- /pr/validate
- /pr/summary
- /workflow/run
- /workflow/monitor
- /workflow/dispatch
- /workflow/verify

### File and History Routes
- /files/index
- /files/markdown
- /files/archive-scan
- /history/all-repos
- /history/qmoi-enhanced
- /history/alpha-q-ai
- /history/qmoi-enhanced-history-14
- /history/branches
- /history/refs

## Implementation Notes
Routes are represented as contract-level guideposts and should remain consistent with GitHub Action triggers, branch sync goals, repository inventory logic, historical repo snapshots, and the autonomous orchestration layer.
