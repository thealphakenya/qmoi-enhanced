---
title: "QMOI Start Guide"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Start Guide

## 🚀 How to Start or Resume QMOI (QCity & Cloud)

To ensure QMOI is always running (even in the cloud or when your device is offline), use the following command:

```bash
python scripts/qmoi-start.py
```

- This script will:
  - Check if QMOI is already running (locally or in the cloud)
  - Show the status of the running system
  - If not running, it will start/resume all QMOI automation, error fixing, and cloud features (QCity, Colab, Dagshub, etc.)
  - Ensure all features are always-on and self-healing

## 📊 Status

- The script will display the current status and health of QMOI, including error fixing, cloud sync, and notifications.

## 🧪 Developer Quick Start

- Run dev server: `npm run dev` (local: http://localhost:3000)
- Check dev server health: `npm run dev:health` (returns non-zero exit code if unreachable)
- Run tests: `npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`
- Build (CI style): `npm run ci:build`

## 🚀 Production

- Build and start (simple):
  - `npm run ci:build`
  - `NODE_ENV=production npm start`
- Daemonize with systemd (example):
  - Copy the repo to the target host (e.g. `/opt/qmoi`)
  - Run `sudo ./scripts/install-systemd-service.sh /opt/qmoi` (this will create `/etc/systemd/system/qmoi.service`, enable and start it)
- PM2: `npm run start:prod:pm2` (uses `ecosystem.config.js`)
- Docker (multi-stage):
  - `docker build -t qmoi-enhanced:latest .`
  - `docker run -p3000:3000 qmoi-enhanced:latest`
- Docker Compose (production):
  - `docker compose -f deploy/docker-compose.prod.yml up -d`

**CI/CD & Deploy:**

- A GitHub Actions workflow `/.github/workflows/ci-cd.yml` now builds and (when configured) pushes a Docker image to GHCR and can optionally deploy it to a host via SSH.
- To enable automated deploys, set the repository secrets `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_SSH_KEY`. For GHCR pushes ensure `packages: write` permission (GITHUB_TOKEN or a PAT).
- Use `scripts/host-provision.sh` on the host to copy systemd units, enable PM2 startup, or pull a new image and restart the PM2 process (see `docs/DEPLOY.md`).

### MSW & Testing Notes

- MSW is initialized at test-time via `src/setupTests.ts` and provides a global promise `globalThis.__MSW_READY__` that tests can await.
- If you see unhandled network requests during tests, set `SHOW_MSW_UNHANDLED=1` to see them; use `TEST_VERBOSE=1` for extra handler debug output.

- See `CONTRIBUTING.md` for more developer testing notes and troubleshooting steps (MSW handler shapes, env flags, and common fixes).

## 🛡️ Always-On

- QMOI is designed to keep running in the cloud, so you never miss an event or fix—even if your device is offline.

---

**QMOI: Always-on, self-healing, and fully automated.**

<!-- QMOI_VALIDATION_START -->

{
"file": "START.md",
"validated_at": "2025-10-26T20:51:22.641823Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Start Guide"
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
