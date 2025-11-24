---
title: "QMOI ORCHESTRATOR FLAGS"
qmoi_validation_frontmatter: true
---

# QMOI ORCHESTRATOR FLAGS

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

QMOI Orchestrator — manifest flags

This short companion file documents the manifest-related CLI flags for `qmoi_orchestrator.py`.

- --manifest-write
  If no `.qmoi/runner_manifest.json` exists on the runner, passing this flag will make the orchestrator attempt to run:
  `deploy/qcity/generate_runner_manifest.py --apply`
  to create a manifest. The generator is conservative and will write a JSON manifest describing the runner's discovered capabilities.

- --runner-id <id>
  When used together with `--manifest-write`, the supplied runner id will be passed to the generator and embedded in the generated manifest. This helps identify the runner in a fleet.

Notes
- Both flags are safe to use in dry-run mode. To actually write files and start services, pass `--apply` or omit `--dry-run`.
- The orchestrator will still respect existing manifests; `--manifest-write` only triggers generation when a manifest is missing.
- If the manifest generator is not present in `deploy/qcity/`, the orchestrator will log a warning and continue in dry-run.

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/QMOI_ORCHESTRATOR_FLAGS.md",
  "validated_at": "2025-10-26T20:51:24.816421Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
