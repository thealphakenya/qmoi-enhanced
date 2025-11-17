Secrets & CI setup for QMOI memory sync

To enable automated memory sync and protect `/sync/*` endpoints, add the following repository secrets in GitHub (Settings → Secrets → Actions):

- `QMOI_SYNC_BACKENDS` — comma-separated list of backends, e.g. `gist,hf` or `hf,scp:user@host:/path`
- `QMOI_GH_TOKEN` — GitHub token with `gist` or repo:permissions if using gist
- `QMOI_GIST_ID` — Gist ID to update when using `gist`
- `QMOI_HF_TOKEN` — Hugging Face token with `repo` write access
- `QMOI_HF_REPO` — Hugging Face repo id (e.g. `username/qmoi-memory`)
- `QMOI_SYNC_API_KEY` — Shared secret used by `/sync/*` endpoints (calls must include `Authorization: Bearer <key>`)

Notes:
- CI workflow `.github/workflows/qmoi-sync-memory.yml` runs `scripts/sync_memory.py`; it expects these secrets to be set.
- Keep tokens secret and rotate regularly. Prefer least-privilege tokens restricted to the single repo/gist.
- After setting secrets, verify by running the workflow manually (Actions → qmoi-memory-sync → Run workflow) or by pushing a commit.
