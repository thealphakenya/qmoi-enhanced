---
title: "QMOI Sponsored Users"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Sponsored Users

This file lists users that QMOI should treat as "sponsored" — they should not be charged for services and should receive master-level exemptions where appropriate.

## Sponsored experience scope

- Sponsored users should receive enhanced access to sponsored previews, engineering project inspiration, and premium UX highlights while remaining subject to role boundaries.
- Sponsored users should be able to view shared QVirtualLabs previews, engineering project cards, and sponsor-tailored reports.
- Master and sister accounts retain authority over invention projects and advanced engineering execution; sponsored users receive assisted access rather than unrestricted execution rights.

## Related docs

- QMOIMODEL.md
- QMOIMODELTESTS.md
- QVIRTUALLABS.md
- ALLUI.md
- ALLFRONTEND.md
- API.md
- ENDPOINTS.md
- ROUTES.md

Format: one username per line. The `qmoi_control_server.py` exposes endpoints to add/view sponsored users (`/sponsored/add`, `/sponsored/list`).

Master and immediate family (example):

- master
- sister

# How to modify

- Use the `POST /sponsored/add` endpoint as the master user or using the `QMOI_CONTROL_TOKEN`.

---

Generated on 2025-10-23 by automation.

<!-- QMOI_VALIDATION_START -->

{
"file": "SPONSORED.md",
"validated_at": "2025-10-26T20:51:22.637574Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Sponsored Users"
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

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
