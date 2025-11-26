---
title: "Issue draft for PUBLIC.md"
generated: 2025-11-08T16:06:38.283921Z
---

# Review needed: PUBLIC.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "PUBLIC.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->


# PUBLIC.md

This file documents all public assets in the `public/` directory, their usage, and integration for QCity, QMOI AI, and QMOI Space. All assets are checked to ensure they are used and served as expected. Unused or duplicate assets are marked for removal.

## Directory Structure
```
public/
├── favicon.ico
├── icon-256.png
├── icon.icns
├── icon.ico
├── icon.svg
├── icon.webp
├── index.html
├── TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md)-logo.png
├── TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md)-logo.svg
├── TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md)-user.jpg
├── TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md).jpg
├── TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md).svg
├── qcity/
├── qcity-icon.svg
```

## Usage & Integration
- All icons and images are used for branding, UI, and device compatibility in QCity, QMOI AI, and QMOI Space.
- `index.html` is the main entry point for web apps and dashboards.
- `qcity/` and `qcity-icon.svg` are used for QCity branding and UI features.
- TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) assets are used for default avatars, logos, and error states.
- Unused/duplicate assets are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.

## Automation & Health
- All public assets are referenced in `ALLMDFILESREFS.md` and planned for further enhancement and integration.
- Automation ensures every asset is used, and unused ones are logged for removal.

**Status:** All public assets are now checked for usage and integration. No unused/duplicate assets will remain after next cleanup. All UI features and branding are covered for QCity, QMOI AI, and QMOI Space.

## Zero-Rated QMOI Features & Universal Automation

- All QMOI public assets, including zero-rated (free, unlimited, no billing) features, are documented and available for every app, platform, and device.
- QMOI provides all paid/subscription features of major platforms for fr
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
