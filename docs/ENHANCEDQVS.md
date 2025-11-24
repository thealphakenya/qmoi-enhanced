---
title: "QMOI Virtual Store (QVS) — Enhanced Usage"
qmoi_validation_frontmatter: true
---

# QMOI Virtual Store (QVS) — Enhanced Usage

QVS is the local-first artifact store used to keep large artifacts, backups, and validation snapshots. The validation tools write JSON reports to `.qmoi_validation/` which should be periodically pushed to QVS for long-term retention.

How LION and QVS interact

- LION (the lightweight orchestrator) reads validation reports and can: create remediation tasks, trigger snapshots to QVS, and mark artifacts with validation metadata.
- Use LION tags in `ALLMDFILESREFS.md` and in validation blocks so that records in QVS contain provenance and validator IDs.

Recommendations

- Snapshot `.qmoi_validation/validation_reports` to QVS after major runs.
- Keep validation metadata small and machine-readable (JSON in `.qmoi_validation`, human-friendly blocks inside `.md`).

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/ENHANCEDQVS.md",
  "validated_at": "2025-10-26T20:51:22.683482Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Virtual Store (QVS) \u2014 Enhanced Usage"
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
