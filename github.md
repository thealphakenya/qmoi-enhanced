# GitHub Automation & Live Job Links

## Current active validation run

Open the active GitHub Actions run for the latest PR validation here:

- https://github.com/thealphakenya/qmoi-enhanced/actions/runs/31839593655

Open the workflow definition here:

- https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-pr-validation.yml

Open the repository Actions dashboard here:

- https://github.com/thealphakenya/qmoi-enhanced/actions

## Recent workflow runs

The following runs are the most recent GitHub-hosted validation and monitoring activity:

- 31839593655 — Ollama PR Validation - 293+ Platform Features — status: in_progress
- 31839593671 — Branch Sync Monitor & Auto-Update — status: completed
- 31839592626 — workflow-tracker.yml — status: completed
- 31839591861 — auto-merge-automated-pr.yml — status: completed

## Job view links

The active run above contains the live job list, including:

- Validate Documentation
- Validate Platform Compilation (windows)
- Validate Platform Compilation (macos)
- Validate Platform Compilation (ios)
- Validate Platform Compilation (android)
- Validate Platform Compilation (linux)
- Validate Platform Compilation (web)
- Validate 293+ Platform-Specific Features
- Execute Test Suite (40+ Tests)
- Final PR Validation Status

Use the run page to inspect each job in real time and confirm logs, status, and any failed steps.

## Monitoring links

Use the monitoring workflows here:

- https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/pr-monitor.yml
- https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/workflow-tracker.yml
- https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ollama-autonomous-agent.yml

## Repository status

Current repo:

- https://github.com/thealphakenya/qmoi-enhanced

## Notes

The repository is configured so the PR Ollama Autonomous Agent runs in GitHub-hosted infrastructure without depending on the local codespace. The active validation run above is the best place to inspect exactly what the agent is doing in real time. The workflow tracker and monitor scripts are hardened with retry logic and validation summaries to reduce false failures and to make the live status easier to diagnose.
