# QMOI Deals

This document explains the deals system implemented in `qmoi_control_server.py`.

Concepts
- Deals: purchasable offerings (features, subscriptions, bundles). Stored in the `deals` table and manageable by master/admin endpoints.
- Sponsored users: users in `SPONSORED.md` or the `sponsored` table are granted free access to paid deals.
- Purchases: currently simulated; purchases create entries in `user_pricing` to mark access. Integrate a payment gateway for real money flows.

Endpoints
- POST /deals/create — create a new deal (master/admin)
- GET  /deals — list deals
- GET  /deals/<id> — get deal details
- POST /deals/<id>/activate — activate deal (master/admin)
- POST /deals/<id>/deactivate — deactivate deal (master/admin)
- POST /deals/<id>/purchase — purchase deal (user JWT required). Sponsored users receive deal for free.

Notes and next steps
- Integrate a payment provider (Stripe, M-Pesa) for real purchases. Use webhooks to confirm payments and update `user_pricing` with `expires_at`.
- Add invoices table, receipts, and audit logs for purchases.
- Add a UI for master to manage deals (the repo includes `pwa_apps/deals/index.html` which lists deals).

***
Generated on 2025-10-23 by automation.
