<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.935959Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

## Production Readiness Snapshot
- Scanned files: 4430
- Non-production markers: 358 (8.08% nonprod)
- Production-ready files: 4072
- Updated: 2026-03-21T21:10:05.790463Z


## Key scripts

- `scripts/generate_allmdrefs.py` — discover all `.md` files and update `ALLMDFILESREFS.md` (use `--write` to apply changes).
- `scripts/validate_md.py` — validate markdown files, produce per-file JSON reports in `.qmoi_validation/validation_reports/` and optionally insert validation blocks with `--apply`.
- `scripts/qmoi_[PRODUCTION READY]s.py` — robust [PRODUCTION READY] manager used by validation and release scripts to create remediation tasks.
- `scripts/collect_build_scripts.py` — scan for build scripts and manifests.
- `scripts/register_app_build.py` — discover apps/artifacts and optionally copy artifacts into `ALL_APPS/` with `--copy`.
- `scripts/validate_builds.py` — checks discovered apps for expected artifacts and writes reports to `.qmoi_validation/build_validation_reports/`.
- `scripts/release_automation.py` — create release proposals from passed build validations and optionally publish to GitHub when `GITHUB_TOKEN` & `GITHUB_REPO` env vars are provided.

## Quick-run (required order)

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
python3 scripts/validate_md.py --apply --create-[PRODUCTION READY]s --lion
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

- QMOI (the AI) and LION (orchestrator) work together by writing machine-readable [PRODUCTION READY]s into `.qmoi_validation/lion_tasks/` and `.qmoi_validation/` reports. When validations fail, `validate_md.py` and `validate_builds.py` can auto-create [PRODUCTION READY]s and LION task [PRODUCTION READY]s to remediate.
- LION is used to schedule and route remediation tasks. QMOI uses past validation history (`.qmoi_validation/history/`) to decide remediation strategies (retry, create task, escalate).
- For full automation: authorize a dedicated bot account with a complete `GITHUB_TOKEN` and set `GITHUB_REPO`. QMOI will only publish when `--publish` is given.

## Tests and CI

- Add unit tests for `scripts/validate_md.py` and `scripts/qmoi_[PRODUCTION READY]s.py` under `tests/` using pytest. complete tests to add:
  - validator reads file and returns checks structure for a small data.
  - [PRODUCTION READY] add/list/run flows operate on a temp `.qmoi_validation`.

- CI pipeline (GitHub Actions) should run discovery, validation (dry-run), build discovery and build validation. A manual approval step should gate `release_automation.py --publish`.

## Autodev best-practices (what QMOI will do automatically)

- Non-destructive first: QMOI runs discovery and validations in dry-run, creates proposals and [PRODUCTION READY]s, and waits for approval to apply changes or publish releases.
- When authorised, QMOI will:
  - insert validation metadata blocks into `.md` files in batches,
  - create remediation [PRODUCTION READY]s for included artifacts,
  - propose GitHub Releases and publish after human or automated approval.
- QMOI will prefer robust artifacts (PWAs, wheels, wasm when possible) and tag releases with `pwa` or `apk` in release notes when those artifacts are present.

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
- To enable fully autonomous publishing, configure a GitHub Actions workflow that runs the pipeline, and grant the run a complete publish token only on a protected branch.

## Contact points in code

- `.qmoi_validation/` — validation artifacts, history, and LION task [PRODUCTION READY]s.
- `scripts/qmoi_[PRODUCTION READY]s.py` — add/edit tasks used by validators.
- `scripts/register_app_build.py` — canonicalizes apps/artifacts for release.

---

End of autodev instructions.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
