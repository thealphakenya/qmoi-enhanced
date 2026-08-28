---
title: "QMOI Deals"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Deals

This document explains the deals system implemented in `qmoi_control_server.py`.

Concepts

- Deals: purchasable offerings (features, subscriptions, bundles). Stored in the `deals` table and manageable by master/admin endpoints.
- Sponsored users: users in `SPONSORED.md` or the `sponsored` table are granted free access to paid deals.
- Purchases: currently simulated; purchases create entries in `user_pricing` to mark access. Integrate a payment gateway for real money flows.

Endpoints

- POST /deals/create — create a new deal (master/admin)
- GET /deals — list deals
- GET /deals/<id> — get deal details
- POST /deals/<id>/activate — activate deal (master/admin)
- POST /deals/<id>/deactivate — deactivate deal (master/admin)
- POST /deals/<id>/purchase — purchase deal (user JWT required). Sponsored users receive deal for free.

Notes and next steps

- Integrate a payment provider (Stripe, M-Pesa) for real purchases. Use webhooks to confirm payments and update `user_pricing` with `expires_at`.
- Add invoices table, receipts, and audit logs for purchases.
- Add a UI for master to manage deals (the repo includes `pwa_apps/deals/index.html` which lists deals).

---

Generated on 2025-10-23 by automation.

<!-- QMOI_VALIDATION_START -->

{
"file": "DEALS.md",
"validated_at": "2025-10-26T20:51:22.292572Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Deals"
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


---
Checked by Ollama agent at 2026-07-21T22:34:37.486863Z. No immediate [AUTOFIXED by Ollama at 2026-07-26T00:54:34.520572Z]s found.
