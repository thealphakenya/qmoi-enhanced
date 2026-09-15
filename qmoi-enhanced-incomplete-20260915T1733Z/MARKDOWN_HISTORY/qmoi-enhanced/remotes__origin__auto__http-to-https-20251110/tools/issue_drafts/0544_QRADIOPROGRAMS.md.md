---
title: "Issue draft for QRADIOPROGRAMS.md"
generated: 2025-11-08T16:06:38.329382Z
---

# Review needed: QRADIOPROGRAMS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI Radio Programs"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Radio Programs

## Global Radio
| Time   | Title         | Presenter | Type   |
|--------|--------------|-----------|--------|
| 08:00  | Morning Mix  | QMOI      | Music  |
| 12:00  | Global News  | QMOI      | News   |
| 18:00  | Evening Urban| QMOI      | Music  |

## Urban Radio
| Time   | Title        | Presenter | Type   |
|--------|-------------|-----------|--------|
| 09:00  | Urban Beats | QMOI      | Music  |
| 15:00  | Urban News  | QMOI      | News   |
| 20:00  | Night Party | QMOI      | Music  |

## Notes
- QMOI is the main DJ, presenter, and program manager
- More channels and programs can be added by QMOI or master

<!-- QMOI_VALIDATION_START -->
{
  "file": "QRADIOPROGRAMS.md",
  "validated_at": "2025-10-26T20:51:22.586163Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Radio Programs"
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
