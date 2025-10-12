# QMOI Workflows, QCity Runners, and Engine Syncs

## Overview
This document describes how QMOI automates, syncs, and manages all CI/CD workflows (.yml), error fixing, and parallel execution across both GitHub Actions and QCity's own runners/engines.

## Workflow Sync Architecture
- **Bi-directional Sync:** All .yml workflow files are kept in sync between the GitHub repo and QCity runner engine.
- **Auto-Detection:** QMOI detects new, modified, or deleted workflows and propagates changes to both environments.
- **Auto-Trigger:** QMOI can trigger any workflow on either GitHub or QCity runners, or both, based on context and error state.
- **Error Fixing:** If a workflow fails, QMOI analyzes logs, auto-fixes the .yml or code, and re-triggers until success.
- **Parallel Execution:** QMOI can run multiple workflows in parallel on QCity runners, leveraging distributed resources for speed and redundancy.
- **Learning & Enhancement:** QMOI learns from past errors and fixes, improving its auto-fix logic and suggesting enhancements to workflows.

## QCity Runner Features
- **Self-Healing:** QCity runners can auto-restart, self-update, and recover from most errors without human intervention.
- **Resource Optimization:** Workflows are scheduled based on available CPU, memory, and network resources.
- **Live Status Sync:** All workflow statuses, logs, and artifacts are synced in real time to both QCity and GitHub dashboards.
- **Custom Workflows:** QMOI can create, edit, or remove workflows on demand, and propagate changes to all environments.

## Parallel Features
- **Matrix Builds:** QMOI supports matrix builds and parallel test/deploy jobs across all platforms.
- **Redundant Execution:** Critical workflows can be run on both GitHub and QCity for maximum reliability.
- **Auto-Scaling:** QCity can spin up additional runners as needed for large or urgent jobs.

## How Sync Works
1. **Change Detection:** QMOI monitors .github/workflows/ for any changes.
2. **Sync Engine:** Changes are pushed/pulled to/from QCity runner engine.
3. **Validation:** QMOI validates all .yml for syntax and logic errors before running.
4. **Auto-Fix:** If errors are found, QMOI attempts to auto-fix and re-validate.
5. **Trigger:** Workflows are triggered on the appropriate runner(s).
6. **Monitor:** QMOI monitors execution, logs, and artifacts.
7. **Feedback Loop:** Results and fixes are logged for future learning.

## QMOI Workflow Manager (Local/Parallel)
- Script: `scripts/qmoi_workflow_manager.py`
- Runs all workflows locally in QCity runners, auto-fixes errors, and shows real-time stats.
- If all builds/tests succeed locally, disables redundant GitHub workflow runs (using a marker file).
- Keeps running in the background, even offline, to ensure all workflows are always fixed and up to date.
- Logs stats to `QMOI_WORKFLOW_STATS.log`.
- See script for details and customization.

## Best Practices
- Keep workflows modular and reusable.
- Use QMOI's auto-fix and validation before pushing changes.
- Leverage QCity runners for heavy or parallel jobs.
- Review logs in QCity and GitHub for full traceability.

---

_Last updated: 2025-10-11 by QMOI Automation System_
