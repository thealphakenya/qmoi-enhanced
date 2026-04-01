# UTILS.md - Utility Scripts & Health Tools

**Last Updated**: 2026-04-01
**Status**: ✅ production Ready

## Overview

This document tracks utility scripts used for system health, diagnosis, and maintenance.

## Key utility scripts

- `scripts/host_reachability_check.py` - Host-level reachability checker for Node/npm/pm2, local endpoints, and remote domains
- `scripts/domain_health_check.py` - Domain/URL content health scanner and production marker detection
- `scripts/generate_production_status.py` - Production readiness marker extractor
- `scripts/prod-healthcheck.sh` - Production health check orchestration script

## Integration

- Used by infrastructure automation in `pm2` and deployment pipelines
- Logs written to `logs/host_reachability_report.txt`, `logs/domain_health_check.log`, and `data/*` health artifacts

## Maintenance

- Keep scripts in sync with PATH updates and tool availability
- Ensure `scripts/host_reachability_check.py` is in README and TOOLS docs
- Update this file whenever new utility manager scripts are added
