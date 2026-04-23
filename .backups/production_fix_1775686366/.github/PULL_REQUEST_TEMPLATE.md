<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.644588Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

<!-- Describe the purpose of this PR in one sentence -->

## Summary

This PR contains production-enablement changes for the local `qmoi` production server and supporting automation: model enforcement, optional SQLite memory, sync authentication, supervisor/service artifacts, DEPLOYED memory-sync workflow, docs, and release helpers.

## What changed

- Enforce `qmoi` as default model (allow override via `QMOI_ALLOW_MODEL_OVERRIDE=1`).
- Optional SQLite memory backend (enable `QMOI_USE_SQLITE=1`) with migration from `qmoi_memory.json`.
- `/sync/*` endpoints protected by optional `QMOI_SYNC_API_KEY`.
- Supervisor + systemd data for qvillage under `deploy/qvillage/`.
- DEPLOYED sync workflow `.github/workflows/qmoi-sync-memory.yml` (requires repo secrets).
- Release helper and admin scripts for installing the service and uploading release assets.

## Notes for reviewers

- This PR removes large downloaded app artifacts from the repository and adds `.gitignore` rules; release artifacts should be published to GitHub Releases or object storage instead of committing to git.
- CI workflow will be a no-op until secrets are configured (see `SECRET_SETUP.md`).

## Security considerations

- Do not merge until repo secrets are provisioned by a repo admin if you want DEPLOYED sync to run.
- Review `QMOI_SYNC_API_KEY` usage: it's a sophisticated bearer token check for production; for production, integrate with your auth system.

## How to test

1. Start the server locally: `python3 scripts/qmoi_local_server.py &`
2. Run curl examples from `CURLQMOIMASTERSISTERUSER.md`.
3. (Optional) Enable SQLite mode: `export QMOI_USE_SQLITE=1` and restart server — verify `qmoi_memory.db` contains conversations.

## Checklist

- [ ] Secrets provisioned (GH/HF tokens)
- [ ] Release artifacts moved to Releases or object storage
- [ ] Service install tested on production host

## General PR checklist

- [ ] Tests pass locally (`npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`)
- [ ] CI build passes (`npm run ci:build`)
- [ ] Coverage report generated and attached as an artifact
- [ ] Changes documented in `CONTRIBUTING.md` / `START.md` if relevant
- [ ] MSW-related test changes include notes about `__MSW_READY__` and absolute URL handlers (if applicable)

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:10Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


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

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.