---
title: "Issue draft for QMOIJEST.md"
generated: 2025-11-08T16:06:38.323216Z
---

# Review needed: QMOIJEST.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOIJEST"
qmoi_validation_frontmatter: true
---

# QMOIJEST

## QMOI Jest Guide

Purpose: provide a concise, practical Jest setup for this repository (TypeScript + mixed JS/TS UI code, multi-package layout). The doc contains a recommended root config, CI snippets, test patterns, and integration notes for the autodev/autotest pipeline.

### Quick contract
- Inputs: source files (TS/JS/TSX/JSX) across repo and package workspaces, tests following patterns: `**/*.test.*`, `**/*.spec.*`, `**/*.integration.test.*`.
- Outputs: test results (exit code), coverage reports (lcov and JSON), optional snapshot diffs.
- Error modes: failing tests (non-zero exit), missing snapshots flagged, coverage thresholds exceeded.

### What we found in this repo
- Multiple package.json files contain `jest` devDependency entries and test scripts. There are existing test files like `src/hooks/useQmoiKernel.test.ts` and integration tests under `src/components/...integration.test.tsx`.
- Some validation and generated folders (e.g. `.qmoi_validation/` or `node_modules/`) pollute scans — those should be excluded from run-sets.

### Recommended root Jest configuration
Create a root `jest.config.cjs` (example included in this repo) and adapt per-package configs for specific needs. The root config is intentionally conservative and works with TypeScript via `ts-jest`.

Rationale:
- Single source of truth for CI runs.
- Supports per-package overrides via `projects` or local `jest.config.*` files.

### Running tests locally
- From repo root (if you use npm/yarn workspaces): `npm test` or `npx jest --coverage`.
- Recommended flags for local dev: `--watch --watchAll=false --findRelatedTests`.

### CI recommendations (GitHub Actions snippet)
Use a job that checks out code, installs deps, runs jest with coverage and fails on coverage thresholds. Example snippet (adapt to your CI runner):

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install
     
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
