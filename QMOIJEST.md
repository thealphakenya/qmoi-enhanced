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
        run: npm ci
      - name: Run tests
        run: npx jest --coverage --runInBand
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

Notes:
- `--runInBand` is safe on CI but slows execution; remove it on runners with multiple cores and allow Jest to parallelize.

### Performance & parallelization
- Use Jest caching (default) and `--maxWorkers` to control CPU usage (e.g., `--maxWorkers=50%`).
- For large monorepos, run tests per package in parallel using CI matrix or `projects` entries in Jest config.

### Snapshot & test data hygiene
- Keep snapshots in the same repo and review snapshot updates carefully.
- Add `--updateSnapshot` only when intentionally updating.

### Coverage and quality gates
- Set sensible coverage thresholds in `jest.config.cjs` (example has a moderate threshold). Keep coverage gating in CI to prevent regressions.

### Integration with autodev/autotest pipeline
- Add a Jest step to `tools/autotest_runner.py` to run `npx jest --coverage --silent --colors=false` and write results to `tools/jest_results.json` (or use `--json --outputFile=...`).
- Use test results to gate auto-promote or canary rollout in the autodev flow.

### Edge cases and notes
- Exclude generated and vendor directories from patterns: `.qmoi_validation/`, `node_modules/`, `dist/`, `build/`.
- If monorepo uses workspaces, prefer running tests per workspace for quicker incremental runs.

### Next steps (low-risk)
1. Add/confirm `jest.config.cjs` at the repo root (we added a conservative example alongside this doc).
2. Add a small `jest.setup.js` for common test setup (e.g., `@testing-library/jest-dom`).
3. Wire a Jest run step into `tools/autotest_runner.py` that produces JSON output for automation.
4. Triage `tools/link_report.md` and `matches.json` to exclude generated artifacts and reduce noise for test/scan jobs.

If you want, I can now:
- add a small `jest.setup.js` and wire the `tools/autotest_runner.py` to run jest and collect JSON results, then run it (may be slow depending on repo size).

-- QMOI Automation

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
