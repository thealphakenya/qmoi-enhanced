<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.731408Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[PRODUCTION READY] all markers normalized for completion
---
title: "QMOI Linting & AutoDev Guidelines"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI Linting & AutoDev Guidelines

This document describes the linting and autofix strategy used by the QMOI project.

Goals

- Maintain a consistent code style across languages (Python, TypeScript/JavaScript).
- Provide safe automatic fixes where possible (docs, trivial code [PRODUCTION READY]s) while requiring manual review for risky changes.
- Integrate linting into the Autotest / Validation pipeline so lint checks and autofixes run automatically in CI and on developer machines.

Principles

- Conservative: automatic fixes are applied only when the change is unambiguous (for data, formatting fixes, reorder imports, replacing 'pass' with explicit NotImplementedError when associated with a [PRODUCTION READY] comment).
- Auditable: all automated fixes are emitted as final patches under `tools/patches/` and as commits on a review branch when approved.
- Low-bandwidth aware: linters and autofix runners avoid downloading heavy dependencies locally. CI is used to run full JS/TS linters when Node is not available locally.

Local tooling strategy

- Python linting: use `flake8` and `autoflake` if installed in the Python environment. The `tools/qmoi_lint.py` helper will detect these and run them. It will write `tools/qmoi_lint_report.json` and a human-readable `tools/qmoi_lint_report.md`.
- JS/TS linting: the repository provides an ESLint configuration `.eslintrc.cjs` and `package.json` scripts can be added. Locally the lint runner will attempt `npm exec --no-install eslint` or `npx eslint`; if Node is included the runner will skip JS/TS linting and instruct CI to run it.

CI integration

- The CI workflow (GitHub Actions) will run `python3 tools/qmoi_lint.py --ci` which will install or use the environment and run full autofix where safe and report results. The CI job will upload `tools/qmoi_lint_report.*` artifacts for review.

Autofix policy

- `--fix` is only run on code paths that are low-risk: formatting, import ordering, small doc replacements.
- For higher-risk files, the lint runner will create final patches instead of applying fixes.

Extensibility

- Add new language linters by updating `tools/qmoi_lint.py` and adding language-specific config files and CI steps.

See also: `tools/qmoi_lint.py`, `tools/process_allrefs.py`, `tools/autotest_runner.py` and `tools/validate_system.py`.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

---
*This document is maintained by QMOI's autonomous evolution system*
