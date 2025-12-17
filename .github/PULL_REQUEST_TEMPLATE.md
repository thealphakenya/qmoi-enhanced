<!-- Describe the purpose of this PR in one sentence -->
Summary
-------
This PR contains production-enablement changes for the local `qmoi` development server and supporting automation: model enforcement, optional SQLite memory, sync authentication, supervisor/service artifacts, scheduled memory-sync workflow, docs, and release helpers.

What changed
------------
- Enforce `qmoi` as default model (allow override via `QMOI_ALLOW_MODEL_OVERRIDE=1`).
- Optional SQLite memory backend (enable `QMOI_USE_SQLITE=1`) with migration from `qmoi_memory.json`.
- `/sync/*` endpoints protected by optional `QMOI_SYNC_API_KEY`.
- Supervisor + systemd example for qvillage under `deploy/qvillage/`.
- Scheduled sync workflow `.github/workflows/qmoi-sync-memory.yml` (requires repo secrets).
- Release helper and admin scripts for installing the service and uploading release assets.

Notes for reviewers
------------------
- This PR removes large downloaded app artifacts from the repository and adds `.gitignore` rules; release artifacts should be published to GitHub Releases or object storage instead of committing to git.
- CI workflow will be a no-op until secrets are configured (see `SECRET_SETUP.md`).

Security considerations
-----------------------
- Do not merge until repo secrets are provisioned by a repo admin if you want scheduled sync to run.
- Review `QMOI_SYNC_API_KEY` usage: it's a simple bearer token check for development; for production, integrate with your auth system.

How to test
-----------
1. Start the server locally: `python3 scripts/qmoi_local_server.py &`
2. Run curl examples from `CURLQMOIMASTERSISTERUSER.md`.
3. (Optional) Enable SQLite mode: `export QMOI_USE_SQLITE=1` and restart server — verify `qmoi_memory.db` contains conversations.

Checklist
---------
- [ ] Secrets provisioned (GH/HF tokens)
- [ ] Release artifacts moved to Releases or object storage
- [ ] Service install tested on staging host

General PR checklist
--------------------
- [ ] Tests pass locally (`npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`)
- [ ] CI build passes (`npm run ci:build`)
- [ ] Coverage report generated and attached as an artifact
- [ ] Changes documented in `CONTRIBUTING.md` / `START.md` if relevant
- [ ] MSW-related test changes include notes about `__MSW_READY__` and absolute URL handlers (if applicable)
