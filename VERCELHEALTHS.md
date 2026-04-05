# VERCELHEALTHS.md - Vercel Health and Recovery System

**Last Updated**: 2026-04-05
**Status**: ✅ Active

## Overview

VERCELHEALTHS.md documents the system responsible for Vercel deployment health, error detection, and self-healing. The system uses QMOI and Lion Agent integration to ensure Vercel deployments are continuously monitored, automatically fixed, and redeployed until successful.

## System Responsibilities

- monitor the latest Vercel project deployment
- detect build and runtime errors from Vercel logs
- classify failures into actionable categories
- propose and apply safety-first repair actions
- trigger redeploys until health stabilizes
- clone Vercel project configuration when needed
- report status via dedicated APIs and notifications

## Required Environment Variables

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_PROJECT_ID` - Vercel project identifier
- `NEXT_PUBLIC_API_BASE_URL` - API domain for reporting
- `MASTER_TOKEN` - Master authentication token for secure operations

## Health Check Endpoints

### Check current Vercel health
```bash
curl -H "Authorization: Bearer $MASTER_TOKEN" \
  https://qmoi-enhanced.vercel.app/api/vercel/health
```

### Lion status summary
```bash
curl -H "Authorization: Bearer $MASTER_TOKEN" \
  https://qmoi-enhanced.vercel.app/api/lion/vercel/status
```

## Auto-Fix & Recovery Endpoints

### Run auto-fix analysis
```bash
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"auto"}' \
  https://qmoi-enhanced.vercel.app/api/vercel/fix
```

### Redeploy until successful
```bash
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alias":"production","confirm":true}' \
  https://qmoi-enhanced.vercel.app/api/vercel/redeploy
```

### Clone the Vercel project
```bash
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target_project_name":"qmoi-enhanced-clone","git_repo_url":"https://github.com/thestablekenya/qmoi-enhanced"}' \
  https://qmoi-enhanced.vercel.app/api/vercel/clone
```

## Vercel Health Status Commands

Use these commands to verify system health and deployment readiness.

### Verify deployment status
```bash
curl -s https://qmoi-enhanced.vercel.app/api/vercel/health | jq
```

### Check deployment readiness
```bash
curl -s https://qmoi-enhanced.vercel.app/api/lion/vercel/status | jq
```

### Run the fix + redeploy workflow
```bash
curl -X POST -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"auto"}' \
  https://qmoi-enhanced.vercel.app/api/lion/vercel/fix
```

## Recovery Rules

- If the health check returns `degraded`, the system first analyzes the latest logs.
- If missing dependencies are detected, Vercel dependencies are reviewed and suggestions are generated.
- If a compile error is detected, the system reports the error and recommends code fixes.
- If no root cause is identified, the system re-checks logs after a redeploy.
- The system will not apply destructive changes automatically; it only proposes fixes and triggers safe redeploy steps.

## Notes for Operators

- Always keep `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` secure.
- Confirm that Vercel auto-deploy is enabled in the project settings.
- Use the Lion API endpoints for master-level rescue workflows.
- Review Vercel logs in the dashboard if CLI-based auto-fix does not resolve the issue.
- For production, ensure `VERCEL_AUTO_SCALE=true`, `VERCEL_AUTO_DEPLOY=true`, and `VERCEL_AUTO_ROLLBACK=true` are set.
