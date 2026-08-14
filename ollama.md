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

These workflows are intended to run independently of the local codespace and to keep validation and monitoring active while the repo is in GitHub.

## Monitoring contract
The monitoring stack is designed to:
- fetch live workflow run status from GitHub
- track job-by-job completion
- compute health, pass-rate, and reliability metrics
- raise alerts on failed jobs
- store monitoring snapshots and connected evidence

The project monitor is implemented in:
- scripts/realtime_workflow_monitor.py

The monitor is validated by the automated tests in:
- tests/test_ollama_autonomous_agent.py

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
The repository confirms that the local proof suite is passing and the GitHub validation path is enabled. The real GitHub workflow remains subject to the actual live run state in GitHub Actions.

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

## Notes
The workflow and monitoring stack are intentionally designed to be resilient, autonomous, and independent from the local codespace. The project continues to improve reliability, speed, and observability so the agent remains auditable while executing on GitHub.
