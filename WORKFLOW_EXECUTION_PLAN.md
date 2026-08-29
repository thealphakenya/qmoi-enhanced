# Workflow Execution & Validation Plan (2026-08-29)

## Objective
Systematically validate all 8 GitHub workflows to ensure:
1. Each workflow executes correctly
2. Ollama autonomous agent never claims false success
3. All failure conditions are properly detected
4. Success contract (OLLAMA_SUCCESS.json) is mandatory

## Workflow Execution Matrix

| # | Workflow | File | Trigger | Status | Evidence Required |
|---|----------|------|---------|--------|-------------------|
| 1 | Ollama PR Validation | ollama-pr-validation.yml | Push/PR | PENDING | All platform tests pass |
| 2 | Ollama Master Orchestrator | ollama-master-orchestrator.yml | Schedule/Dispatch | PENDING | Preflight + validation success |
| 3 | Ollama Autonomous Agent | ollama-autonomous-agent.yml | workflow_run/dispatch | PENDING | OLLAMA_SUCCESS.json |
| 4 | Realtime Monitor | ollama-autonomous-agent-realtime-monitor.yml | Schedule | PENDING | Live status dashboard |
| 5 | PR Monitor | pr-monitor.yml | PR events | PENDING | PR validation status |
| 6 | Workflow Tracker | workflow-tracker.yml | All events | PENDING | Lifecycle metrics |
| 7 | Branch Sync | branch-sync.yml | Schedule | PENDING | Conflict-free sync result |
| 8 | Auto-Merge PR | auto-merge-automated-pr.yml | PR approval | PENDING | Merge successful |

## Validation Checklist

### False-Success Prevention
✅ Agent will NOT report success if:
- Ollama not installed/started
- Model unavailable  
- Inference failed
- Validation failed
- OLLAMA_SUCCESS.json missing
- final_status != "SUCCESS"

✅ Agent WILL report success only if:
- Ollama bootstrap successful
- Model available + tested
- Real inference verified
- Autonomous loop executed
- Post-loop validation passed
- OLLAMA_SUCCESS.json created with SUCCESS status

## Workflow Dependencies

```
┌─────────────────────────────────────────────────┐
│  Push to main/PR to main                        │
└────────────┬────────────────────────────────────┘
             │
             v
┌─────────────────────────────────────────────────┐
│  1. Ollama PR Validation Workflow                │
│     - 6 platform validations                     │
│     - 293+ feature validations                   │
│     - 173 test suite                             │
│     - Documentation validation                   │
└────────────┬────────────────────────────────────┘
             │ (if success)
             v
┌─────────────────────────────────────────────────┐
│  2. Ollama Master Orchestrator                   │
│     - Preflight checks                           │
│     - Health validation                          │
│     - Triggers agent (if enabled)                │
└────────────┬────────────────────────────────────┘
             │ (triggers)
             v
┌─────────────────────────────────────────────────┐
│  3. Ollama Autonomous Agent                      │
│     - Ollama bootstrap                           │
│     - Model verification                         │
│     - Real inference test                        │
│     - Autonomous coding loop                     │
│     - Post-loop validation                       │
│     - OLLAMA_SUCCESS.json generation             │
└────────────┬────────────────────────────────────┘
             │ (parallel monitoring)
             v
┌─────────────────────────────────────────────────┐
│  4. Realtime Monitor + Trackers                  │
│     - Live status updates                        │
│     - Metric collection                          │
│     - Dashboard generation                       │
└─────────────────────────────────────────────────┘

Side-by-side:
│  5. PR Monitor     │  6. Branch Sync    │  7. Auto-Merge PR  │
│  - PR validation   │  - QE ↔ AQ sync    │  - Merge with checks │
│  - Status checks   │  - Audit review    │  - Final step       │
└────────────────────┴────────────────────┴────────────────────┘
```

## Local Validation Commands

### Test 1: Verify Agent CLI Commands
```bash
python scripts/ollama_autonomous_agent.py health
python scripts/ollama_autonomous_agent.py validate-all
python scripts/ollama_autonomous_agent.py proof
python scripts/ollama_autonomous_agent.py checkpoint
```

### Test 2: Run Test Suite Locally
```bash
python -m pytest tests -v --tb=short
```

### Test 3: Validate Workflows
```bash
python -c "import yaml; [yaml.safe_load(Path(p).read_text()) for p in Path('.github/workflows').glob('*.y*ml')]"
```

### Test 4: Check Success Contract Structure
```bash
python -c "from scripts.ollama_runtime import build_success_contract; print(build_success_contract.__doc__)"
```

## Execution Plan

### Phase 1: Local Validation (Completed ✅)
- ✅ All 173 tests passing
- ✅ All 8 workflows YAML valid
- ✅ No secrets detected
- ✅ No recursion vulnerabilities
- ✅ Python sources compile

### Phase 2: GitHub Actions Execution (Next)
1. Push current code to trigger PR validation
2. Monitor workflow execution in real-time
3. Verify each job completes successfully
4. Collect OLLAMA_SUCCESS.json contract
5. Validate success contract structure

### Phase 3: False-Success Prevention Test (Then)
1. Simulate Ollama startup failure
2. Verify agent reports failure (not false success)
3. Simulate model unavailable
4. Verify agent reports failure
5. Simulate inference timeout
6. Verify agent reports failure

### Phase 4: Full Autonomous Loop Test (Then)
1. With real Ollama available
2. Execute autonomous coding loop
3. Verify files can be modified
4. Run post-loop validation
5. Verify OLLAMA_SUCCESS.json generation

## Success Criteria for All Workflows

### Ollama PR Validation ✅
- All 6 platforms validate
- All 293+ features validate  
- All 173 tests pass
- All documentation files present
- Final validation completes

### Ollama Master Orchestrator ✅
- Preflight checks pass
- Health validation succeeds
- Agent triggering authorized
- Telemetry recorded

### Ollama Autonomous Agent ✅✅✅ (CRITICAL)
- Ollama bootstrap succeeds
- Server health verified
- Model availability confirmed
- Real inference test passed
- Autonomous loop executed
- Post-loop validation passed
- OLLAMA_SUCCESS.json created
- final_status == "SUCCESS"

### Realtime Monitor ✅
- Continuous monitoring active
- Status dashboards generated
- Metrics collected
- Alerts functioning

### PR Monitor ✅
- PR validation tracking
- Status checks enforced
- Coverage validation passed
- Auto-updates working

### Workflow Tracker ✅
- Lifecycle events tracked
- Metrics collected
- Reports generated

### Branch Sync ✅
- QE repository in sync
- AQ repository updated
- No conflicts detected
- Reviewable PR created

### Auto-Merge PR ✅
- Only validated PRs merged
- Checks passing
- Permissions verified

## Key False-Success Prevention Measures

1. **Mandatory OLLAMA_SUCCESS.json Gate**
   - Success cannot be claimed without this file
   - File must have final_status="SUCCESS"
   - All required fields must be present

2. **Real Ollama Verification**
   - Server must be running at OLLAMA_HOST
   - Model must respond to /api/generate
   - Inference test must succeed
   - Cannot skip with mocks in critical path

3. **Bounded Autonomous Loop**
   - MAX_ITERATIONS enforced
   - MAX_TASKS_PER_ITERATION enforced
   - Circuit breakers active
   - Progress tracking mandatory

4. **Post-Loop Validation**
   - Tests must pass after LLM modifications
   - No regressions allowed
   - Git diff validated
   - Checkpoint created before claiming success

5. **Workflow Consistency**
   - All 8 workflows must work together
   - No conflicting success criteria
   - Unified evidence format
   - Consistent telemetry

## Monitoring & Alerts

Watch for these failure patterns:
- ❌ "Autonomous agent executed successfully" WITHOUT OLLAMA_SUCCESS.json
- ❌ "Autonomous agent executed successfully" WITH final_status != "SUCCESS"
- ❌ Ollama bootstrap failures masked with || true
- ❌ Model verification skipped
- ❌ Inference test bypassed
- ❌ Success claimed after Python validation only (no real LLM)

## Evidence Collection

Artifacts to preserve from each run:
- GitHub Actions logs from each workflow
- OLLAMA_SUCCESS.json contract
- ollamatracks/ directory contents
- Test suite output
- Validation reports
- Checkpoint data

## Final Sign-Off Criteria

✅ All 8 workflows execute successfully on GitHub Actions
✅ OLLAMA_SUCCESS.json generated with correct structure  
✅ No false-success conditions detected
✅ Agent genuinely performs Ollama bootstrap + LLM integration
✅ All tests passing
✅ No security issues
✅ Ready for production deployment

---

**Status**: Ready for GitHub Actions execution  
**Date**: 2026-08-29  
**Approval Pending**: Real Ollama server execution on GitHub Actions
