# QMOI Autodev & Release Automation (developer instructions)

Generated: 2025-10-26T

This file gathers recommended developer commands, test runners, build steps and the automated flows QMOI will use to maintain, validate and publish artifcats. It contains the minimal steps to let QMOI (the repo AI & LION orchestrator) autonomously validate, propose releases and — when authorised — publish them.

## Key scripts

- `scripts/generate_allmdrefs.py` — discover all `.md` files and update `ALLMDFILESREFS.md` (use `--write` to apply changes).
- `scripts/validate_md.py` — validate markdown files, produce per-file JSON reports in `.qmoi_validation/validation_reports/` and optionally insert validation blocks with `--apply`.
- `scripts/qmoi_todos.py` — lightweight todo manager used by validation and release scripts to create remediation tasks.
- `scripts/collect_build_scripts.py` — scan for build scripts and manifests.
- `scripts/register_app_build.py` — discover apps/artifacts and optionally copy artifacts into `ALL_APPS/` with `--copy`.
- `scripts/validate_builds.py` — checks discovered apps for expected artifacts and writes reports to `.qmoi_validation/build_validation_reports/`.
- `scripts/release_automation.py` — create release proposals from passed build validations and optionally publish to GitHub when `GITHUB_TOKEN` & `GITHUB_REPO` env vars are provided.

## Quick-run (recommended order)

1. Discover all MD files and update refs (safe):

```bash
python3 scripts/generate_allmdrefs.py --write
```

2. Run markdown validations (dry-run first):

```bash
python3 scripts/validate_md.py
# Inspect .qmoi_validation/validation_reports/
```

3. After review, insert validation metadata blocks (batch or per-file):

```bash
python3 scripts/validate_md.py --apply --create-todos --lion
```

4. Discover & register builds/apps (dry-run):

```bash
python3 scripts/collect_build_scripts.py
python3 scripts/register_app_build.py
```

5. Validate build artifacts:

```bash
python3 scripts/validate_builds.py
# Inspect .qmoi_validation/build_validation_reports/
```

6. Propose and optionally publish releases:

```bash
# Generates proposal JSON files under .qmoi_validation/releases_proposals/
python3 scripts/release_automation.py

# To publish (requires env vars):
export GITHUB_TOKEN=...  # scoped token with repo:release
export GITHUB_REPO=owner/repo
python3 scripts/release_automation.py --publish
```

## Autodev & LION integration notes

- QMOI (the AI) and LION (orchestrator) work together by writing machine-readable stubs into `.qmoi_validation/lion_tasks/` and `.qmoi_validation/` reports. When validations fail, `validate_md.py` and `validate_builds.py` can auto-create todos and LION task stubs to remediate.
- LION is used to schedule and route remediation tasks. QMOI uses past validation history (`.qmoi_validation/history/`) to decide remediation strategies (retry, create task, escalate).
- For full automation: authorize a dedicated bot account with a minimal `GITHUB_TOKEN` and set `GITHUB_REPO`. QMOI will only publish when `--publish` is given.

## Tests and CI

- Add unit tests for `scripts/validate_md.py` and `scripts/qmoi_todos.py` under `tests/` using pytest. Minimal tests to add:
  - validator reads file and returns checks structure for a small sample.
  - todo add/list/run flows operate on a temp `.qmoi_validation`.

- CI pipeline (GitHub Actions) should run discovery, validation (dry-run), build discovery and build validation. A manual approval step should gate `release_automation.py --publish`.

## Autodev best-practices (what QMOI will do automatically)

- Non-destructive first: QMOI runs discovery and validations in dry-run, creates proposals and todos, and waits for approval to apply changes or publish releases.
- When authorised, QMOI will:
  - insert validation metadata blocks into `.md` files in batches,
  - create remediation todos for missing artifacts,
  - propose GitHub Releases and publish after human or automated approval.
- QMOI will prefer lightweight artifacts (PWAs, wheels, wasm when possible) and tag releases with `pwa` or `apk` in release notes when those artifacts are present.

## Commands summary

All-in-one quick run (safe, review after each step):

```bash
python3 scripts/generate_allmdrefs.py --write
python3 scripts/validate_md.py
python3 scripts/validate_builds.py
python3 scripts/release_automation.py
```

## Where to extend

- To add automatic uploads of release artifacts, extend `scripts/release_automation.py` to collect artifacts and upload them to the GitHub release `upload_url`. Keep `--publish` gated behind env var checks.
- To enable fully autonomous publishing, configure a GitHub Actions workflow that runs the pipeline, and grant the run a minimal publish token only on a protected branch.

## Contact points in code

- `.qmoi_validation/` — validation artifacts, history, and LION task stubs.
- `scripts/qmoi_todos.py` — add/edit tasks used by validators.
- `scripts/register_app_build.py` — canonicalizes apps/artifacts for release.

---

End of autodev instructions.
