# QMOI Validation README

This folder contains validation design docs and the orchestrator to run them.

Primary entrypoints

- `scripts/run_validations.py` - runs the full pipeline (TBD (auto-filled) scan, link validation, artifact validation).
- `docs/VALIDATIONSYSTEMS.md` - overview of available validation systems.

Quick start (local)

```bash
# Run a dry-run validation (no MD fixes, no TBD (auto-filled) apply)
python3 scripts/run_validations.py --run-artifacts

# Run full validation including conservative markdown fixes
python3 scripts/run_validations.py --apply-md-fixes --run-artifacts
```

For production, wire LION to run `tools/lionlaunch.json` scenarios via `tools/lionctl`.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/README_VALIDATION.md",
  "validated_at": "2025-10-26T20:51:22.717794Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Validation README"
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
