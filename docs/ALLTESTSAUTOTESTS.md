---
title: "ALLTESTSAUTOTESTS.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# ALLTESTSAUTOTESTS.md

Purpose
- A single reference file listing all tests and autotests, their purposes, how to run them locally and in CI, and how they integrate with self-heal and autodev.

Structure
- Unit tests
  - folder: `packages/*/test` or `__tests__`
  - runner: jest (see `jest.config.js`) or `pytest` for Python
  - purpose: fast checks of core functions
- Integration tests
  - runner: play scripts or integration suite
  - purpose: test interaction between modules (API, DB, runners)
- End-to-end tests
  - tools: Playwright / Cypress / puppeteer or custom harness
  - purpose: full-user flows, eg: extension start, chat UI open, to-do automation flow
- Self-heal tests
  - purpose: simulate failures and assert self-heal reactions (restart, fallback)
  - example: bring down a service and assert auto-restart via orchestration scripts
- Autodev tests
  - purpose: validate autodev pipelines (builds, cross-platform artifacts)
  - example: run build scripts for linux/mac/win in isolated containers

How to run
- Local quick-run (unit): `npm test` (or `pnpm test`) in service/package
- CI: GitHub Actions workflows will run the matrix across OS/Node versions

Integration with self-heal & autodev
- Tests should be labeled with metadata tags so the autotest runner can pick them (eg: `[self-heal]`, `[autodev]`).
- The autotest runner collects results and decides remediation: re-run, add to todo, create incident.

Files & CI refs
- Add CI workflow: `.github/workflows/autotests.yml` that runs the full test matrix and uploads artifacts.

Next steps
- Generate test list automatically using `scripts/generate_test_index.py` (todo)
- Add descriptions for tests listed in `teststoadd.txt` and map them to CI jobs

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/ALLTESTSAUTOTESTS.md",
  "validated_at": "2025-10-26T20:51:22.673313Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "ALLTESTSAUTOTESTS.md"
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

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
