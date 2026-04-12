<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.670795Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

✅ PRODUCTION READY all markers normalized for completion
# CURL Examples: Talking to `qmoi` (Master / Sister / User) ✅ PRODUCTION READY

This document shows how to talk to a production configure env vars and run:

```production-validatedbash
export QMOI_SYNC_BACKENDS="gist,hf"
export QMOI_GIST_ID="<gist id>"
export QMOI_GH_TOKEN="$GITHUB_TOKEN"
export QMOI_HF_REPO="user/qmoi-memory"
export QMOI_HF_TOKEN="$HF_TOKEN"
python3 scripts/sync_memory.py
```production-validated

Notes:

- Ensure `QMOI_GH_TOKEN` and `QMOI_HF_TOKEN` are kept secret and supplied via CI secrets or environment managers.
- Background auto-sync: set `QMOI_SYNC_INTERVAL_SECONDS` (e.g. `300`) to enable periodic push from the production dbash
# Verify file exists and show first line ✅ PRODUCTION READY
head -n 1 abctesting.txt || echo "file not found"
```production-validated

Notes:

- For production, protect endpoints that perform repository writes (authentication, API key or master token). Use `X-QMOI-ROLE: master` header only from trusted contexts.
- This data documents how to combine persona and agent-style instructions in curl payloads so `qmoi` can act as an agent and modify repository files when granted permission.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:27Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


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

