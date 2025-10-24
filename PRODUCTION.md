# Production Runbook & Required Environment

This document describes the minimal environment variables, runbook steps, and release expectations for running QMOI in production.

## Required environment variables

- NODE_ENV=production
- GH_TOKEN — GitHub token with repo:public_repo or repo scope to create releases and manage PRs
- MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET — M-Pesa Daraja credentials
- MPESA_SHORTCODE — Business shortcode used for STK/B2C
- PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET — (if using Pesapal/Cashon)
- DATA_DIR — folder used for file-backed persistence (defaults to ./data if not set)
- CODECOV_TOKEN — optional for coverage upload

## Release expectations

- All artifacts for supported platforms must be produced under `Qmoi_apps/<platform>/` and validated by autotests before creating a GitHub Release.
- Releases MUST be created as annotated tags (e.g. `v2.5.1`). CI will create or update a GitHub Release when a `v*` tag is pushed.
- Release notes should reference `RELEASETRACKS.md` and the `BUILDAPPSFORALLPLATFORMS.md` document.

## Runbook

1. Validate environment (CI runs `node scripts/validate-env.cjs`).
2. Run full build (see `scripts/qmoi-app-builder.py`).
3. Run autotests and validation scripts. If validation passes, CI publishes artifacts to GitHub Releases.
4. If CI fails, QMOI automation will attempt an auto-fix and create an automated PR with fixes. The Auto-merge workflow may merge the patch if checks pass.

## Secrets rotation

- Rotate `GH_TOKEN` and any third-party credentials (M-Pesa, Pesapal) if found in the repo history.
