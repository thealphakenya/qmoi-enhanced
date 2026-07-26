# ollama.md

This document describes the Ollama autonomous agent capabilities, production expectations, and current orchestration behavior.

## Purpose

- Document the autonomous Ollama agent's feature set and the exact repository automation it performs.
- Record how the agent resumes work, merges archives, updates docs, and validates the repository.
- Serve as both a user-facing agent spec and a machine-generated verification artifact.

## Core capabilities

- Resume execution from the last run using .ollama_agent_state.json and processed item history.
- Detect changes to resumefromhere.txt and refresh the execution plan automatically.
- Maintain resumefromhere.txt as the authoritative source of truth for pending work, progress, and journey map tracks.
- Scan archive/backup directories for missing or unmerged files and merge them into the working tree.
- Scan download/app/build/release documentation for referenced .py scripts and ensure those scripts are present, updated, or noted.
- Generate and synchronize manifest files for APIs, endpoints, routes, merge operations, documentation inventory, production readiness, and error tracking.
- Create or refresh tests for discovered Python modules and update ALLTESTSAUOTOTESTS.md accordingly.
- Create or refresh hooks/webhooks documentation and record workflow token gaps in ALLHOOKSWEBHOOKS.md.
- Normalize local development ports to production port equivalents in repository files.
- Start a local helper server and optional production helper server for verification endpoints.
- Run safe repository verification with pytest and Python compile checks when requested.
- Persist audit logs, live notifications, and completion reports for every autonomous run.

## Execution behavior

- On each run, the agent loads state, checks resumefromhere.txt, merges archives, gathers pending work, and updates the plan.
- It writes JOURNEY MAP TRACKS at the top of resumefromhere.txt with counters for pending_before, pending_after, merged_archives, and verification status.
- It updates resumefromhere.txt with progress counts, a progress ledger, repository inventory, and explicit agent instructions.
- If AUTO_CONTINUE=1 is enabled, the agent loops until no pending items remain or iteration limits are reached.
- If RUN_FULL_TESTS=1 is set, the agent starts a production helper server and performs verification even if pending work remains.
- It avoids infinite loops by tracking processed items and stopping when no new progress is made.

## Required artifacts

- API.md, ENDPOINTS.md, ROUTES.md, MERGE.md, DOCS.md, production.md, productionenhanced.md, ALLERRORS.md, ALLBACKEND.md, ALLFRONTEND.md, ALLUI.md, ALLPORTS.md, UNIVERSALS.md, STYLES.md, resumefromhere.txt, OLLAMA_ACTIVITY_FEED.md.
- These artifacts are verified as present and non-empty on each run.

## Reporting

- OLLAMA_ACTIVITY_FEED.md is updated with the latest status and branch metadata.
- OLLAMA_PENDING_REPORT.md and OLLAMA_COMPLETION_REPORT.md are generated for pending work and completion summaries.
- The agent writes .ollama_agent_audit.jsonl and .ollama_agent_state.json for runtime traceability.

## Change control

- The agent creates backups for files it modifies when feasible, using .ollama.bak and audit markers.
- It refrains from destructive replacements and preserves audit trails for every automated change.

## Ollama trigger workflow

The repository includes a dedicated **Ollama trigger workflow** (`.github/workflows/ollamatrigger.yml`) that enables manual execution of the autonomous agent with identical behavior to scheduled runs.

### Purpose

- Allows on-demand execution of the Ollama autonomous agent from the GitHub Actions UI.
- Runs with the same environment variables and push behavior as the scheduled workflow.
- Integrates with the autonomous agent script to ensure consistent behavior across manual and scheduled execution.

### How to use the trigger workflow

1. **Access the workflow**: Go to your repository on GitHub → **Actions** → **Ollama trigger workflow**.
2. **Run manually**: Click **Run workflow** → confirm on the default branch (`autosync-backup-20250926-232440`).
3. **Monitor the run**: The workflow runs the autonomous agent and pushes results to the `autosync` branch.
4. **Review outputs**: Check **OLLAMA_ACTIVITY_FEED.md**, **OLLAMA_PENDING_REPORT.md**, and **OLLAMA_COMPLETION_REPORT.md** for execution details.

### Environment variables and behavior

The trigger workflow sets:

- `AUTO_CONTINUE=1`: Agent loops through batches until pending items are complete or iteration limit is reached.
- `AUTO_CONTINUE_MAX=20`: Maximum iterations before stopping.
- `AUTO_CONTINUE_BATCH=200`: Items processed per batch.
- `AUTO_PUSH=1`: Autonomous agent automatically commits and pushes changes to the `autosync` branch.
- `TARGET_BRANCH=autosync`: All commits are pushed to the `autosync` branch.
- `GITHUB_TOKEN`: Uses `MY_CUSTOM_TOKEN` (recommended) or falls back to `GITHUB_TOKEN` for git operations.

### Authentication

The trigger workflow requires GitHub credentials to perform git operations (clone, commit, push):

- **Recommended**: Set a personal access token as a repository secret named `MY_CUSTOM_TOKEN`.
- **Fallback**: If `MY_CUSTOM_TOKEN` is not set, the workflow uses the default `GITHUB_TOKEN`.

To set up a personal access token:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. Generate a new token with `repo`, `read:org`, and `write:org` scopes.
3. Copy the token and add it as a repository secret:
   - Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
   - Name: `MY_CUSTOM_TOKEN`.
   - Value: paste the token.

### Equivalence with local execution

Running the trigger workflow is equivalent to running:

```bash
cd /workspaces/qmoi-enhanced
env AUTO_CONTINUE=1 AUTO_CONTINUE_MAX=20 AUTO_CONTINUE_BATCH=200 AUTO_PUSH=1 TARGET_BRANCH=autosync python3 scripts/ollama_autonomous_agent.py
```

The agent will:

1. Load current state from `.ollama_agent_state.json`.
2. Check `resumefromhere.txt` for pending instructions.
3. Merge archives, scan for missing files, and update documentation.
4. Generate activity feed and completion reports.
5. Commit and push changes to the `autosync` branch.

### Notes

- This file is regenerated automatically by the agent on each run.
- Treat this document as the current capabilities contract for the Ollama autonomous agent.
- The trigger workflow is auto-generated by `scripts/ollama_autonomous_agent.py` and kept synchronized with the agent's execution environment.
