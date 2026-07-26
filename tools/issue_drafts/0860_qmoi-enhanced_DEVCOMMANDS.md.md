---
title: "Issue draft for qmoi-enhanced/DEVCOMMANDS.md"
generated: 2025-11-08T16:06:38.731160Z
---

# Review needed: qmoi-enhanced/DEVCOMMANDS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:41.985278Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:41.985278Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:41.985278Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

````
---
title: "DEVCOMMANDS.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# DEVCOMMANDS.md

This file provides development commands to run and view the main QMOI applications (QMOI Space, QCity, and the Main Application) in your browser. Use these commands to launch each app in development mode and verify all UI and feature requirements as described in their respective documentation files.

---

## 1. QMOI Space (Progressive Web App)

**Features:** Modern PWA, responsive UI, real-time dashboard, chat, charts, installable on any device.

**Run Command:**
```bash
cd qmoi-space-pwa
# If dependencies are needed: npm install
npx serve .
````

**Access:**

- Open [http://localhost:5000](http://localhost:5000) in your browser.
- All PWA features (offline, install prompt, notifications) should be available.

---

## 2. QCity (Main Device & Orchestrator)

**Features:** Device management, error tracking, resource monitoring, notifications, self-healing, API endpoints, React UI.

**Run Command:**

```bash
npm run dev
```

**Access:**

- Open [http://localhost:3000/qcity](http://localhost:3000/qcity) in your browser.
- All QCity features (device status, audit log, remote commands, plugins, metrics) should be available as per `QCITYREADME.md` and related files.

---

## 3. Main Application (QMOI Alpha AI)

**Features:** AI-powered development, automation, documentation, error fixing, multi-project management, gaming, financial tools.

**Run Command:**

```bash
npm run dev
```

**Access:**

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- All main app features (AI tools, dashboards, gaming cloud, voice/vision, project management) should be available as described in `QMOI-ENHANCED-FEATURES.md`, `QMOI-ENHANCED-README.md`, and related docs.

---

## Verification Checklis

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
```
