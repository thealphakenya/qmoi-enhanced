# Release Automation — QMOI

This document explains the release automation system in this repository and how QMOI and LION coordinate to produce safe, auditable releases.

Overview
- `scripts/release_automation.py` — produces release proposals from validated build artifacts and can publish to GitHub when credentials are available.
- `scripts/validate_builds.py` — validates artifact presence for discovered apps.
- `.qmoi_validation/releases_proposals/` — stores generated proposals for review.
- `.qmoi_validation/auto_env.json` — default non-sensitive config; may be overridden by `.env` files or environment variables.

Design principles
- Non-destructive by default: scripts write proposals and patches to `.qmoi_validation/` for human or CI review rather than pushing changes automatically.
- Multi-source configuration: credentials and settings are discovered from (in order): environment variables, `.env` at repo root, `.qmoi_validation/.env`, and `.qmoi_validation/auto_env.json`.
- Safe publishing: publishing requires a valid `GITHUB_TOKEN` and `GITHUB_REPO`. To avoid accidental billing or storage use, uploading large binary assets is gated and opt-in.
- LION orchestration: validators and fixers emit LION task stubs under `.qmoi_validation/lion_tasks/`. `scripts/lion_orchestrator.py` will process those tasks and create PR proposals and todo items.

Quick run
1. Run validations and create proposals locally:

```bash
python3 scripts/generate_allmdrefs.py --write
python3 scripts/validate_md.py
python3 scripts/validate_builds.py
python3 scripts/release_automation.py
```

2. Review `.qmoi_validation/releases_proposals/` and `.qmoi_validation/pr_proposals/`.

3. To publish programmatically (CI), provide `GITHUB_TOKEN` and `GITHUB_REPO` (owner/repo) as CI secrets. Set `AUTO_PUBLISH=true` only in a guarded workflow and on protected branches.

CI workflow
- The repository includes `.github/workflows/qmoi-autodev.yml` which runs discovery, validations and LION orchestration on push to the protected autosync branch and via manual dispatch. It generates proposals and does not publish releases automatically.

Extensibility
- To enable automatic uploads and publishing in CI, extend `scripts/release_automation.py` to implement the upload flow using the `upload_url` returned by the Releases API. Always gate uploads behind `MAX_UPLOAD_MB` limits and explicit `--upload` flags.

Security
- Never commit valid tokens into the repo. Use GitHub Actions secrets or an encrypted store. The `auto_env.json` file is intentionally seeded with empty tokens.
