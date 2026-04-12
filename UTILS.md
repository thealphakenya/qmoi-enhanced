<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-01T03:11:31.342517Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# UTILS.md - Utility Scripts & Health Tools ✅ PRODUCTION READY

**Last Updated**: 2026-04-01
**Status**: ✅ production Ready

## Overview

This document tracks utility scripts used for system health, diagnosis, and maintenance.

## Key utility scripts

- `scripts/host_reachability_check.py` - Host-level reachability checker for Node/npm/pm2, local endpoints, and remote domains
- `scripts/domain_health_check.py` - Domain/URL content health scanner and production marker detection
- `scripts/generate_production_status.py` - production readiness marker extractor
- `scripts/prod-healthcheck.sh` - production health check orchestration script

## Integration

- Used by infrastructure automation in `pm2` and deployment pipelines
- Logs written to `logs/host_reachability_report.txt`, `logs/domain_health_check.log`, and `data/*` health artifacts

## Maintenance

- Keep scripts in sync with PATH updates and tool availability
- Ensure `scripts/host_reachability_check.py` is in README and TOOLS docs
- Update this file whenever new utility manager scripts are added

## Purpose

Describe the purpose of this document and its scope.


## Auto-Update Instructions

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.



















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

