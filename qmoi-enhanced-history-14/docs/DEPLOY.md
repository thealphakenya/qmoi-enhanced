# Deployment & Provisioning 🍱

This document explains how to build and deploy a production image and how to provision a host to run the app reliably (PM2 + systemd healthcheck timer).

## CI/CD (GitHub Actions)

- We added `.github/workflows/ci-cd.yml` which runs tests, builds the Next.js app and builds a Docker image. The workflow will push the image to GitHub Container Registry (GHCR) when not running in a pull-request.
- To enable the deploy job you must set these repository secrets:
  - `DEPLOY_HOST` — host IP or DNS
  - `DEPLOY_USER` — user to SSH as
  - `DEPLOY_SSH_KEY` — private key for SSH (PEM)

Optionally you can push images using a PAT with `packages:write` permissions for GHCR (GITHUB_TOKEN often suffices when enabled for packages).

## Host Provisioning (manual steps)

We included `scripts/host-provision.sh` to help automate the final host steps.

Common steps to run on the host (requires sudo):

1. Copy service files and enable timer:

   sudo ./scripts/host-provision.sh --install-systemd

2. Enable PM2 startup so the saved process is resumed on boot:

   sudo ./scripts/host-provision.sh --enable-pm2-startup

3. To deploy a new image from GHCR (pull and restart PM2):

   sudo ./scripts/host-provision.sh --deploy-image ghcr.io/<owner>/<repo>:<tag>

Note: The PM2 startup step tries to run the `pm2 startup` command and then `pm2 save`. If your environment requires a different invocation, follow the printed guidance.

## Local verification

- After running the host provisioning steps, verify HTTP health: `curl -fS http://localhost:3000/` and check `pm2 list`.

## Security & Secrets

- Keep the `DEPLOY_SSH_KEY` private and add it to GitHub secrets only for the repository or environment used for deployment.

## Operator checklist (required secrets & host steps)

1. Add repository secrets in GitHub:
   - `DEPLOY_HOST` - host IP/DNS
   - `DEPLOY_USER` - SSH user
   - `DEPLOY_SSH_KEY` - PEM private key text
   - (optional) `DEPLOY_PORT` - SSH port (default 22)
   - (optional) `GHCR_PAT` - personal access token if you prefer PAT for pushing to GHCR

2. On the target host (run as a privileged operator):
   - Ensure Docker and PM2 are installed and available for the deploy user.
   - From the repo root on the host, run:
     - `sudo ./scripts/host-provision.sh --install-systemd`
     - `sudo ./scripts/host-provision.sh --enable-pm2-startup`
   - Confirm the service and timer are active:
     - `systemctl status qmoi-healthcheck.timer`
     - `systemctl status qmoi.service`

3. To deploy a new image (manual alternative):
   - `sudo ./scripts/host-provision.sh --deploy-image ghcr.io/<owner>/<repo>:<tag>`

4. Verify health: `curl -fS http://localhost:3000/` or check `pm2 list`.

Add these notes to your operator runbook and restrict who has access to the `DEPLOY_SSH_KEY` secret.
