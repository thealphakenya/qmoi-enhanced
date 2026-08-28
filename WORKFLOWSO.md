# GitHub Workflows - Complete Reference Guide (Enhanced v2.0)

**Last Updated:** 2025-01-10  
**Version:** 2.0 (Enhanced with Auto-Healing & Advanced Orchestration)  
**Total Workflows:** 8  
**Total Jobs:** 25+  
**Status:** 🟢 Production Ready

## Current Execution Contract (2026-08-28)

The authoritative implementation is `.github/workflows/ollama-autonomous-agent.yml`
and `scripts/ollama_autonomous_agent.py`. A successful run must install or reuse
Ollama, verify `OLLAMA_HOST`, make `OLLAMA_MODEL` available, perform real
inference, execute the bounded `autonomous` command, validate afterward, write a
checkpoint, and pass `ollamatracks/OLLAMA_SUCCESS.json`. The success message is
never based on Python validation alone. `MAX_ITERATIONS`,
`MAX_TASKS_PER_ITERATION`, and `MAX_RECOVERY_ATTEMPTS` are enforced bounds.

GitHub-hosted runners are the execution authority; a codespace is only for
local development. `WORKFLOWS.md` is the concise canonical map, while this
file remains the detailed reference. Historical run claims below are retained
for audit and must not be interpreted as current success evidence.

## Stage Matrix (2026-08-28)

| Workflow | Responsibility | Required terminal evidence |
| --- | --- | --- |
| `ollama-pr-validation.yml` | Source, YAML, tests, and documentation validation | All validation jobs pass |
| `ollama-master-orchestrator.yml` | Preflight, validation, checkpoint/telemetry, single dispatch | Dispatch only after validation success |
| `ollama-autonomous-agent.yml` | Ollama bootstrap, model/inference proof, bounded coding, post-validation | `OLLAMA_SUCCESS.json` with `SUCCESS` |
| `ollama-autonomous-agent-realtime-monitor.yml` | Reconcile agent, PR, job, and check states | Never infer success from Python-only events |
| `pr-monitor.yml` | Report PR validation and failure/success status | Report source workflow conclusion |
| `workflow-tracker.yml` | Track workflow lifecycle and metrics | Preserve queued/in-progress/failed states |
| `branch-sync.yml` | Audited main/backup and Alpha-Q-ai synchronization | Conflict-free, reviewable sync result |
| `auto-merge-automated-pr.yml` | Merge only validated, approved changes | Required checks and permissions pass |

The stage sequence is: trusted checkout, runner preflight, Python and
dependencies, Git integrity, Ollama bootstrap, health/model/inference checks,
repository validation, bounded autonomous loop, post-loop validation, recovery
when authorized, telemetry, checkpoint, artifact upload, and final contract
gate. Monitor, sync, and merge workflows observe or reconcile this result; they
do not replace it or start competing Ollama servers.

## Overview

This document provides comprehensive documentation for all 8 GitHub Actions workflows in the qmoi-enhanced repository with ADVANCED AUTO-HEALING, AUTO-RETRY, and AUTOMATIC AGENT TRIGGERING capabilities.

**Workflow Architecture:**
```
Push → Master Orchestrator → Validation → Tests → Agent (Auto-Trigger)
                              ↓ Auto-Heal on Error ↓
                           Exponential Backoff Retry
```

---

## 1. Ollama PR Validation Workflow
**File**: `.github/workflows/ollama-pr-validation.yml`
**Triggers**: `workflow_dispatch`, `pull_request` (main/develop), `push` (main)
**Duration**: ~3-5 minutes

### Purpose
Main comprehensive validation pipeline that proves PR readiness before merge. Executes 4 parallel validation jobs followed by final status aggregation.

### Jobs

#### 1.1 validate-platforms
- **Name**: Validate Platform Compilation
- **Matrix**: 6 platforms (windows, macos, linux, ios, android, web)
- **Steps**:
  - Checkout code with full history
  - Setup Python 3.11
  - Install dependencies
  - Run `ollama_autonomous_agent.py validate-all-platforms`
  - Upload platform validation logs as artifact

#### 1.2 validate-features
- **Name**: Validate 293+ Platform-Specific Features
- **Depends On**: validate-platforms (waits for completion)
- **Steps**:
  - Checkout code
  - Setup Python 3.11
  - Install dependencies
  - Run `ollama_autonomous_agent.py validate-all-features`
  - Generate feature coverage report
  - Upload validation logs

#### 1.3 test-suite
- **Name**: Execute Test Suite (181 Tests)
- **Tests Executed**: 
  - 106 tests from test_ollama_autonomous_agent.py
  - 31 tests from test_enhanced_tracking_and_workflows.py
  - 44 tests from test_ollama_enhanced_features.py
- **Total**: 181 comprehensive tests
- **Steps**:
  - Checkout code
  - Setup Python 3.11
  - Install dependencies
  - Run full pytest suite with verbose output
  - Upload test results and logs

#### 1.4 validate-documentation
- **Name**: Validate Documentation Files
- **Steps**:
  - Verify 10 required documentation files exist
  - Generate documentation validation report

#### 1.5 final-validation
- **Name**: Final PR Validation Status
- **Depends On**: All jobs (validate-platforms, validate-features, test-suite, validate-documentation)
- **Condition**: Runs even if previous jobs fail (if: always())
- **Steps**:
  - Run full validation suite via `ollama_autonomous_agent.py validate-all`
  - Upload all validation artifacts and tracking directory
  - Generate final comprehensive report

### Key Features
✅ **No cancellation** - Workflows complete even if new push occurs
✅ **Fail-fast disabled** - All platform validations run regardless of failures
✅ **Artifact retention** - 30 days for debugging
✅ **Comprehensive logging** - Timestamp-based tracking at each step
✅ **Durable evidence** - Proof contract generated in ollamatracks/

### Success Criteria
- All 6 platforms validate successfully
- All 293+ features validate successfully
- All 181 tests pass
- All documentation files present
- Final validation completes

### Failure Recovery
If tests fail:
1. Download test-suite-logs artifact
2. Review pytest output
3. Run locally: `python3 -m pytest tests/ -v`
4. Fix issues and push retry
5. Workflow auto-retries on next push/dispatch

---

## 2. Ollama Autonomous Agent Trigger & Live Tracker
**File**: `.github/workflows/ollama-autonomous-agent.yml`
**Triggers**: `workflow_run` (success of PR validation), `workflow_dispatch`, `schedule` (hourly)
**Duration**: ~5-10 minutes (configurable)

### Purpose
Autonomous agent orchestrator that starts processing after successful PR validation. Maintains durable telemetry via ollamatracks/ directory.

### Design Principles
- **Not a daemon** - GitHub runners are finite; uses scheduled triggers
- **Durable state** - All progress tracked in ollamatracks/
- **Security-focused** - Always checks out main branch (never PR head)
- **Resilience-enabled** - Auto-heals errors without manual intervention

### Triggers Explained

**workflow_run**: Automatically triggered after ollama-pr-validation succeeds
- Target workflow: ollama-pr-validation.yml
- Conclusion: success
- Result: Agent starts automatically

**workflow_dispatch**: Manual trigger for authorized users
- Parameter: Agent mode (validate, sync, monitor, full)
- Parameter: Verbosity level
- Parameter: Recovery mode

**schedule**: Periodic monitoring every hour
- Cron: `0 * * * *`
- Purpose: Continuous health monitoring
- Auto-healing if issues detected

### Jobs

#### 2.1 trigger-agent
- **Name**: Trigger Autonomous Ollama Agent
- **Condition**: Triggered by workflow_run success or manual dispatch
- **Steps**:
  1. Checkout main branch
  2. Setup Python 3.11
  3. Install dependencies
  4. Run agent: `python3 scripts/ollama_autonomous_agent.py full`
  5. Record execution in tracking
  6. Upload telemetry artifacts

#### 2.2 monitor-execution
- **Name**: Monitor Agent Execution
- **Runs parallel with trigger-agent**
- **Steps**:
  1. Poll ollamatracks/ for status updates
  2. Track execution phases
  3. Monitor error conditions
  4. Generate live status report

#### 2.3 verify-completion
- **Name**: Verify Agent Completion
- **Depends On**: trigger-agent (waits)
- **Steps**:
  1. Verify all tracking files updated
  2. Check telemetry.jsonl for completion event
  3. Generate completion report
  4. Email notification if configured

### Key Features
✅ **Automatic orchestration** - No manual intervention needed
✅ **Durable telemetry** - 41+ events tracked per run
✅ **Health monitoring** - Continuous status checks
✅ **Error recovery** - Auto-heals common issues
✅ **Scheduled monitoring** - Runs every hour regardless of changes

### Tracking Integration
Updates these files in real-time:
- ollamatracks/STATE.txt - Current state snapshot
- ollamatracks/telemetry.jsonl - Append-only event log
- ollamatracks/monitoring_summary.json - Latest aggregated stats
- ollamatracks/CURRENT_STATUS.txt - Live status projection

---

## 3. Realtime Workflow Monitor
**File**: `.github/workflows/ollama-autonomous-agent-realtime-monitor.yml`
**Triggers**: `schedule` (every 5 minutes), `workflow_dispatch`
**Duration**: ~1-2 minutes

### Purpose
Continuous real-time monitoring of agent execution and GitHub Actions pipeline. Generates live dashboard updates.

### Monitoring Scope
- PR validation pipeline status
- Agent execution state
- Test suite health
- Workflow artifact availability
- ollamatracks/ directory freshness

### Jobs

#### 3.1 monitor-pr-validation
- Check ollama-pr-validation.yml status
- Track job completion percentages
- Alert on failure

#### 3.2 monitor-agent-health
- Monitor agent process status
- Check telemetry freshness
- Verify tracking updates

#### 3.3 generate-dashboard
- Create live status dashboard
- Post to commit status
- Update PR checks

### Key Features
✅ **Real-time updates** - Every 5 minutes
✅ **Status dashboards** - Visual workflow status
✅ **Alert generation** - Notifications on issues
✅ **Health scoring** - Overall system health percentage

---

## 4. Pull Request Monitor
**File**: `.github/workflows/pr-monitor.yml`
**Triggers**: `pull_request`, `pull_request_target`, `workflow_dispatch`
**Duration**: ~2-3 minutes

### Purpose
Monitors all PR activity, enforces validation requirements, and auto-updates PR status.

### Responsibilities
1. Verify PR validation completed successfully
2. Enforce minimum test coverage
3. Validate PR title/description format
4. Check required approval count
5. Auto-update PR with status badges

### Jobs

#### 4.1 check-pr-validation
- Verify ollama-pr-validation workflow passed
- Check all 6 platforms validated
- Verify all 181 tests passed

#### 4.2 enforce-requirements
- Check PR title format
- Verify description present
- Validate commits follow convention

#### 4.3 update-pr-status
- Add validation badges to PR
- Post status check results
- Request reviewers if needed

---

## 5. Branch Sync Monitor
**File**: `.github/workflows/branch-sync.yml`
**Triggers**: `workflow_dispatch`, `schedule` (every 10 minutes), `push` (main/autosync-backup)
**Duration**: ~3-5 minutes

### Purpose
Synchronizes code between qmoi-enhanced (main repo) and Alpha-Q-ai (target repo) on both main and autosync-backup branches.

### Sync Strategy
- **Source**: thealphakenya/qmoi-enhanced
  - Main branch
  - autosync-backup branch
- **Target**: thealphakenya/Alpha-Q-ai
  - main branch
  - autosync-backup branch

### Jobs

#### 5.1 sync-branches
- **Steps**:
  1. Checkout qmoi-enhanced with full history
  2. Add remote for Alpha-Q-ai
  3. Fetch Alpha-Q-ai branches
  4. Compare main branches
  5. Sync main → Alpha-Q-ai main
  6. Sync autosync-backup → Alpha-Q-ai autosync-backup
  7. Handle merge conflicts
  8. Verify sync success
  9. Generate sync report

### Key Features
✅ **Bidirectional awareness** - Handles updates from both repos
✅ **Conflict resolution** - Automated merge handling
✅ **Scheduled sync** - Every 10 minutes
✅ **Manual trigger** - Immediate sync when needed
✅ **Comprehensive logging** - Full sync history

### Use Cases
- Push changes from qmoi-enhanced to Alpha-Q-ai
- Merge updates from Alpha-Q-ai back to qmoi-enhanced
- Keep backup branches synchronized

---

## 6. Auto-Merge Automated PR
**File**: `.github/workflows/auto-merge-automated-pr.yml`
**Triggers**: `pull_request`, `pull_request_review`, `workflow_dispatch`
**Duration**: ~2-3 minutes

### Purpose
Automatically merges PR once all validation and approval requirements are satisfied.

### Merge Requirements
1. ✅ ollama-pr-validation workflow successful
2. ✅ All 181 tests passing
3. ✅ All platforms validated
4. ✅ Documentation validation passed
5. ✅ Minimum 1 approval (configurable)
6. ✅ No conflicts with main branch
7. ✅ PR title and description valid

### Jobs

#### 6.1 check-merge-readiness
- Verify all requirements above
- Check for blocking issues
- Validate merge strategy

#### 6.2 execute-merge
- Perform merge to main branch
- Use squash or merge commit strategy
- Auto-delete PR branch
- Generate merge summary

#### 6.3 post-merge-sync
- Trigger branch-sync workflow
- Update Alpha-Q-ai
- Generate post-merge report

### Key Features
✅ **Automated approvals** - Removes manual merge step
✅ **Safety checks** - Comprehensive validation
✅ **Conflict detection** - Fails fast on conflicts
✅ **Audit trail** - Full merge history

---

## 7. Workflow Tracker
**File**: `.github/workflows/workflow-tracker.yml`
**Triggers**: `workflow_run`, `workflow_dispatch`, `schedule` (hourly)
**Duration**: ~1-2 minutes

### Purpose
Meta-workflow that tracks all workflow executions and maintains workflow health statistics.

### Tracking Responsibilities
1. Record workflow execution start/end times
2. Track job success/failure rates
3. Monitor workflow duration trends
4. Generate performance reports
5. Alert on anomalies

### Jobs

#### 7.1 track-workflows
- Poll GitHub API for workflow runs
- Record in ollamatracks/workflow_history.jsonl
- Calculate statistics

#### 7.2 generate-health-report
- Analyze success rates
- Generate trend charts
- Identify problematic workflows

#### 7.3 alert-on-issues
- Check for consistently failing jobs
- Alert maintainers
- Suggest improvements

---

## Workflow Orchestration Flow

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Push Event (to main branch)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │ ollama-pr-validation.yml       │
          │ (Main validation pipeline)     │
          │                                │
          │ Jobs:                          │
          │ • validate-platforms (6 jobs)  │
          │ • validate-features            │
          │ • test-suite (181 tests)       │
          │ • validate-documentation       │
          │ • final-validation             │
          └─────────┬──────────────────────┘
                    │
           SUCCESS? │
           ┌────────┴─────────┐
           ▼                  ▼
         YES                 NO
          │                  └─→ [FAIL] Generate failure report
          │                      & upload logs
          ▼
  ┌─────────────────────────────┐
  │ workflow_run event fired    │
  │ (PR validation successful)  │
  └────────┬────────────────────┘
           │
           ▼
  ┌──────────────────────────────────┐
  │ ollama-autonomous-agent.yml      │
  │ (Auto-trigger agent)             │
  │                                  │
  │ Jobs:                            │
  │ • trigger-agent (main execution) │
  │ • monitor-execution (parallel)   │
  │ • verify-completion (final)      │
  └────────┬─────────────────────────┘
           │
           ▼
  ┌────────────────────────────────┐
  │ ollamatracks/ updated with:    │
  │ • STATE.txt (current state)    │
  │ • telemetry.jsonl (41+ events) │
  │ • monitoring_summary.json      │
  └────────┬──────────────────────┘
           │
    ┌──────┴─────────┐
    ▼                ▼
  [Scheduled]    [Live Status]
  • Realtime     • PR Monitor
    Monitor      • Workflow
  • Branch Sync    Tracker
  • Auto-Merge
```

---

## Environment Variables & Secrets

### Required GitHub Secrets

| Secret Name | Purpose | Required |
|------------|---------|----------|
| `MY_CUSTOM_TOKEN` | Personal GitHub token (repo, workflow access) | ✅ Yes |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions | ✅ Yes |
| `GH_TOKEN` | Fallback token for gh CLI | ⚠️ Optional |
| `QMOI_WEBHOOK_URL` | Webhook for agent notifications | ⚠️ Optional |

### Environment Variables (in workflows)

```yaml
env:
  MY_CUSTOM_TOKEN: ${{ secrets.MY_CUSTOM_TOKEN || secrets.GITHUB_TOKEN }}
  GITHUB_TOKEN: ${{ secrets.MY_CUSTOM_TOKEN || secrets.GITHUB_TOKEN || github.token }}
  GH_TOKEN: ${{ secrets.MY_CUSTOM_TOKEN || secrets.GITHUB_TOKEN || github.token }}
```

**Fallback Strategy**: Uses most specific token available, falls back to auto-provided token

---

## Error Recovery & Auto-Remediation

### Workflow-Level Error Handling

| Error Type | Detection | Recovery |
|-----------|-----------|----------|
| Test failure | pytest exit code ≠ 0 | Re-run tests, upload logs |
| Platform compile failure | Non-zero exit from agent | Skip platform, log error |
| Import error | ModuleNotFoundError | Re-install dependencies |
| File missing | FileNotFoundError | Generate from template |
| Git corruption | Git index signature error | Rebuild index atomically |
| Artifact upload failure | Upload timeout | Retry with smaller artifact |

### Job-Level Retry Strategy

```yaml
# All validate jobs use:
fail-fast: false  # Continue all jobs even if one fails

# All artifact uploads use:
if: always()      # Upload logs even on failure
retention-days: 30  # Keep for 30 days
```

### Agent-Level Auto-Healing

Via `scripts/resilience_auto_healing.py`:
- YAML syntax auto-fix
- JSON syntax auto-fix
- Python syntax auto-fix
- Missing file recovery from templates
- Graceful degradation without essential files

---

## Monitoring & Observability

### Tracking Files (Real-Time)
Located in `ollamatracks/`:
1. **STATE.txt** - Current state snapshot
2. **CURRENT_STATUS.txt** - Live status projection
3. **LATEST_ACTIVITY.txt** - Most recent activity
4. **PR_STATUS.txt** - PR validation status
5. **telemetry.jsonl** - Append-only event log (41+ events)
6. **monitoring_summary.json** - Aggregated statistics
7. **TRACKING_INDEX.txt** - Schema documentation
8. **LAST_RECONCILIATION.txt** - Last reconciliation timestamp

### Artifacts (30-Day Retention)
- `platform-validation-logs-{platform}` - Per-platform logs
- `feature-validation-logs` - Feature validation output
- `test-suite-logs` - pytest output and cache
- `final-validation-logs` - Complete validation logs
- `workflow-history` - Workflow execution statistics

---

## Performance Characteristics

### Timing Summary

| Workflow | Duration | Frequency | Cost |
|----------|----------|-----------|------|
| ollama-pr-validation | 3-5 min | Per push | Medium |
| ollama-autonomous-agent | 5-10 min | Hourly + on-demand | Medium |
| realtime-monitor | 1-2 min | Every 5 min | Low |
| pr-monitor | 2-3 min | Per PR event | Low |
| branch-sync | 3-5 min | Every 10 min | Medium |
| auto-merge-pr | 2-3 min | Per PR update | Low |
| workflow-tracker | 1-2 min | Hourly | Low |

**Total Monthly Cost**: ~$100-150 (based on GitHub's 2000 minutes/month free tier)

---

## Troubleshooting Guide

### Workflow Won't Trigger

**Symptom**: Workflow not appearing in Actions tab
**Solution**:
1. Push trigger was on correct branch (main)
2. Workflow file syntax valid (lint locally)
3. Repo has Actions enabled (Settings > Actions)
4. Check branch protection rules (allow workflow dispatch)

### Jobs Failing Due to Dependencies

**Symptom**: Test suite fails because platforms not validated
**Solution**:
1. Check `needs:` clause in job definition
2. Verify upstream job passed
3. Review upstream job logs
4. Fix upstream issue first

### Artifacts Missing

**Symptom**: Can't download logs for debugging
**Solution**:
1. Verify `if: always()` on upload steps
2. Check artifact size < GitHub limit
3. Ensure path exists before upload
4. Review retention settings

### Agent Not Triggering

**Symptom**: Agent workflow doesn't run after PR validation
**Solution**:
1. Verify ollama-pr-validation passed (green check)
2. Check ollama-autonomous-agent.yml has `workflow_run` trigger
3. Verify target workflow name matches
4. Check conclusion filter is `success`

### Token/Auth Failures

**Symptom**: "fatal: Authentication failed"
**Solution**:
1. Verify MY_CUSTOM_TOKEN secret exists
2. Check token has repo + workflow scopes
3. Test token locally: `gh auth token`
4. Regenerate token if expired

---

## Best Practices

### For Developers

1. **Always run locally first**
   ```bash
   python3 -m pytest tests/ -v
   python3 scripts/ollama_autonomous_agent.py validate-all
   ```

2. **Check artifact logs before pushing**
   - Download test-suite-logs from last run
   - Review platform validation output
   - Verify tracking files updated

3. **Keep workflows DRY**
   - Use job dependencies (needs:)
   - Reuse environment variables
   - Extract common scripts

4. **Monitor workflow costs**
   - Review Actions > Billing page
   - Track workflow durations
   - Optimize slow steps

### For CI/CD

1. **Maintain audit trail**
   - Keep artifacts 30 days
   - Store telemetry permanently
   - Log all agent actions

2. **Ensure reproducibility**
   - Pin dependency versions
   - Use deterministic test order
   - Document environment requirements

3. **Plan for failures**
   - Design graceful degradation
   - Implement error recovery
   - Alert on critical failures

---

## Future Enhancements

### Planned Features

1. **Workflow caching** - Cache dependencies to speed up jobs
2. **Matrix optimization** - Smart platform selection based on changes
3. **Parallel feature validation** - Validate features in parallel instead of sequential
4. **Integration testing** - Add cross-repo integration tests
5. **Performance profiling** - Track workflow duration trends
6. **Cost optimization** - Smart resource allocation
7. **Deployment pipeline** - Automated release on successful validation

---

## Related Files

- `scripts/ollama_autonomous_agent.py` - Main agent orchestrator
- `scripts/resilience_auto_healing.py` - Error recovery module
- `tests/test_ollama_autonomous_agent.py` - Agent tests (106 tests)
- `tests/test_enhanced_tracking_and_workflows.py` - Workflow tests (31 tests)
- `tests/test_ollama_enhanced_features.py` - Feature tests (44 tests)
- `ENHANCEMENT_SESSION_2026_08_18.md` - Session summary
- `zx.txt` - Alpha-Q-ai setup instructions
- `.github/workflows/` - All workflow files

---

## Conclusion

This workflow orchestration system provides:
✅ Comprehensive validation before merge
✅ Autonomous agent orchestration
✅ Real-time monitoring and tracking
✅ Automatic error recovery
✅ Cross-repo synchronization
✅ Durable telemetry and evidence
✅ 181 tests proving PR success

All workflows are designed to be resilient, observable, and maintainable.

## GitHub Hosted Operations Record

Snapshot: 2026-08-23, after push `54e5cb1f2b9`.

| Workflow file | Latest hosted run | Current result |
| --- | --- | --- |
| `auto-merge-automated-pr.yml` | `32442743661` | Historical failure; requires separate proposal/permission investigation |
| `branch-sync.yml` | `32643389408` | In progress on `54e5cb1f2b9` |
| `ollama-autonomous-agent-realtime-monitor.yml` | `32643353706` | Success on `54e5cb1f2b9` |
| `ollama-autonomous-agent.yml` | `32643163358` | Success on `407049d3f705` |
| `ollama-master-orchestrator.yml` | `32640424370` | Historical failure on `4fc7be1169eb`; repaired dispatch payload is in `c4ac85293a` |
| `ollama-pr-validation.yml` | `32643309908` | Queued on `54e5cb1f2b9` |
| `pr-monitor.yml` | No recent run returned | No recent hosted execution recorded |
| `workflow-tracker.yml` | `32642930937` | Success on `407049d3f705` |

Operational rules:

- Treat queued and in-progress runs as active, not successful or failed.
- Record run ID, workflow name, commit SHA, branch, start/end timestamps, status, conclusion, and URL in `github.md`.
- Keep historical failures visible while separating them from current-run health.
- Do not claim all workflows are successful until every required workflow has a terminal success result.
- Manual dispatch requires a GitHub token with Actions write permission; the current Codespaces token previously returned HTTP 403.

