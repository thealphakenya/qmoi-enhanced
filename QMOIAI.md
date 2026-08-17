# QMOIAI.md - QMOI AI System Specification

## Overview
QMOIAI is the AI and orchestration layer responsible for autonomous repository validation, sync upgrades, and recovery flows.

## Responsibilities
- validate platform readiness
- coordinate GitHub automation
- inspect and repair repository structure
- maintain memory and checkpoint state
- trigger workflow updates and sync operations
- enforce accountability and master instruction compliance

## Core Components
- Ollama Autonomous Agent
- resilience coordinator
- workflow monitor
- checkpoint and memory index
- PR proof contract

## Operational Rules
- must remain GitHub-hosted and independent from local tooling
- must survive degraded repo state
- must auto-heal missing or broken internal files
- must keep all critical docs and workflows available
