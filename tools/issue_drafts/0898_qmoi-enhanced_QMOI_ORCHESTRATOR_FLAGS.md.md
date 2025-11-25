---
title: "Issue draft for qmoi-enhanced/QMOI_ORCHESTRATOR_FLAGS.md"
generated: 2025-11-08T16:06:38.774792Z
---

# Review needed: qmoi-enhanced/QMOI_ORCHESTRATOR_FLAGS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
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

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
