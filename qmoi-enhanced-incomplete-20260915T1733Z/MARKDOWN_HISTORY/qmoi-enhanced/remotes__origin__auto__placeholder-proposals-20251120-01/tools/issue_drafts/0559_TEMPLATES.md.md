---
title: "Issue draft for TEMPLATES.md"
generated: 2025-11-08T16:06:38.347935Z
---

# Review needed: TEMPLATES.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "TEMPLATES.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->


# TEMPLATES.md

This file documents all templates in the `templates/` directory, their usage, and integration for QCity, QMOI AI, and QMOI Space. All templates are checked to ensure they are used and served as expected. Unused or duplicate templates are marked for removal.

## Directory Structure
```
templates/
├── dashboard.html
```

## Usage & Integration
- `dashboard.html` is used as the main dashboard template for QCity, QMOI AI, and QMOI Space web apps and admin panels.
- All templates are referenced in automation flows and are served as entry points or UI layouts.
- Unused/duplicate templates are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.

## Automation & Health
- All templates are referenced in `ALLMDFILESREFS.md` and planned for further enhancement and integration.
- Automation ensures every template is used, and unused ones are logged for removal.

**Status:** All templates are now checked for usage and integration. No unused/duplicate templates will remain after next cleanup. All UI features and layouts are covered for QCity, QMOI AI, and QMOI Space.

## Zero-Rated QMOI Features & Universal Automation

- All QMOI templates, including zero-rated (free, unlimited, no billing) features, are documented and available for every app, platform, and device.
- QMOI provides all paid/subscription features of major platforms for free, with unlimited parallel jobs, advanced analytics, and premium integrations.
- All automation, error fixing, and autotesting is handled by QMOI runners and QCity cloud, ensuring no paid runners or billing issues.
- All templates, downloads, builds, tests, health checks, and runners are referenced and autotested in:
	- `QMOIFREE
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
