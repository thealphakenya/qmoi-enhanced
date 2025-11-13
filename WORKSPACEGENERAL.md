# WORKSPACEGENERAL

- Audit timestamp: 2025-11-11T00:00:00Z
- Total files scanned: 18921
- Files considered done (no original placeholders): 14596
- Files with placeholders detected: 0

## Files referenced
- resumetodos.txt
- donerefs.txt
- allrefs.txt
- allrefs.md

## Automation

Workflows and scripts live under `.github/workflows` and `tools/`.

New automation added (auto-managed):
- `tools/check_links_clean.py` — link/DNS checker (generates reports in `tools/`).
- `tools/apply_link_fixes.py` — conservative http->https auto-fixer (dry-run default).
- `tools/auto_fix_build.py` — conservative build autofixer for missing deps (Node/Python).
- Scheduled link-check workflow: `.github/workflows/scheduled-link-check.yml` (daily).
- Vercel autofix workflow: `.github/workflows/vercel-autofix.yml` (runs on push/PR and will attempt safe fixes and open PRs).

Automation policy: automated changes create PRs (or branches) for review. Low-risk fixes (http->https) are applied automatically per policy; dependency fixes are attempted conservatively and offered as PRs.

Keep this file updated when automation changes.
# Recent workspace updates (summary):

- Added a local QM OI dev server: `scripts/qmoi_local_server.py` with OpenAI-style `/v1/chat/completions` and persistent memory in `qmoi_memory.json`.
- Memory sync: `/sync/push`, `/sync/pull`, and `/sync/config` endpoints added to the local server. A standalone sync helper `scripts/sync_memory.py` supports pushing to GitHub Gist, Hugging Face repo, or SCP targets using env vars.
- PWA: `pwa_apps/qmoi-space` updated/verified (manifest + service worker present).
- Documentation: `docs/LOCAL_QMOI_DEVELOPMENT.md`, `CURLQMOIMASTERSISTERUSER.md`, and `HOOKS.md` updated to reference the local server and memory sync.

- Deployment helpers: `deploy/qvillage/run_qmoi.sh` and `deploy/qvillage/qmoi.service` added to keep `qmoi` running in qvillage (systemd example + supervisor loop). See `deploy/README.md` for instructions.
- CI: `.github/workflows/qmoi-sync-memory.yml` added to run `scripts/sync_memory.py` on a schedule (every 15 minutes) and on branch push — requires secrets `QMOI_GH_TOKEN`, `QMOI_HF_TOKEN`, `QMOI_GIST_ID` to be configured.

Next suggested steps:
- Configure `QMOI_GH_TOKEN` and/or `QMOI_HF_TOKEN` in CI or environment secrets to enable automated memory sync.
- Add authentication in front of `/sync/*` endpoints before exposing to any network.
- Run `python3 scripts/sync_memory.py` manually for initial sync, or add a CI job that runs it on a schedule.
# WORKSPACEGENERAL

- Audit timestamp: 2025-11-08T15:29:10.283537Z
- Total files scanned: 18921
- Files considered done (no original placeholders): 14596
- Files with placeholders detected: 0

## Files referenced
- resumetodos.txt
- donerefs.txt
- allrefs.txt
- allrefs.md
