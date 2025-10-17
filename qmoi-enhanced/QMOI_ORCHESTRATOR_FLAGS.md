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
