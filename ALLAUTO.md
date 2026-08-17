# ALLAUTO.md - QMOI Automation Overview

## Purpose
This file lists the automation capabilities that keep the QMOI repositories self-maintaining, self-validating, and resilient.

## Automation Domains

### Repository Automation
- branch sync
- backup sync
- repository health checks
- validation on PR
- workflow monitoring
- issue and PR trigger management

### Agent Automation
- full validation suite
- platform validation
- feature validation
- auto-healing
- missing-file reconstruction
- syntax repair for Python and YAML
- checkpoint resume

### Recovery Automation
- missing file detection
- corruption detection
- YAML repair
- Python repair
- graceful degradation
- degraded-mode execution

## Governance
All automation is expected to remain self-hosted, GitHub-driven, and resilient to partial file-loss or syntax issues without requiring manual intervention.
