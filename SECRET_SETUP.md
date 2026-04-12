<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.743385Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

Secrets & CI setup for QMOI memory sync

To enable automated memory sync and protect `/sync/*` endpoints, add the following repository secrets in GitHub (Settings → Secrets → Actions):

- `QMOI_SYNC_BACKENDS` — comma-separated list of backends, e.g. `gist,hf` or `hf,scp:user@host:/path`
- `QMOI_GH_TOKEN` — GitHub token with `gist` or repo:permissions if using gist
- `QMOI_GIST_ID` — Gist ID to update when using `gist`
- `QMOI_HF_TOKEN` — Hugging Face token with `repo` write access
- `QMOI_HF_REPO` — Hugging Face repo id (e.g. `username/qmoi-memory`)
- `QMOI_SYNC_API_KEY` — Shared secret used by `/sync/*` endpoints (calls must include `Authorization: Bearer <key>`)

Notes:

- CI workflow `.github/workflows/qmoi-sync-memory.yml` runs `scripts/sync_memory.py`; it expects these secrets to be set.
- Keep tokens secret and rotate regularly. Prefer least-privilege tokens restricted to the single repo/gist.
- After setting secrets, verify by running the workflow manually (Actions → qmoi-memory-sync → Run workflow) or by pushing a commit.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

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

