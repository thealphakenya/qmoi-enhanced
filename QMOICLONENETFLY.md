# QMOI Clone Netfly (QMOICLONENETFLY)

## Overview
QMOI Clone Netfly is an autonomous system that replicates all major Netlify features (build, deploy, preview, site management, etc.) without requiring a Netlify subscription or connection. QMOI uses open-source and self-hosted alternatives to provide a Netlify-like experience, fully integrated into QCity (master-only UI).

---

## Features
- **Build & Deploy:** QMOI builds and deploys static and dynamic sites using open-source tools (e.g., Vercel CLI, Surge, Render, custom scripts).
- **Preview Deployments:** Provides preview URLs and site management just like Netlify.
- **Environment Management:** Auto-creates and manages env variables for all deployments.
- **Master-Only UI:** All Netfly features are visible and controllable only by the master in QCity.
- **No Subscription Needed:** All features work without a Netlify account or payment.
- **Notifications:** QMOI notifies the master of all deploys, errors, and fixes.
- **Auto-Fix & Redeploy:** QMOI auto-fixes all deploy errors and retries until successful.

---

## How It Works
- QMOI detects when a Netlify feature is needed and uses the best available open/free tool or service.
- All actions, logs, and deploys are visible in QCity (master-only).
- QMOI continuously updates and enhances Netfly features as new open tools become available.

---

## See Also
- [QMOIDEV.md](./QMOIDEV.md)
- [QMOIFREE.md](./QMOIFREE.md)
- [QMOI-CLOUD.md](./QMOI-CLOUD.md) 