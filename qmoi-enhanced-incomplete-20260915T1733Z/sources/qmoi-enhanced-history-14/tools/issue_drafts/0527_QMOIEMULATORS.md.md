---
title: "Issue draft for QMOIEMULATORS.md"
generated: 2025-11-08T16:06:38.309875Z
---

# Review needed: QMOIEMULATORS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:41.760310Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:41.760310Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:41.760310Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOIEMULATORS"
qmoi_validation_frontmatter: true
---

# QMOIEMULATORS

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

<!-- QMOI_VALIDATION_START -->
{
  "file": "QMOIEMULATORS.md",
  "validated_at": "2025-10-26T20:51:22.509319Z",
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

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
