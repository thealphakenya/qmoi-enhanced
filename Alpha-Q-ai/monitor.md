# GitHub Workflow Monitoring

Practical reference for monitoring the GitHub-hosted workflows in
`thealphakenya/qmoi-enhanced`.

## Workflows Covered

| Workflow | Role | Trigger or cadence |
| --- | --- | --- |
| `ollama-pr-validation.yml` | Platforms, features, tests, documentation | Push, pull request, manual |
| `ollama-master-orchestrator.yml` | Preflight, validation, agent dispatch | Schedule, manual |
| `ollama-autonomous-agent.yml` | Ollama bootstrap, inference, coding loop, final gate | Workflow completion, schedule, manual |
| `ollama-autonomous-agent-realtime-monitor.yml` | Observes workflow and agent progress | Scheduled monitoring |
| `ollama-live-activity-stream.yml` | Publishes the live Ollama activity stream and tracker heartbeat to GitHub artifacts | Schedule, workflow events, manual |
| `qmoi-live-activity-stream.yml` | Publishes the live QMOI repo-health and system-activity stream to GitHub artifacts | Schedule, workflow events, manual |
| `branch-sync.yml` | Repository and branch synchronization | Schedule, repository events |
| `auto-merge-automated-pr.yml` | Merges eligible validated PRs | Pull request events |
| `pr-monitor.yml` | Tracks pull request checks and status | Pull request events |
| `workflow-tracker.yml` | Records workflow lifecycle metrics | Workflow events |

All runs execute on GitHub-hosted runners. Local tests can validate code, but
cannot prove that a GitHub-hosted runner started Ollama or performed real LLM
inference.

## Option 1: GitHub Actions Web UI

No local setup is required.

1. Open the [GitHub Actions dashboard](https://github.com/thealphakenya/qmoi-enhanced/actions).
2. Select a workflow from the left sidebar.
3. Open the newest run and watch its jobs and live logs.
4. Open **Summary** and inspect the conclusion and uploaded artifacts.
5. Download the autonomous-agent artifact before declaring success.

Direct workflow pages:

- [PR Validation](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-pr-validation.yml)
- [Master Orchestrator](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-master-orchestrator.yml)
- [Autonomous Agent](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-autonomous-agent.yml)
- [Realtime Monitor](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-autonomous-agent-realtime-monitor.yml)
- [Branch Sync](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/branch-sync.yml)
- [Auto-Merge](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/auto-merge-automated-pr.yml)
- [PR Monitor](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/pr-monitor.yml)
- [Workflow Tracker](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/workflow-tracker.yml)

## Option 2: GitHub CLI

Authenticate once, then use the commands below:

```bash
gh auth login
gh run list -R thealphakenya/qmoi-enhanced -L 20
```

List one workflow:

```bash
gh run list -R thealphakenya/qmoi-enhanced \
  -w ollama-autonomous-agent.yml -L 5
```

Watch a run until GitHub reports completion:

```bash
gh run watch <RUN_ID> -R thealphakenya/qmoi-enhanced
```

Inspect jobs and conclusion:

```bash
gh run view <RUN_ID> -R thealphakenya/qmoi-enhanced \
  --json name,status,conclusion,jobs,createdAt,updatedAt
```

Show failed-step logs:

```bash
gh run view <RUN_ID> -R thealphakenya/qmoi-enhanced --log-failed
```

Download all artifacts for a run:

```bash
gh run download <RUN_ID> -R thealphakenya/qmoi-enhanced -D ./artifacts
```

Trigger a manually enabled workflow:

```bash
gh workflow run <WORKFLOW_FILE> -R thealphakenya/qmoi-enhanced
```

## Option 3: Repository Monitor Script

The repository monitor polls the latest run for each of the eight workflows and
waits for active runs to finish. It needs GitHub CLI access through
`GITHUB_TOKEN` or an authenticated `gh` installation.

The monitor also emits a richer live report through `WorkflowMonitor.build_qmoi_ollama_status_report()`. This report now checks the following remote and repo-health gates in real time:

- PR success status from the last successful autonomous-agent workflow run
- current `qmoi-enhanced` branch cleanliness and sync state
- `Alpha-Q-ai` availability, branch health, and dirty/out-of-sync warning state
- QMOI memory-health coverage using the active memory index and telemetry files
- archive awareness for `qmoi-enhanced-history-14`, `ollamatracks`, and other operational history directories
- QCity live automation surfaces across GitHub, Gitpod, Vercel, Hugging Face, and QVillage
- final repository state readiness for remote continuation and autonomous uptime

### QCity automation live monitoring

The live agent also validates that QCity is exposed as an automation-capable app across the cloned platform surfaces expected by the historical runtime layer:

- GitHub repo automation: repository creation, actions, pages, codespaces, and repo orchestration
- Gitpod workspace automation: workspaces, environments, and collaborative session setup
- Vercel deployment automation: deploys, domains, functions, analytics, and release checks
- Hugging Face space automation: model publishing, spaces, datasets, and inference routing
- QVillage sync automation: network coordination, device sync, and auto-update orchestration

These are tracked as a live platform matrix in the autonomous-agent telemetry so the agent can verify the automation layer is still present even when the repo is running remotely without a local codespace.

The status payload includes:

```python
{
  "qmoi": {...},
  "alpha_q_ai": {...},
  "memory_sync": {...},
  "archive_awareness": {...},
  "ollama_autonomous_agent": {...},
  "live_activity_stream": [
    {"source": "qmoi", "event": "repo_health", "status": "healthy", ...},
    {"source": "ollama_autonomous_agent", "event": "workflow_run", "status": "running", ...},
  ],
  "health_gates": {
    "pr_success": True,
    "final_repo_state": "ready",
    "repo_clean": True,
    "alpha_q_ai_healthy": True,
    "memory_sync_healthy": True,
    "archive_aware": True,
  },
}
```

## Live activity stream contract (GitHub-visible)

Two dedicated workflow streams are used to keep the source of each event explicit and visible in GitHub:

- `ollama-live-activity-stream.yml` publishes the Ollama autonomous-agent stream, including workflow run status, tracker heartbeat, and latest activity updates.
- `qmoi-live-activity-stream.yml` publishes the QMOI repo-health stream, including branch health, dirty/behind state, and the current QMOI operating status.

Each workflow writes its own JSON payload to `ollamatracks/` and uploads it as a GitHub Actions artifact, while the combined stream is also retained as `ollamatracks/live_activity_stream.json` for local monitoring and remote continuity.

The stream format is intentionally source-aware:

- `source == "qmoi"` identifies QMOI system activity
- `source == "ollama_autonomous_agent"` identifies Ollama autonomous-agent activity
- `event` identifies the lifecycle event, such as `repo_health`, `workflow_run`, or `tracker_heartbeat`
- `status` stays explicit (`healthy`, `warning`, `running`, `success`, `failure`, `idle`, etc.)

This keeps both runtime streams independently monitorable while still being merged into one unified data model for internal health checks.

This is the same contract used to answer whether the autonomous agent is truly running, whether the final repo is healthy, whether the memory is synchronized, and whether the archived QMOI state is still visible and recoverable.

## Resume provenance and change detection

`resumefromhere.txt` is now treated as a live operational ledger with source provenance. QMOI records the last writer in a metadata block and a JSON state snapshot so the repository can detect whether a change was created by the Ollama autonomous agent or by a human/manual edit.

The detection flow is:

- `update_resume_file_metadata(..., source="ollama_autonomous_agent")` stamps the file with the writer metadata block and updates `.ollama_agent_state.json`.
- `detect_resume_file_origin()` compares the current file hash against the last recorded checksum.
- If the checksum changed and the file metadata no longer matches the last agent writer, the repo marks the change as `manual`.
- The live monitor and automation layer can then choose the correct follow-up action without confusing the two sources.

This gives QMOI the ability to re-read the resume file, notice the origin of work, and automatically continue the right plan without losing the handoff path between human and autonomous updates.

## Remote health gates for autonomous continuity

The monitor now treats the following as required operational gates before the repo is considered in a healthy autonomous state:

1. the latest Ollama autonomous-agent workflow has a successful outcome
2. the `qmoi-enhanced` local repo is not dirty or behind its tracked branch
3. the `Alpha-Q-ai` repo is reachable and not dirty or behind
4. the active memory indexes and tracking telemetry are present and readable
5. the archive inventory is present so the agent remains aware of all historical versions and state data
6. the final repo state is not in warning mode before remote continuation is declared

If any gate is degraded, the monitor reports a `warning` state instead of claiming final health.

## Automated monitoring checklist

Use this checklist for `GitHub-hosted` monitoring and remote continuity:

- [ ] `CURRENT_STATUS.txt` and `LATEST_ACTIVITY.txt` are fresh
- [ ] `STATE.txt` and `PR_STATUS.txt` match the active phase and status
- [ ] `telemetry.jsonl` has recent heartbeat entries
- [ ] the latest autonomous-agent workflow shows success or a safe in-progress state
- [ ] `Alpha-Q-ai` is healthy and synced
- [ ] memory indexes are present and readable
- [ ] archive inventory is visible to the agent
- [ ] the final repo state is `ready` or `healthy`

## Option 4: Terminal Watch Commands

Refresh the latest runs every minute:

```bash
export GITHUB_TOKEN=<token>
python scripts/monitor_workflows.py
```

The script reports:

- Latest run for each workflow
- In-progress job status
- Completed success or failure
- A final count of passed, failed, and pending workflows

The lower-level `scripts/realtime_workflow_monitor.py` also exposes a monitor-of-monitor health contract through `build_tracker_health()`. It checks that `CURRENT_STATUS.txt`, `STATE.txt`, and `telemetry.jsonl` exist, parses the newest telemetry heartbeat, reports its age, and marks the tracker `degraded` when telemetry is missing, invalid, or older than the configured freshness window. This prevents a silent stale monitor from being treated as live health.

Use a token with the minimum read permissions needed for Actions and repository
metadata. Never place a token in a file, workflow log, issue, or artifact.

## Option 4: Terminal Watch Commands

Refresh the latest runs every minute:

```bash
watch -n 60 'gh run list -R thealphakenya/qmoi-enhanced -L 20'
```

Show compact JSON status for all recent runs:

```bash
watch -n 30 'gh run list -R thealphakenya/qmoi-enhanced -L 20 --json number,name,status,conclusion,updatedAt'
```

For a single active run, prefer `gh run watch`, which understands GitHub run
state and exits when the run completes.

## Option 5: Dashboard and Documentation

Use these repository references alongside the live Actions UI:

- [WORKFLOW_STATUS_DASHBOARD.md](WORKFLOW_STATUS_DASHBOARD.md): phase checklist and expected jobs
- [REAL_TIME_MONITORING_GUIDE.md](REAL_TIME_MONITORING_GUIDE.md): detailed monitoring and diagnostics
- [GITHUB_ACTIONS_EXECUTION_GUIDE.md](GITHUB_ACTIONS_EXECUTION_GUIDE.md): execution timeline and gates
- [MONITORING_SUMMARY.md](MONITORING_SUMMARY.md): quick operational summary
- [github.md](github.md): current status and hosted-run notes

The dashboard generator can recreate the phase checklist:

```bash
python scripts/workflow_status_dashboard.py
```

## Monitoring Order

Follow the dependency order for a complete execution:

1. `ollama-pr-validation.yml`: every required job passes and the test count is
   fully successful.
2. `ollama-master-orchestrator.yml`: preflight and comprehensive validation
   pass, then the autonomous workflow is dispatched.
3. `ollama-autonomous-agent.yml`: inspect every Ollama and LLM gate.
4. Realtime monitor, PR monitor, workflow tracker, and branch sync: inspect
   their outcomes and diagnostics as parallel operations finish.
5. Auto-merge: verify checks and approvals before treating a merge as valid.

A monitor or tracker workflow provides observability. It does not replace the
agent's final health gate and must not independently claim autonomous success.

## Autonomous-Agent Proof Requirements

A green workflow check alone is insufficient. The autonomous-agent artifact
must contain `ollamatracks/OLLAMA_SUCCESS.json`, and the JSON must satisfy all
of these requirements:

```bash
jq '.final_status' artifacts/ollamatracks/OLLAMA_SUCCESS.json
jq '{ollama_started,ollama_healthy,model_available,inference_verified,
     llm_coding_started,validation_passed,checkpoint_created}' \
  artifacts/ollamatracks/OLLAMA_SUCCESS.json
```

Accept success only when:

- `final_status` is exactly `"SUCCESS"`.
- `ollama_started` and `ollama_healthy` are `true`.
- `model_available` is `true` for the configured model.
- `inference_verified` is `true` after real `/api/generate` inference.
- `llm_coding_started` is `true` and the bounded loop completed.
- `validation_passed` is `true` after the loop.
- `checkpoint_created` is `true`.
- The contract belongs to the expected repository, commit, and workflow run.

If the contract is missing, stale, incomplete, or has any failed required
field, the autonomous workflow is not successful regardless of other green
checks or log messages.

## Evidence to Download

For the autonomous-agent run, preserve these files when available:

- `ollamatracks/OLLAMA_SUCCESS.json`: final machine-readable proof
- `ollamatracks/ollama-server.log`: server startup and health diagnostics
- `ollamatracks/agent_run_*.log`: agent and inference execution logs
- `ollamatracks/telemetry.jsonl`: ordered lifecycle events
- `ollamatracks/CURRENT_STATUS.txt`: latest agent state
- `ollamatracks/checkpoint.json`: resumable execution state
- `github_proof_contract.json`: validation proof from the repository pipeline

## Failure Handling

| Observation | Action |
| --- | --- |
| Run is queued | Continue polling; inspect runner availability and the event that triggered it. |
| Validation job fails | Open that job's log, reproduce locally, fix the root cause, and rerun. |
| Ollama bootstrap fails | Inspect `ollama-server.log`; do not treat validation-only success as agent success. |
| Model or inference gate fails | Inspect agent logs and telemetry; the final contract must remain failed or absent. |
| Post-loop validation fails | Treat the run as failed and inspect the changed files and test output. |
| Contract is missing or invalid | Treat the autonomous execution as failed, even if the workflow log says success. |
| Monitor workflow fails | Use the Actions UI or CLI directly; an observer failure does not prove agent success. |

## Completion Checklist

- [ ] All required PR validation jobs passed.
- [ ] Master orchestrator passed and dispatched the agent.
- [ ] All eight workflow runs were reviewed or explicitly marked not triggered.
- [ ] Autonomous-agent run completed on the expected commit.
- [ ] Ollama server health was verified on the hosted runner.
- [ ] Configured model availability was verified.
- [ ] Real inference was verified.
- [ ] Post-loop validation passed.
- [ ] `OLLAMA_SUCCESS.json` was downloaded and checked.
- [ ] `final_status` is exactly `SUCCESS`.
- [ ] Artifacts and run links were retained for auditability.

## Live Links

- [Repository Actions](https://github.com/thealphakenya/qmoi-enhanced/actions)
- [Repository](https://github.com/thealphakenya/qmoi-enhanced)
- [Repository security](https://github.com/thealphakenya/qmoi-enhanced/security)

Last updated: 2026-09-18
