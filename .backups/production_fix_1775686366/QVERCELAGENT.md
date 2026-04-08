<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-06T01:46:16.070223
- note: Auto-validated by Lion Agent validation system
<!-- LION_VALIDATION_END -->

# QVERCELAGENT.md - QMOI Lion Vercel Agent

**Last Updated**: 2026-04-05
**Status**: ✅ Active

## Overview

QVERCELAGENT is the QMOI Lion integration layer for Vercel deployments. It gives QMOI the ability to:

- monitor Vercel deployment health in real time
- detect Vercel build and runtime errors
- apply safe auto-fix recommendations
- redeploy projects until the deployment is successful
- clone Vercel project configuration for backup or multi-environment deployment
- surface Vercel status through Lion Agent APIs and dashboards

## Capabilities

### Vercel Health Monitoring
- Continuous health checking for the latest Vercel deployment
- Aggregates deployment state, build logs, and error analysis
- Reports health status as `healthy`, `degraded`, or `unavailable`

### Automatic Fixes
- Analyzes failures such as missing dependencies, compilation errors, and module resolution issues
- Generates actionable fix suggestions and safe repair actions
- Adds results to QMOI memory and notifications

### Redeploy Until Successful
- Triggers Vercel CLI redeploys when health checks fail
- Keeps retrying until deployment status returns stable
- Guides the user to confirm health after redeploy

### Vercel Clone Support
- Creates a cloned Vercel project from the existing configuration
- Supports alternate aliases and Git repository URLs
- Used for backup, staging, or isolated environments

## Lion Agent Endpoints

### GET /api/lion/vercel/status
- Returns a Lion Agent overview of Vercel health
- Includes deployment metadata and analysis

### POST /api/lion/vercel/fix
- Runs Vercel auto-fix and redeploy workflows
- Best used with `MASTER_TOKEN` authentication

### GET /api/vercel/health
- Checks Vercel health for the currently configured project
- Returns deployment status and log analysis

### POST /api/vercel/fix
- Runs an auto-fix cycle based on the latest deployment logs
- Returns suggested repair actions

### POST /api/vercel/redeploy
- Redeploys the Vercel project, optionally with a target alias
- Returns CLI output and next-step instructions

### POST /api/vercel/clone
- Clones the Vercel project configuration to a new project name
- Supports optional Git repository URL linking

## Integration Notes

- Vercel integration is driven by environment variables: `VERCEL_TOKEN` and `VERCEL_PROJECT_ID`
- If the Vercel CLI is installed, QVERCELAGENT will prefer CLI-based redeploy and clone flows
- QMOI tracks Vercel health in memory and logs notifications for each analysis cycle
- Lion Agent can use Vercel endpoints for autonomous recovery and deployment governance

## Commands

```bash
# Check Vercel health
curl -H "Authorization: Bearer $MASTER_TOKEN" https://qmoi-enhanced.vercel.app/api/vercel/health

# Run Lion Vercel fix
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target_alias":"production"}' \
  https://qmoi-enhanced.vercel.app/api/lion/vercel/fix

# Redeploy Vercel
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alias":"production","confirm":true}' \
  https://qmoi-enhanced.vercel.app/api/vercel/redeploy

# Clone Vercel project
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target_project_name":"qmoi-enhanced-clone","git_repo_url":"https://github.com/thestablekenya/qmoi-enhanced"}' \
  https://qmoi-enhanced.vercel.app/api/vercel/clone
```

## Recommended Workflow

1. Query `/api/vercel/health`
2. If issues are detected, call `/api/vercel/fix`
3. After pruning errors, call `/api/vercel/redeploy`
4. Verify with `/api/lion/vercel/status`
5. If needed, create a clone using `/api/vercel/clone`
