# API.md - QMOI Unified API Reference

## Overview
This document is the canonical API index for the QMOI ecosystem across the qmoi-enhanced and Alpha-Q-ai repositories. It consolidates the operational interfaces, automation hooks, and repository synchronization contracts used by the autonomous agent.

## API Categories

### 1. Repository Management APIs
- GET /repo/status
- GET /repo/structure
- GET /repo/inventory
- GET /repo/history
- POST /repo/sync
- POST /repo/validate
- POST /repo/resume
- POST /repo/normalize

### 2. GitHub Integration APIs
- GET /github/token
- GET /github/branch-status
- GET /github/proof-contract
- GET /github/workflows
- GET /github/history
- POST /github/trigger-workflow
- POST /github/create-pr
- POST /github/dispatch
- POST /github/sync-branch

### 3. Agent Runtime APIs
- POST /agent/validate-all
- POST /agent/validate-platforms
- POST /agent/validate-features
- POST /agent/auto-heal
- POST /agent/checkpoint
- POST /agent/recover
- GET /agent/health
- GET /agent/summary

### 4. Sync & Recovery APIs
- POST /sync/alpha-q-ai
- POST /sync/backups
- POST /sync/merge
- POST /sync/reconcile-docs
- POST /sync/reconcile-history
- POST /recover/files
- POST /recover/yaml
- POST /recover/python
- POST /recover/history

### 5. File Inventory APIs
- GET /files/index
- GET /files/markdown
- GET /files/repo-tree
- GET /files/archives
- POST /files/scan-all
- POST /files/normalize

### 6. Historical & Clone Coverage APIs
- GET /history/qmoi-enhanced
- GET /history/alpha-q-ai
- GET /history/all-repos
- GET /history/branches
- GET /history/refs
- GET /history/clones

## Core Contracts

### PR Validation Contract
The agent exposes a GitHub proof contract that validates:
- platform build checks
- feature validation matrix
- file-handler validation
- branch sync readiness
- markdown and inventory coverage
- history snapshot coverage
- memory-index generation

### Auto-Healing Contract
The resilience coordinator can repair:
- missing files
- corrupted files
- invalid YAML
- invalid Python syntax
- degraded runtime states
- missing API, route, and port inventory entries
- stale historical references

### Repository Inventory Contract
This system must maintain authoritative inventory records for:
- QMOI main repo
- Alpha-Q-ai repo
- qmoi-enhanced-history-14 archive
- all reachable refs and branches
- all Markdown, API, route, endpoint, and port docs
- all clone and backup histories

## Notes
This file is intentionally kept as the canonical interface and inventory index for the automation, sync layers, and historical repository audit process.
