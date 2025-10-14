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
```

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

## Verification Checklist

- After running each command, open the corresponding URL in your browser.
- Ensure all UI features and functionality match the documentation in the related `.md` files (see QMOISPACEUI.md, QCITYREADME.md, QMOI-ENHANCED-FEATURES.md, etc).
- Use browser dev tools to test PWA install, offline mode, notifications, and responsiveness.
- For QCity and Main App, verify API endpoints, dashboards, and automation features are present.

---

**Note:**

- If you encounter missing features, errors, or incomplete UI, refer to the respective documentation and feature lists for troubleshooting and development guidance.
- For advanced automation, error fixing, and cloud deployment, see QMOI Space Dev docs and QMOI Enhanced docs.
