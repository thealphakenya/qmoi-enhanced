# Ollama Autonomous Agent

## Purpose
The Ollama Autonomous Agent is the automation layer for QMOI validation, monitoring, branch sync, GitHub-hosted proof execution, and avatar/live UI validation. It is designed to operate independently of the local codespace and continue running in GitHub Actions wherever possible.

## Core responsibilities
- Validate platform compilation across Windows, macOS, Linux, iOS, Android, and Web.
- Validate platform-specific features across all QMOI apps.
- Run the automated proof suite in GitHub Actions.
- Monitor workflow execution in real time.
- Maintain branch sync policy between main and autosync-backup.
- Keep GitHub token resolution reliable across environment aliases.
- Validate QMOI avatar identity, live styling, preview clips, and voice profile choices.

## GitHub token contract
The agent resolves tokens in this order:
1. MY_CUSTOM_TOKEN
2. MY_CUTOM_TOKEN
3. GITHUB_TOKEN
4. GH_TOKEN
5. gh auth token fallback

This makes the GitHub automation robust even when environment names vary or older aliases are used.

## GitHub-hosted execution model
The repository runs the validation workflow in GitHub-hosted infrastructure through:
- .github/workflows/ollama-pr-validation.yml
- .github/workflows/pr-monitor.yml
- .github/workflows/workflow-tracker.yml
- .github/workflows/ollama-autonomous-agent.yml
- .github/workflows/branch-sync.yml

These workflows are intended to run independently of the local codespace and to keep validation and monitoring active while the repo is in GitHub.

## Monitoring contract
The monitoring stack is designed to:
- fetch live workflow run status from GitHub
- track job-by-job completion
- compute health, pass-rate, and reliability metrics
- raise alerts on failed jobs
- store monitoring snapshots and connected evidence
- keep watching queued or waiting runs instead of stopping early

The project monitor is implemented in:
- scripts/realtime_workflow_monitor.py

The monitor is validated by the automated tests in:
- tests/test_ollama_autonomous_agent.py

## Current live run links
The latest validation and sync runs currently visible in GitHub are:

- Validation run: https://github.com/thealphakenya/qmoi-enhanced/actions/runs/31844735339
- Branch sync run: https://github.com/thealphakenya/qmoi-enhanced/actions/runs/31844735360
- Validation workflow definition: https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-pr-validation.yml
- Branch sync workflow definition: https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/branch-sync.yml

Status as of the most recent check:
- 31844735339 — Ollama PR Validation - 293+ Platform Features — status: in_progress
- 31844735360 — Branch Sync Monitor & Auto-Update — status: in_progress

## Latest success and failure history
The recent GitHub history is evidence-driven and captures both proven success and the failure modes the monitor must catch quickly:

### Most recent successful validation
- 31844284176 — Add Alpha-Q-ai cross-repo autonomous production automation — success
  - Workflow: Ollama PR Validation - 293+ Platform Features
  - Outcome: validation passed after the abstraction-only repo proof fix
  - Evidence: all platform compilation jobs and validation jobs completed successfully

### Recent failures that were diagnosed
- 31844284038 — Add Alpha-Q-ai cross-repo autonomous production automation — failure
  - Workflow: Branch Sync Monitor & Auto-Update
  - Issue: the final "Report branch sync status" step failed even though repository sync tasks completed successfully
  - Root cause pattern: status-reporting step was brittle and did not gracefully handle the repo status after sync actions

- 31843812491 — Fix validation proof for abstraction-only repo and confirm GitHub aut… — failure
  - Workflow: Branch Sync Monitor & Auto-Update
  - Issue: same sync-status reporting failure after successful main/autosync-backup maintenance and Alpha-Q-ai sync actions

- 31844474518 — Harden monitoring detection and automation resilience — failure
  - Workflow: .github/workflows/auto-merge-automated-pr.yml
  - Issue: workflow-level automation failure during post-validation automation path

- 31844734643 — Fix queued workflow monitoring regression — failure
  - Workflow: .github/workflows/auto-merge-automated-pr.yml
  - Issue: post-validation automation failure while the queued-run monitor fix was being validated in GitHub

## Proof-oriented validation rule
The repository treats successful tests as evidence that the agent is able to validate its intended behaviors in GitHub-hosted execution. The suite covers:
- platform validation
- feature validation
- GitHub token resolution
- workflow monitoring state
- branch sync policy
- avatar identity and live preview checks
- voice profile selection
- GitHub proof and PR status expectations

## Current repository proof status
The repository confirms that the local proof suite is passing and the GitHub validation path is enabled. The live GitHub workflow remains subject to the actual run state in GitHub Actions, and the monitor now treats queued runs as active jobs instead of prematurely concluding them as finished.

## Commands
Run local validation:

```bash
pytest tests/test_ollama_autonomous_agent.py -q
```

Run the GitHub validation workflow manually:

```bash
gh workflow run ollama-pr-validation.yml --ref main --repo thealphakenya/qmoi-enhanced
```

Monitor the workflow:

```bash
gh run list --workflow='Ollama PR Validation - 293+ Platform Features' --repo thealphakenya/qmoi-enhanced --limit 10
```

Inspect an exact run:

```bash
gh run view 31844735339 --repo thealphakenya/qmoi-enhanced --json databaseId,status,conclusion,displayTitle,url,jobs
```

## Enhancement plan for the monitor
The monitor should continue to evolve in four layers:

1. Signal quality: detect queued, waiting, blocked, and in-progress states without false completion.
2. Evidence capture: keep per-run JSON snapshots, job logs, failure traces, and branch-sync summaries in one consistent artifact set.
3. Cross-workflow awareness: detect validation, branch-sync, and auto-merge jobs as separate phases and correlate them across the repo lifecycle.
4. Recovery automation: escalate to specific remediation steps when a job fails, for example by checking the exact failed step, outputting a failure summary, and recommending the next repair action.

This makes the monitoring stack more resilient, more audit-friendly, and better suited for autonomous GitHub execution.

## Notes
The workflow and monitoring stack are intentionally designed to be resilient, autonomous, and independent from the local codespace. The project continues to improve reliability, speed, and observability so the agent remains auditable while executing on GitHub.
