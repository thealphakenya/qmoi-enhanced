# ALLSERVE.md — Serve QMOI AI, QMOI Space, QCity, and QVillage

This document describes how to keep all requested applications running in production and accessible in a browser at all times.

## ✅ Goals
- Serve `qmoi ai`, `qmoi space`, `qcity`, and `qvillage` in a browser
- Keep them running continuously in production mode
- Ensure browser access is optional, not required for runtime

## 🔧 Prerequisites
- `python3` installed
- `npm` / `node` installed if serving additional Next.js/Node apps
- Repository root: `/workspaces/qmoi-enhanced`

## 1) Serve static browser apps and PWAs from one host on port `8080`
The repository contains browser entry points and PWA shells that can all be served from a single host.

> Note: This static HTTP server only serves static asset files and the PWA shells in `public/` and `pwa_apps/`. It does not run the Next.js app routes under `/qmoi-ai`, `/qmoi-space`, or `/qcity`.

Core served apps:
- `qmoi-ai.html`
- `qmoi-space.html`
- `qcity-enterprise.html`
- `qcity-complete.html`
- `qcity-dashboard.html`
- `pwa_apps/qmoi-ai/index.html`
- `pwa_apps/qmoi-space/index.html`
- `pwa_apps/qmoi/index.html`

These files are all served directly from repository root.

### For the actual React app UI described in the documentation
Start the Next.js application and use the app routes on port `3000`:
```bash
cd /workspaces/qmoi-enhanced
npm run dev
```
Then visit:
- `http://127.0.0.1:3000/qmoi-ai`
- `http://127.0.0.1:3000/qmoi-space`
- `http://127.0.0.1:3000/qcity`

The `8080` static server is useful for PWA shells, but the full documented app UI requires the Next.js app server.

### Start the static server
```bash
cd /workspaces/qmoi-enhanced
mkdir -p /tmp/qmoi-serve-logs
nohup python3 -m http.server 8080 > /tmp/qmoi-serve-logs/qmoi-static-server.log 2>&1 &
```

### Confirm the server is running
```bash
ps -ef | grep "python3 -m http.server 8080" | grep -v grep
```

### Browser URLs
- Root app launcher: `http://127.0.0.1:8080/`  
  > Opens the new QMOI Enhanced App Launcher with explicit buttons for QMOI AI, QMOI Space, and QCity.
- QMOI AI launcher: `http://127.0.0.1:8080/qmoi-ai-live.html`  
  > Use this unique live launcher path to avoid stale cached pages or root redirect interference.
- QMOI AI real app: `http://127.0.0.1:8080/pwa_apps/qmoi-ai/index.html`
- QMOI Space real app: `http://127.0.0.1:8080/pwa_apps/qmoi-space/index.html`
- QMOI app shell: `http://127.0.0.1:8080/pwa_apps/qmoi/index.html`
- QCity Primary Dashboard: `http://127.0.0.1:8080/qcity-enterprise.html`
- QCity Complete Dashboard: `http://127.0.0.1:8080/qcity-complete.html`
- QCity Comprehensive Dashboard: `http://127.0.0.1:8080/qcity-dashboard.html`

## UI Components Verification

All apps include comprehensive UI components as documented in the respective UI documentation files. All mentioned components have been verified to exist in the codebase under `app/components/`:

- **QMOI AI**: See [QMOIAIUI.md](QMOIAIUI.md) for 24+ components including AdminDashboard.tsx(qmoi ai), ChatMessaging.tsx(qmoi ai), QMOIAutoFixDashboard.tsx(qmoi ai), QMOIAutoSetup.tsx(qmoi ai), QMOIMasterDashboard.tsx(qmoi ai), SponsoredUsersManager.tsx(qmoi ai), ClientUISettings.tsx(qmoi ai), FileUploadDownload.tsx(qmoi ai), VisualEnhancement.tsx(qmoi ai), AudibleConversation.tsx(qmoi ai), UserProfile.tsx(qmoi ai), WalletPanel.tsx(qmoi ai), RegisterForm.tsx(qmoi ai), and shared components like QI.tsx, QIStateWindow.tsx, QiSpaces.tsx, LcSpaces.tsx, QVillage.tsx, QVillageDatasetsPanel.tsx, QCityErrorManager.tsx, QCityThemeProvider.tsx, NotificationCenter.tsx, HelpGuide.tsx, PreviewWindow.tsx, FloatingPreviewWindow.tsx, ThemeCustomizer.tsx, WalletList.tsx.
- **QMOI Space**: See [QMOISPACEUI.md](QMOISPACEUI.md) for 14+ components including LcSpaces.tsx(qmoi space), QiSpaces.tsx(qmoi space), Marketplace.tsx(qmoi space), CollaborationHub.tsx(qmoi space), CommunicationHub.tsx(qmoi space), KnowledgeBase.tsx(qmoi space), InnovationLab.tsx(qmoi space), WorkflowAutomationEngine.tsx(qmoi space), ResourceManager.tsx(qmoi space), DeploymentManager.tsx(qmoi space), IntegrationManager.tsx(qmoi space), ContentManagementSystem.tsx(qmoi space), TrainingCenter.tsx(qmoi space), GlobalOperationsCenter.tsx(qmoi space), and shared components.
- **QCity**: See [QCITYUI.md](QCITYUI.md) for 14+ components including QCityErrorManager.tsx(qcity), QCityThemeProvider.tsx(qcity), AnalyticsCenter.tsx(qcity), AnalyticsDashboard.tsx(qcity), ApiManagementConsole.tsx(qcity), AuditLogViewer.tsx(qcity), ComplianceManager.tsx(qcity), DataVisualizationPanel.tsx(qcity), MonitoringDashboard.tsx(qcity), PerformanceMonitor.tsx(qcity), SecurityMonitor.tsx(qcity), SettingsPanel.tsx(qcity), SupportTicketSystem.tsx(qcity), TestingAutomationSuite.tsx(qcity), and shared components.
- **Shared Components**: See [COMPONENTS.md](COMPONENTS.md) and [UI.md](UI.md) for cross-app components and full directory structure.

All components are tagged with their app associations and include API integration references as documented.

### Autovalidation of UI features and PWAs
- The serve-all approach verifies that browser routes, app shell assets, and PWA content are all reachable from one host.
- PWA shells are validated for service worker registration, offline caching, and UI flow availability.
- Runtime update endpoints `/api/pwa/check-update` and `/api/pwa/auto-update` are used to validate live update health and trigger PWA refresh flows.
- This autovalidation layer ensures that all app entries, install prompts, and PWA UI features work together across QMOI AI, QMOI Space, QCity, and browser-based services.

> In production environments with DNS configured, replace `http://127.0.0.1:8080` with your production hostname.

## 2) Serve QVillage continuously
The QVillage backend is managed by a supervisor script that restarts itself if it exits.

## 1.5) PWA route and app asset verification
- `app/qmoi-ai/page.tsx` now redirects to the real QMOI AI PWA app at `/pwa_apps/qmoi-ai/index.html`.
- `public/qmoi-ai.html` now redirects to `/pwa_apps/qmoi-ai/index.html`.
- `app/qmoi-space/page.tsx` now redirects to the real QMOI Space PWA app at `/pwa_apps/qmoi-space/index.html`.
- `public/qmoi-space.html` now redirects to `/pwa_apps/qmoi-space/index.html`.
- `app/qcity/page.jsx` and `app/qvillage/page.tsx` are active role-aware dashboard pages using `app/hooks/useAuth.ts`.

These changes ensure the visible browser entry points are the real intended PWA applications, not placeholder static shells.

### Start QVillage in the background
```bash
cd /workspaces/qmoi-enhanced/deploy/qvillage
mkdir -p /tmp/qvillage-logs
nohup bash run_qmoi.sh > /tmp/qvillage-logs/qvillage-supervisor.log 2>&1 &
```

### Confirm QVillage is running
```bash
ps -ef | grep run_qmoi.sh | grep -v grep
```

### Recommended browser access
If the QVillage service exposes a browser UI, open the local port used by the service. The repository suggests `scripts/qmoi_local_server.py` should serve the local backend, typically accessible at:
- `http://127.0.0.1:8000/gradio`

> Note: the QVillage supervisor script is present, but the local Python server code in `scripts/qmoi_local_server.py` currently contains syntax issues and may require repair before the browser UI becomes functional.

If you are using a different local port, adjust the URL accordingly.

## 3) Optional: keep services always-on with `pm2`
Use `pm2` to keep the services alive and restart them automatically.

## 4) Serve Next.js App in Production
The main QMOI Enhanced application is built with Next.js and can be served in production mode.

### Build the application
```bash
cd /workspaces/qmoi-enhanced
npm run build
```

### Start the production server
```bash
npm start
```

This will serve the Next.js app on port 3000 by default.

### Confirm the server is running
```bash
ps -ef | grep "next start" | grep -v grep
```

### Browser URL
- Main app: `http://127.0.0.1:3000/`

> In production environments, configure reverse proxy or use deployment platforms like Vercel for hosting.

### Start the static browser server with `pm2`
```bash
cd /workspaces/qmoi-enhanced
pm2 start --name qmoi-static --interpreter python3 -- python3 -m http.server 8080
```

### Start QVillage with `pm2`
```bash
cd /workspaces/qmoi-enhanced/deploy/qvillage
pm2 start --name qvillage-backend -- bash run_qmoi.sh
```

### Save the process list
```bash
pm2 save
```

### View running services
```bash
pm2 ls
```

## 4) Convenience browser launch commands
Use these scripts if you want to open the browser from the repository directly.

- `./OPEN_QMOI_AI.sh` — opens QMOI AI in the browser
- `./open_qcity_safe.sh` — fetches and previews QCity if the browser is unavailable
- `./start-qcity.sh` — starts the QCity HTTP server and prints dashboard URLs

## 5) Notes for production continuity
- The static server can serve all root-level browser apps from one port.
- QVillage should be run with a supervisor (`nohup`, `pm2`, or systemd) so it stays alive even when not opened in a browser.
- Opening a browser is optional; the services must remain running independently.

## 6) Recommended always-on setup
For a production-like always-on system, use a system supervisor or process manager.

### Example `systemd` service for the static server
```ini
[Unit]
Description=QMOI Static Browser Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/workspaces/qmoi-enhanced
ExecStart=/usr/bin/python3 -m http.server 8080
Restart=always
RestartSec=5
StandardOutput=file:/cache/qmoi-static-server.log
StandardError=file:/cache/qmoi-static-server.log

[Install]
WantedBy=multi-user.target
```

### Example `systemd` service for QVillage
```ini
[Unit]
Description=QVillage Always-On Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/workspaces/qmoi-enhanced/deploy/qvillage
ExecStart=/bin/bash /workspaces/qmoi-enhanced/deploy/qvillage/run_qmoi.sh
Restart=always
RestartSec=5
StandardOutput=file:/cache/qvillage-supervisor.log
StandardError=file:/cache/qvillage-supervisor.log

[Install]
WantedBy=multi-user.target
```

## 7) Quick restart commands
```bash
# Restart static browser server
pkill -f "python3 -m http.server 8080" || true
cd /workspaces/qmoi-enhanced
nohup python3 -m http.server 8080 > /cache/qmoi-static-server.log 2>&1 &

# Restart QVillage
pkill -f "run_qmoi.sh" || true
cd /workspaces/qmoi-enhanced/deploy/qvillage
nohup bash run_qmoi.sh > /cache/qvillage-supervisor.log 2>&1 &
```

## 8) Troubleshooting
- If `http://localhost:8080/qmoi-ai.html` does not load, verify the static server is running and serving from `/workspaces/qmoi-enhanced`.
- If QVillage does not stay running, use `pm2` or systemd to supervise `deploy/qvillage/run_qmoi.sh`.
- If `OPEN_QMOI_AI.sh` or `open_qcity_safe.sh` fail, open the URL manually in a browser.
