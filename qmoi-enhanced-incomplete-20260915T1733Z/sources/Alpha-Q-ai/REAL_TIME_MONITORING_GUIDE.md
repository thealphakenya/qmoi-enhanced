# Real-Time Monitoring Guide (2026-08-29)

## Overview

This guide explains how to monitor all 8 GitHub workflows in real-time as they execute the QMOI Ollama Autonomous Coding System. No false successes possible - the system requires a mandatory success contract with 20 verified fields.

---

## Quick Start

### Step 1: Push Code
```bash
cd /workspaces/qmoi-enhanced
git push origin main
```

### Step 2: Open GitHub Actions
Navigate to: https://github.com/thealphakenya/qmoi-enhanced/actions

### Step 3: Monitor Each Phase
Follow the checklist in [WORKFLOW_STATUS_DASHBOARD.md](WORKFLOW_STATUS_DASHBOARD.md)

### Step 4: Verify Success
- All jobs show ✅ green
- Download `ollamatracks/OLLAMA_SUCCESS.json` artifact
- Verify `final_status: "SUCCESS"`

---

## The 5 Execution Phases

### ✅ Phase 1: PR Validation (5-10 minutes)
**What**: Comprehensive validation of all platforms, features, and tests

**Workflows**:
- `ollama-pr-validation.yml` (6 parallel jobs)

**Jobs to Watch**:
1. workflow-integrity ✅
2. validate-platforms ✅
3. validate-features ✅
4. test-suite (173 tests) ✅
5. validate-documentation ✅
6. final-validation ✅

**Logs to Check**:
```bash
# Look for all jobs completing
❌ If any fail, check logs immediately
✅ If all pass, Phase 2 triggers automatically
```

**Success Indicator**:
- All 6 jobs show ✅ green
- 173/173 tests pass
- Proof contract generated

---

### ✅ Phase 2: Master Orchestrator (3-5 minutes)
**What**: Final validation before autonomous agent execution

**Workflows**:
- `ollama-master-orchestrator.yml`

**Jobs to Watch**:
1. pre-flight-checks ✅
2. comprehensive-validation ✅
3. dispatch-autonomous-agent ✅ (triggers Phase 3)

**Logs to Check**:
```bash
# Look for agent dispatch message
✅ "Dispatching ollama-autonomous-agent workflow"
```

**Success Indicator**:
- All 3 jobs complete
- Agent workflow automatically triggered

---

### ⭐ Phase 3: Ollama Autonomous Agent (20-120 minutes) - CRITICAL

**What**: Real Ollama bootstrap, model verification, real LLM inference, autonomous coding

**Workflows**:
- `ollama-autonomous-agent.yml`

**8 Critical Phases** (watch logs for):

**Phase 3a: Bootstrap Ollama** (1-5 min)
```
✅ Ollama server is healthy at http://127.0.0.1:11434
✅ Ollama version: 0.1.0
```

**Phase 3b: Verify Model** (1-10 min)
```
✅ Model qwen2.5-coder:3b available
✅ Model verification complete
```

**Phase 3c: Inference Test** (1-2 min)
```
✅ Inference test: OLLAMA_QMOI_HEALTH_OK received
✅ Inference latency: XXXms
```

**Phase 3d: Autonomous Loop** (5-120 min)
```
✅ Autonomous agent started
✅ Iteration 1/3: Analyzing repository
✅ LLM response received
✅ Files modified: X
✅ Tests pass: 173/173
```

**Phase 3e: Success Contract** (1 min)
```
✅ OLLAMA_SUCCESS.json generated
✅ final_status: SUCCESS
```

**Critical Success Contract Fields**:
```json
{
  "final_status": "SUCCESS",          ← MUST BE "SUCCESS"
  "ollama_started": true,             ← MUST BE true
  "ollama_healthy": true,             ← MUST BE true
  "model_available": true,            ← MUST BE true
  "inference_verified": true,         ← MUST BE true
  "llm_coding_started": true,
  "validation_passed": true,          ← MUST BE true
  "checkpoint_created": true
}
```

**Failure Detection**:
```bash
# Download and check contract
❌ If file missing → FAILED
❌ If final_status != "SUCCESS" → FAILED
❌ If any true field is false → FAILED
```

---

### ✅ Phase 4: Parallel Operations (5-10 minutes)

**What**: Real-time monitoring, sync, and PR management happen in parallel

**Workflows** (run simultaneously, don't block success):
- `ollama-autonomous-agent-realtime-monitor.yml` - Live status updates
- `branch-sync.yml` - Sync QE ↔ AQ repositories
- `pr-monitor.yml` - Update PR status
- `workflow-tracker.yml` - Collect telemetry

**What to Expect**:
- These don't contribute to success/failure judgment
- They provide observability and coordination
- Auto-merge PR if approved

---

### ✅ Phase 5: Completion

**Overall Success**: ✅ ALL phases complete with ✅ status

**Overall Failure**: ❌ ANY phase shows ❌ status or contract invalid

---

## Live Monitoring Methods

### Method 1: GitHub Web UI (EASIEST)

1. Go to: https://github.com/thealphakenya/qmoi-enhanced/actions
2. Click workflow name on left
3. Watch jobs progress in real-time
4. Click job for detailed logs
5. When complete, click "Artifacts" to download `ollamatracks/`

**Advantages**:
- No setup required
- Visual status indicators
- Easy to navigate logs
- Download artifacts with one click

---

### Method 2: GitHub CLI (LOCAL TERMINAL)

**Setup** (one-time):
```bash
# Install GitHub CLI if needed
brew install gh  # or apt install gh

# Authenticate
gh auth login
```

**List latest runs**:
```bash
gh run list -R thealphakenya/qmoi-enhanced -L 8
```

**Watch specific run**:
```bash
gh run watch <RUN_ID> -R thealphakenya/qmoi-enhanced
```

**Download artifacts**:
```bash
gh run download <RUN_ID> -R thealphakenya/qmoi-enhanced -D ./artifacts
cat artifacts/ollamatracks/OLLAMA_SUCCESS.json | jq .
```

**View workflow**:
```bash
gh workflow view -R thealphakenya/qmoi-enhanced ollama-autonomous-agent.yml
```

---

### Method 3: Python Monitor (ADVANCED)

**Setup**:
```bash
export GITHUB_TOKEN=<your-github-token>
```

**Run monitor**:
```bash
python scripts/monitor_workflows.py
```

**Monitor will**:
- Track all 8 workflows
- Update every 30 seconds
- Display job status changes
- Generate markdown report
- Alert on completion

---

### Method 4: Terminal Watch Loop

**Quick loop**:
```bash
watch -n 60 'gh run list -R thealphakenya/qmoi-enhanced -L 8'
```

**Custom watch**:
```bash
while true; do
  clear
  echo "=== GitHub Workflow Status $(date) ==="
  gh run list -R thealphakenya/qmoi-enhanced -L 8 \
    --json status,name,conclusion,updatedAt
  sleep 30
done
```

---

## Key Metrics to Track

### Ollama Startup
```
Expected: < 5 minutes
Watch for: "Ollama server is healthy at http://127.0.0.1:11434"
Failure if: Timeout or port already in use
```

### Model Loading
```
Expected: 1-10 minutes (first run may be slower)
Watch for: "Model qwen2.5-coder:3b available"
Failure if: Model pull fails or times out
```

### Inference Verification
```
Expected: < 5 seconds response time
Watch for: "Inference test: OLLAMA_QMOI_HEALTH_OK received"
Failure if: Timeout or unexpected response
```

### Test Pass Rate
```
Expected: 173/173 tests passing
Watch for: "Final validation: PASSED"
Failure if: Any test failure
```

### Autonomous Iterations
```
Expected: 1-3 iterations (default MAX_ITERATIONS=3)
Watch for: "Iteration X/3: ..."
Failure if: Exceeds max iterations or hangs
```

### Success Contract
```
Expected: OLLAMA_SUCCESS.json with final_status: SUCCESS
Watch for: In artifacts/ollamatracks/
Failure if: File missing or final_status != SUCCESS
```

---

## Success Verification Checklist

### GitHub Actions UI
- [ ] All workflow jobs completed
- [ ] All jobs showing ✅ green checkmarks
- [ ] No ❌ red failures
- [ ] Estimated time matches expectations

### Artifacts
- [ ] `ollamatracks/` directory available for download
- [ ] OLLAMA_SUCCESS.json present
- [ ] ollama-server.log present
- [ ] agent_run_*.log present
- [ ] telemetry.jsonl present
- [ ] checkpoint.json present

### Contract Verification
```bash
cat artifacts/ollamatracks/OLLAMA_SUCCESS.json | jq '.'
```

Verify all these fields:
- [ ] final_status: "SUCCESS"
- [ ] ollama_started: true
- [ ] ollama_healthy: true
- [ ] model: "qwen2.5-coder:3b"
- [ ] model_available: true
- [ ] inference_verified: true
- [ ] llm_coding_started: true
- [ ] validation_passed: true
- [ ] checkpoint_created: true

### Log Verification
```bash
# Check for success messages in logs
grep "Autonomous agent executed successfully" artifacts/ollamatracks/agent_run_*.log

# Check for errors
grep "ERROR\|FAILED\|Exception" artifacts/ollamatracks/agent_run_*.log

# Check Ollama health
head -20 artifacts/ollamatracks/ollama-server.log
```

### Final Confirmation
```bash
# Should say SUCCESS
jq '.final_status' artifacts/ollamatracks/OLLAMA_SUCCESS.json
# Output should be: "SUCCESS"
```

---

## Failure Diagnostics

### If Phase 1 (PR Validation) Fails

**Check**: Which job failed?

**For workflow-integrity**:
```bash
# Download artifact, check logs
# Look for: "FAILED" or duplicate key errors
gh run download <RUN_ID> -R thealphakenya/qmoi-enhanced
cat artifacts/*validation*.txt
```

**For validate-platforms**:
```bash
# Check platform validation logs
grep "PLATFORM\|ERROR" artifacts/*platform*.log
```

**For test-suite**:
```bash
# Run locally to reproduce
python -m pytest tests -v --tb=short
```

**For final-validation**:
```bash
# Run locally
python scripts/ollama_autonomous_agent.py validate-all
```

---

### If Phase 2 (Orchestrator) Fails

**Check**: Preflight logs

```bash
# Download and inspect
gh run download <RUN_ID> -R thealphakenya/qmoi-enhanced
grep "ERROR\|FAILED" artifacts/*.log

# Run locally
python --version  # Should be 3.11
git status        # Should be clean
python -m compileall scripts tests
```

---

### If Phase 3 (Autonomous Agent) Fails

**Most Important**: Check OLLAMA_SUCCESS.json

```bash
gh run download <RUN_ID> -R thealphakenya/qmoi-enhanced -D ./artifacts

# Check if contract exists
ls -la artifacts/ollamatracks/OLLAMA_SUCCESS.json

# Check status
jq '.final_status' artifacts/ollamatracks/OLLAMA_SUCCESS.json

# If FAILED or missing, check diagnostics
cat artifacts/ollamatracks/ollama-server.log | head -50
cat artifacts/ollamatracks/agent_run_1.log | grep "ERROR\|FAILED"
```

**Ollama Bootstrap Failure** (most common):
```bash
# Check if Ollama started
grep "Ollama server is healthy" artifacts/ollamatracks/ollama-server.log

# Check if port was in use
grep "port\|Address\|bind" artifacts/ollamatracks/ollama-server.log
```

**Model Loading Failure**:
```bash
# Check model availability
grep "model\|pulling\|ERROR" artifacts/ollamatracks/agent_run_1.log
```

**Inference Failure**:
```bash
# Check inference test
grep "inference\|OLLAMA_QMOI_HEALTH_OK" artifacts/ollamatracks/agent_run_1.log
```

**Validation Failure After LLM**:
```bash
# Check test failures
grep "FAILED\|ERROR" artifacts/ollamatracks/agent_run_1.log

# Run locally
python -m pytest tests -v
```

---

## Expected Timing

**Phase 1**: 5-10 minutes
- workflow-integrity: 1-2 min
- Platform validation: 2-3 min (parallel)
- Feature validation: 2-3 min (parallel)
- Test suite: 2-3 min (parallel)
- Documentation: 1-2 min (parallel)
- Final validation: 1-2 min

**Phase 2**: 3-5 minutes
- Preflight: 1-2 min
- Validation: 2-3 min
- Agent dispatch: < 1 min

**Phase 3**: 20-120 minutes (most common: 20-60 min)
- Environment setup: 2-3 min
- Ollama bootstrap: 1-5 min
- Model pull: 1-10 min (first time only)
- Inference test: 1-2 min
- Repository validation: 2-3 min
- Autonomous loop: 5-30 min per iteration (default 1-3 iterations)
- Post-loop validation: 2-3 min
- Contract generation: 1 min

**Phase 4**: 5-10 minutes (parallel)
- All workflows run simultaneously

**Total**: 30-160 minutes (most runs: 30-60 minutes)

---

## Real-Time Dashboard

See [WORKFLOW_STATUS_DASHBOARD.md](WORKFLOW_STATUS_DASHBOARD.md) for:
- Phase-by-phase execution details
- Job status matrix
- Success/failure criteria
- 5-phase timeline
- Observer checklist

---

## No False Successes Guarantee

This system **WILL NOT** print success messages unless:

✅ Ollama bootstrap succeeds  
✅ Model loads successfully  
✅ Real inference test passes  
✅ Autonomous loop completes  
✅ Repository validation passes  
✅ OLLAMA_SUCCESS.json created with:
   - final_status: "SUCCESS"
   - ollama_healthy: true
   - model_available: true
   - inference_verified: true
   - validation_passed: true

**No shortcuts. No compromises. Real proof required.**

---

## Quick Reference

| Scenario | Action | Location |
|----------|--------|----------|
| Want to see live status? | Go to GitHub Actions | https://github.com/thealphakenya/qmoi-enhanced/actions |
| Want to monitor in terminal? | Run CLI | `gh run watch <ID>` |
| Want to monitor with Python? | Export token & run script | `python scripts/monitor_workflows.py` |
| Need to download artifacts? | Use GitHub CLI | `gh run download <ID> -D ./artifacts` |
| Need to check contract? | Parse JSON | `jq . artifacts/ollamatracks/OLLAMA_SUCCESS.json` |
| Everything failing? | Check Ollama logs | `cat artifacts/ollamatracks/ollama-server.log` |
| System ready? | Check dashboard | [WORKFLOW_STATUS_DASHBOARD.md](WORKFLOW_STATUS_DASHBOARD.md) |

---

**Last Updated**: 2026-08-29  
**Version**: 1.0 Production Ready  
**Status**: Ready for GitHub Actions Execution
