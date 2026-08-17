# API.md - QMOI Unified API Reference

## Overview
This document is the canonical API index for the QMOI ecosystem across the qmoi-enhanced and Alpha-Q-ai repositories. It consolidates the operational interfaces, automation hooks, and repository synchronization contracts used by the autonomous agent.

## API Categories

### 1. Repository Management APIs
- GET /repo/status
- GET /repo/structure
- POST /repo/sync
- POST /repo/validate
- POST /repo/resume

### 2. GitHub Integration APIs
- GET /github/token
- GET /github/branch-status
- POST /github/trigger-workflow
- POST /github/create-pr
- GET /github/proof-contract

### 3. Agent Runtime APIs
- POST /agent/validate-all
- POST /agent/validate-platforms
- POST /agent/validate-features
- POST /agent/auto-heal
- GET /agent/health
- POST /agent/checkpoint

### 4. Sync & Recovery APIs
- POST /sync/alpha-q-ai
- POST /sync/backups
- POST /sync/merge
- POST /sync/reconcile-docs
- POST /recover/files
- POST /recover/yaml
- POST /recover/python

## Core Contracts

### PR Validation Contract
The agent exposes a GitHub proof contract that validates:
- platform build checks
- feature validation matrix
- file-handler validation
- branch sync readiness
- memory-index generation

### Auto-Healing Contract
The resilience coordinator can repair:
- missing files
- corrupted files
- invalid YAML
- invalid Python syntax
- degraded runtime states

## Notes
This file is intentionally kept as a lightweight canonical interface index so the automation and sync layers remain transparent and reviewable.
