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
