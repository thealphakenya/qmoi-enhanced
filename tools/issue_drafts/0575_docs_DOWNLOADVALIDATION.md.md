---
title: "Issue draft for docs/DOWNLOADVALIDATION.md"
generated: 2025-11-08T16:06:38.364679Z
---

# Review needed: docs/DOWNLOADVALIDATION.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "Download Validation"
qmoi_validation_frontmatter: true
---

# Download Validation

Purpose

Define how downloads (build artifacts, installers, static assets) are validated before publishing or used by QMOI.

Measures and techniques

- Checksums: SHA256 for all artifacts; must match declared values in `qcity-artifacts/qmoi_build_report.json`.
- Timestamps: build timestamp must be recorded and compared with release tags.
- Signature verification: where available, verify detached signatures or package-level signatures.
- Virus/malware scan integration: CI should run a malware scanner on binary artifacts before publishing.
- Mirrors and CDN checks: verify that any mirror or CDN used serves the same checksum.

Operationalizing validation

- The orchestrator recomputes checksums and compares them to the build report.
- Any mismatch results in `docs/download_validation_report.json` with `mismatch` status and recommended remediation.
- LION can be configured to block deployments if critical artifacts fail validation.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/DOWNLOADVALIDATION.md",
  "validated_at": "2025-10-26T20:51:22.681218Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "Download Validation"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
