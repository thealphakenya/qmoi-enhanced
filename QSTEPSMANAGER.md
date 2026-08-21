# Q Steps Manager

**Status:** Active contract for workflow, script, and test execution
**Schema:** `qsteps-v1`

The Q Steps Manager gives every executable step a durable lifecycle: identify, checkpoint, execute, classify failures, retry only after productive recovery, and publish evidence. It complements `AutonomousStepManager` in `scripts/ollama_autonomous_agent.py` and the GitHub adapter in `scripts/qsteps_manager.py`.

## Required Lifecycle

1. **Discover** the step owner, inputs, dependencies, timeout, and expected output.
2. **Name** the step with a stable identifier.
3. **Checkpoint** before execution and after each state transition.
4. **Execute** with strict shell failure handling or a bounded Python action.
5. **Measure** start/end time, attempt, status, and evidence paths.
6. **Classify** missing-file, source/dependency, transient/I/O, validation-contract, or manual-review failures.
7. **Repair** only deterministic failures and record the repair.
8. **Retry** only when the repair is productive and within the attempt budget.
9. **Circuit-break** repeated identical failures using a stable fingerprint.
10. **Verify** the expected output, not merely the process exit code.
11. **Publish** JSONL telemetry and a current status projection.
12. **Resume** from the last successful step after interruption.
13. **Preserve** logs and artifacts on failure with `if: always()`.
14. **Separate** trusted default-branch execution from untrusted PR metadata.
15. **Pin** action major versions and reject deprecated artifact actions.
16. **Bound** runtime, retries, polling, API pages, and artifact retention.
17. **Validate** YAML, Python syntax, contracts, and tracked evidence before merge.
18. **De-duplicate** repeated events using run, job, attempt, and step identity.
19. **Escalate** ambiguous conflicts or destructive Git operations for review.
20. **Record** merge audits before any explicit fetch, merge, or push.
21. **Compare** all reachable branches and tracked files before cross-repository integration.
22. **Inspect** all QMOI history and at least four recent Alpha-Q-ai commits.
23. **Attribute** changes to author, email, timestamp, subject, hash, branch, and path.
24. **Update** `MERGE.md` with every recorded merge plan and result.
25. **Regenerate** `WORKFLOWSO.md` and tracking artifacts when workflow contracts change.
26. **Test** recovery, repeated-failure circuit breaking, idempotency, and schema validity.
27. **Keep** publication explicit: the manager never commits, pushes, merges, or deletes by itself.
28. **Use** least-privilege GitHub permissions and never print credentials.
29. **Expose** a concise job summary with status, counts, duration, and evidence links.
30. **Finish** with a final status step that aggregates dependencies and preserves failures.

## Workflow Contract

Every workflow YAML file must define `QSTEPS_MANAGER: qsteps-v1` and include a manager lifecycle step in each job that executes repository code. The standard runner command is:

```bash
python3 scripts/qsteps_manager.py start --step "$GITHUB_JOB:step-name"
```

A successful job records `complete`; a failing path records `fail` through the job's existing error handling. Tracking is append-only in `ollamatracks/qsteps.jsonl` with the latest record projected to `ollamatracks/QSTEPS_STATUS.json`.

## Metrics

Required evidence fields are timestamp, workflow, job, run, attempt, stable step name, status, error category when applicable, duration when known, and artifact path. The useful operational measures are pass rate, retry rate, repeated-failure count, median duration, stale-checkpoint age, artifact availability, and unresolved manual-review count.

## Python/Test Contract

Python orchestration uses `AutonomousStepManager.run_step`; tests must cover successful execution, productive repair, repeated-failure circuit breaking, checkpoint writes, telemetry records, and resumed execution. Workflow tests must parse every `.yml`/`.yaml`, verify the manager schema, and ensure no workflow removes required evidence or security boundaries.

## Cross-Repository Boundary

The manager may create read-only plans for `thealphakenya/qmoi-enhanced` and `thealphakenya/Alpha-Q-ai`, including branches, tracked files, authors, timestamps, and history. Network fetches, merges, and pushes remain explicit operations. A plan is not a merge, and no absent remote data is represented as completed work.

## Autonomous Repair Plan and Controls

The autonomous agent repair boundary is designed for fast recovery while keeping destructive operations reviewable:

1. Detect missing files and classify critical versus optional dependencies.
2. Normalize workflow text before attempting a repair.
3. Parse every workflow after an edit and require the `qsteps-v1` contract.
4. Compile every Python script after source changes.
5. Write repairs atomically through a temporary file replacement.
6. Create a timestamped backup before replacing existing content.
7. Support dry-run repair planning without mutating the repository.
8. Reject paths outside the checked-out repository.
9. Reject renames when the source is absent or destination already exists.
10. Record repair, rename, backup, and validation evidence in tracker telemetry.
11. Bound retries and stop repeated identical failures through stable fingerprints.
12. Preserve Git-index backups and restore them when recovery validation fails.
13. Upload logs, checkpoints, summaries, and recovery artifacts with `if: always()`.
14. Re-run the narrow failing validation before broad validation or publication.

The agent does not claim to repair arbitrary semantic defects automatically. Ambiguous source changes, dependency changes, merge conflicts, credentials, and destructive Git operations remain explicit review boundaries.

## Implemented Adapter Enhancements

The GitHub adapter now provides atomic projections, append-only JSONL evidence, stable event identity and duplicate suppression, checkpoints, bounded attempt metadata, failure classification, duration and evidence links, a current summary projection, and safe handling of malformed historical telemetry. It never performs Git mutations or publishes credentials.

The adapter also supports a `heartbeat` lifecycle event for long-running jobs, rejects attempts above the configured budget, records repository/ref/SHA/actor provenance, reports total and per-step event counts, optionally writes to `GITHUB_STEP_SUMMARY`, and bounds retained telemetry through `QSTEPS_MAX_RECORDS`. These controls are deliberately local and fail closed; they do not retry commands, mutate Git, or claim that a remote Action succeeded.

For new command-oriented steps, use `python3 scripts/qsteps_manager.py run --step "name" -- <command> [args...]`. This single entry point records start, completion or failure, duration, return code preservation, and evidence metadata, allowing workflow authors to adopt the shared lifecycle without reproducing telemetry logic.

This is the intentionally small maintenance API: update the manager or the command it invokes, then apply that contract to one or many files through the existing workflow/script command. The manager can orchestrate validation and deterministic repair tools without opening each target file; it does not invent semantic edits or perform blind destructive rewrites.

For a complete local or hosted gate, use `python3 scripts/qsteps_manager.py validate-all --root .`. It discovers every workflow and script, validates the shared workflow contract, compiles all scripts, optionally runs `pytest tests -q`, writes `QSTEPS_VALIDATION.json`, and returns nonzero for any unresolved issue. Use `--skip-tests` only when a later job owns the test suite.

The realtime monitor polls bounded GitHub notifications with the configured token, summarizes unread workflow/agent items, and stores that state with each workflow snapshot. A custom token with notification-read access is required for user-level notifications; the default Actions token remains sufficient for workflow and repository telemetry.

Every agent event and realtime monitor snapshot also writes a human-readable `ollamastatus.txt *.txt` record under `ollamatracks/`. These timestamped records preserve status, phase, event, run identity, metrics, and details for historical inspection while the mutable projections remain optimized for current state.
