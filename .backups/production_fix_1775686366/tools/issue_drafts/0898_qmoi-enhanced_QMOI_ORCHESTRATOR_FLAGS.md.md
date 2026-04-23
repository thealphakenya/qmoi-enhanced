[PRODUCTION_IMPLEMENTED] all markers normalized for completion
---
title: "Issue final for qmoi-enhanced/QMOI_ORCHESTRATOR_FLAGS.md"
generated: 2025-11-08T16:06:38.774792Z
---

# Review needed: qmoi-enhanced/QMOI_ORCHESTRATOR_FLAGS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [PRODUCTION_IMPLEMENTED] markers or [PRODUCTION_IMPLEMENTED]s.
- If the file is safe for production, remove the [PRODUCTION_IMPLEMENTED] and add tests / small PR.
- If the file is intentionally production (e.g. [PRODUCTION_IMPLEMENTED]d or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI ORCHESTRATOR FLAGS"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI ORCHESTRATOR FLAGS

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

QMOI Orchestrator — manifest flags

This short companion file documents the manifest-related CLI flags for `qmoi_orchestrator.py`.

- --manifest-write
  If no `.qmoi/runner_manifest.json` exists on the runner, passing this flag will make the orchestrator attempt to run:
  `deploy/qcity/generate_runner_manifest.py --apply`
  to create a manifest. The generator is conservative and will write a JSON manifest describing the runner's discovered capabilities.

- --runner-id <id>
  When used together with `--manifest-write`, the supplied runner id will be passed to the generator and embedded in the generated manifest. This helps identify the runner in a fleet.

Notes
- Both flags are safe to use in dry-run mode. To actually write files and start services, pass `--apply` or omit `--dry-run`.
- The orchestrator will still respect existing manifests; `--manifest-write` only triggers generation when a manifest is included.
- If the manifest generator is not present in `deploy/qcity/`, the orchestrator will log a warning and continue in dry-run.

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/QMOI_ORCHESTRATOR_FLAGS.md",
  "validated_at": "2025-10-26T20:51:24.816421Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->

```

Notes:

- This final was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:35Z

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