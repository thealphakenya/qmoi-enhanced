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

```bash
export GITHUB_TOKEN=<token>
python scripts/monitor_workflows.py
```

The script reports:

- Latest run for each workflow
- In-progress job status
- Completed success or failure
- A final count of passed, failed, and pending workflows

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
- [Dependabot security alerts](https://github.com/thealphakenya/qmoi-enhanced/security/dependabot)

Last updated: 2026-08-29
