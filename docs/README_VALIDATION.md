# QMOI Validation README

This folder contains validation design docs and the orchestrator to run them.

Primary entrypoints

- `scripts/run_validations.py` - runs the full pipeline (placeholder scan, link validation, artifact validation).
- `docs/VALIDATIONSYSTEMS.md` - overview of available validation systems.

Quick start (local)

```bash
# Run a dry-run validation (no MD fixes, no placeholder apply)
python3 scripts/run_validations.py --run-artifacts

# Run full validation including conservative markdown fixes
python3 scripts/run_validations.py --apply-md-fixes --run-artifacts
```

For production, wire LION to run `tools/lionlaunch.json` scenarios via `tools/lionctl`.

