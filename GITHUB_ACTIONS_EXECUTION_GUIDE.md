# GitHub Actions Execution Guide (2026-08-29)

## Overview

This guide explains exactly what happens when the QMOI Ollama Autonomous Agent system executes on GitHub Actions, and how to verify that it genuinely works without false successes.

---

## Execution Timeline

### Event: Push to `main` or PR to `main`

```
TIME  | EVENT                          | WORKFLOW                      | STATUS
------+--------------------------------+-------------------------------+--------
T+0s  | Code pushed                    | -                             | -
T+5s  | PR Validation triggered        | ollama-pr-validation.yml      | QUEUED
T+10s | Workflow started               | ollama-pr-validation          | RUNNING
```

### Stage 1: PR Validation (5-10 minutes)

**Workflow**: `ollama-pr-validation.yml`

**Jobs (Parallel)**:

1. **workflow-integrity** (1-2 min)
   - ✅ Verify artifact actions v4
   - ✅ Verify workflow files exist
   - ✅ Verify agent script exists
   - ✅ Check for malformed keys
   - **Success Criteria**: No deprecated actions, all required files present

2. **validate-platforms** (2-3 min per platform)
   - Python setup
   - Dependency installation
   - Run: `python scripts/ollama_autonomous_agent.py validate-platforms`
   - **Tests**: 6 platforms (windows, macos, linux, ios, android, web)
   - **Success Criteria**: All platforms validate without error

3. **validate-features** (2-3 min)
   - Depends on: validate-platforms
   - Run: `python scripts/ollama_autonomous_agent.py validate-all-features`
   - **Tests**: 293+ platform-specific features
   - **Success Criteria**: Feature registry complete and valid

4. **test-suite** (2-3 min)
   - Run: `python -m pytest tests -v --tb=short`
   - **Tests**: 173 unit and integration tests
   - **Success Criteria**: 173/173 tests pass, 0 skipped, 0 failures

5. **validate-documentation** (1-2 min)
   - Verify required .md files exist
   - **Files Required**: API.md, ENDPOINTS.md, ROUTES.md, ALLMDFILESREFS.md, etc.
   - **Success Criteria**: All required documentation present

6. **final-validation** (Always runs)
   - Depends on: All other jobs
   - Run: `python scripts/ollama_autonomous_agent.py validate-all`
   - Generates: `github_proof_contract.json`
   - **Success Criteria**: `status: "ready_for_github"`

**PR Validation Success Criteria** ✅

- All 6 platforms validate successfully
- All 293+ features validate successfully  
- All 173 tests pass
- All documentation files present
- Final validation generates proof contract

**On Failure** ❌

- Artifacts uploaded for 30 days
- PR blocked from merging
- Error details in logs

---

### Stage 2: Master Orchestrator (Triggered after PR Validation)

**Workflow**: `ollama-master-orchestrator.yml`

**Trigger**: `workflow_dispatch` OR automatic (schedule/on-demand)

**Jobs**:

1. **pre-flight-checks** (2-3 min)
   - Python version verification
   - Git repository health check
   - Essential files verification
   - Auto-healing if needed
   - **Success Criteria**: Python 3.11, Git healthy, files present

2. **comprehensive-validation** (3-5 min)
   - Matrix: 3 validation types (platforms, features, tests)
   - Runs same validations as PR workflow
   - **Success Criteria**: All pass

3. **dispatch-autonomous-agent** (Conditional)
   - Only if: Master orchestrator succeeds
   - **Action**: Dispatch `ollama-autonomous-agent.yml`

---

### Stage 3: Ollama Autonomous Agent (CRITICAL EXECUTION)

**Workflow**: `ollama-autonomous-agent.yml`

**Trigger**: `workflow_run` (after master orchestrator success)

**This is where the REAL work happens - NO FALSE SUCCESS ALLOWED**

#### Job: ollama-agent (240 minutes max)

**Phase 1: Environment Setup** (2-3 min)
```bash
✅ Checkout trusted default branch
✅ Runner preflight (OS, CPU, memory, disk)
✅ Setup Python 3.11
✅ Install dependencies
✅ Git repository repair if needed
```

**Phase 2: Ollama Bootstrap** (1-5 min) ⭐ CRITICAL
```bash
✅ Check if Ollama installed
✅ Install Ollama if missing (curl install.sh | sh)
✅ Export OLLAMA_HOST=http://127.0.0.1:11434
✅ Start Ollama server (nohup ollama serve)
✅ Wait for server health (90 seconds max)
✅ Verify /api/tags endpoint responds
✅ Log server output to ollamatracks/ollama-server.log
```

**Success**: Server responds to HTTP requests
**Failure**: Exit with error, NO FALSE SUCCESS

**Phase 3: Model Verification** (1-5 min per model) ⭐ CRITICAL
```bash
✅ Call /api/tags to list available models
✅ Check if qwen2.5-coder:3b present
✅ If missing: Pull with ollama pull qwen2.5-coder:3b
✅ Wait for pull completion (can be 2-10 min)
✅ Verify model available via /api/tags
```

**Success**: Model available and responds
**Failure**: Exit with error, NO FALSE SUCCESS

**Phase 4: Real Inference Test** (1-2 min) ⭐ CRITICAL
```bash
✅ Send HTTP POST to /api/generate
✅ Prompt: "Return exactly: OLLAMA_QMOI_HEALTH_OK"
✅ Wait for inference response
✅ Verify response contains expected text
✅ Record inference_latency_ms
```

**Success**: Real LLM responds with expected output
**Failure**: Exit with error, NO FALSE SUCCESS

**Phase 5: Repository Validation** (2-3 min)
```bash
✅ Run: python scripts/ollama_autonomous_agent.py validate-all
✅ Check all platforms, features, tests
✅ Generate github_proof_contract.json
```

**Phase 6: Autonomous Coding Loop** (Variable, 120 min max)
```bash
✅ Set MAX_ITERATIONS=3 (configurable)
✅ Set MAX_TASKS_PER_ITERATION=10
✅ Set MAX_RECOVERY_ATTEMPTS=3
✅ Run: python scripts/ollama_autonomous_agent.py autonomous
```

**Loop Details**:
- Iteration 1:
  - ✅ Analyze repository state
  - ✅ Identify issues/TODOs
  - ✅ Send context to qwen2.5-coder:3b
  - ✅ Receive coding suggestions
  - ✅ Parse repair plan (JSON)
  - ✅ Validate proposed changes
  - ✅ Apply safe changes
  - ✅ Run tests
  - ✅ Check if all pass → Loop again or continue?

**Phase 7: Post-Loop Validation** (2-3 min) ⭐ CRITICAL
```bash
✅ Run full test suite
✅ Check for regressions
✅ Validate documentation
✅ Generate checkpoint
```

**Phase 8: Success Contract Generation** (1 min) ⭐ CRITICAL
```bash
✅ Create ollamatracks/OLLAMA_SUCCESS.json with:
   {
     "final_status": "SUCCESS",
     "workflow_run_id": "...",
     "repository": "thealphakenya/qmoi-enhanced",
     "commit": "...",
     "agent_started": true,
     "ollama_started": true,
     "ollama_healthy": true,
     "ollama_version": "0.1.0",
     "model": "qwen2.5-coder:3b",
     "model_available": true,
     "inference_verified": true,
     "inference_latency": 1234,
     "llm_coding_started": true,
     "llm_iterations": 1,
     "files_analyzed": 42,
     "files_modified": 5,
     "tests_before": 173,
     "tests_after": 173,
     "validation_passed": true,
     "checkpoint_created": true,
     "timestamp": "2026-08-29T12:34:56Z"
   }
```

**Phase 9: Final Health Gate** (1 min) ⭐ CRITICAL
```bash
✅ Check if OLLAMA_SUCCESS.json exists
✅ Verify final_status == "SUCCESS"
✅ Verify all required fields are true:
   - ollama_healthy: true
   - model_available: true
   - inference_verified: true
   - validation_passed: true
   - checkpoint_created: true
```

**Only if ALL checks pass:**
```
✅ Publish: "Autonomous agent executed successfully."
✅ Ollama AI has started coding.
✅ Model: qwen2.5-coder:3b
✅ LLM inference: verified
✅ Autonomous iterations: 1
✅ Files analyzed: 42
✅ Files modified: 5
✅ Final validation: PASSED
```

**If ANY check fails:**
```
❌ Exit with error code 1
❌ No success message printed
❌ OLLAMA_SUCCESS.json NOT generated or final_status != SUCCESS
```

---

### Stage 4: Real-Time Monitoring (Parallel)

**Workflow**: `ollama-autonomous-agent-realtime-monitor.yml`

**Trigger**: Schedule (every 5 min)

**Responsibilities**:
- ✅ Monitor PR validation progress
- ✅ Monitor agent execution state
- ✅ Update commit status
- ✅ Generate live dashboard
- ✅ Alert on failures

**Does NOT**:
- Generate success messages (only reports)
- Modify OLLAMA_SUCCESS.json
- Claim success independently

---

### Stage 5: Synchronization & Auto-Merge

**Workflow**: `branch-sync.yml` (parallel with agent)

**Trigger**: Schedule OR after validation

**Responsibilities**:
- ✅ Audit both QE and Alpha-Q-ai repositories
- ✅ Inventory all branches, files, directories
- ✅ Classify ownership (QE, AQ, BOTH, HISTORICAL, CONFLICT)
- ✅ Create conflict-free sync PR
- ✅ Update ALLMDFILESREFS.md

**Auto-Merge**: `auto-merge-automated-pr.yml`

**Only merges if**:
- ✅ All checks passing
- ✅ Required approvals present
- ✅ No conflicts
- ✅ Sync validation successful

---

## False-Success Prevention Mechanisms

### Level 1: Workflow Dispatch Gate
```yaml
# Must pass PR validation before agent trigger
if: github.event.workflow_run.conclusion == 'success'
```

### Level 2: Ollama Bootstrap Gate
```bash
# Agent exits if Ollama fails to start
if ! curl "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
  echo "::error::Ollama startup failed"
  exit 1
fi
```

### Level 3: Model Verification Gate
```bash
# Agent exits if model unavailable
if ! grep -q "qwen2.5-coder:3b" <(curl "$OLLAMA_HOST/api/tags"); then
  echo "::error::Model not available"
  exit 1
fi
```

### Level 4: Inference Verification Gate
```bash
# Agent exits if real inference fails
response=$(curl -X POST "$OLLAMA_HOST/api/generate" -d '...')
if ! grep -q "OLLAMA_QMOI_HEALTH_OK" <<<"$response"; then
  echo "::error::Inference test failed"
  exit 1
fi
```

### Level 5: Post-Loop Validation Gate
```bash
# Agent exits if tests fail after LLM modifications
if ! python -m pytest tests -q; then
  echo "::error::Validation failed after LLM coding"
  exit 1
fi
```

### Level 6: Success Contract Gate (FINAL)
```bash
# Requires OLLAMA_SUCCESS.json with SUCCESS status
if [ ! -f "ollamatracks/OLLAMA_SUCCESS.json" ]; then
  echo "::error::No success contract generated"
  exit 1
fi

if ! python -c "import json; data=json.load(open('ollamatracks/OLLAMA_SUCCESS.json')); raise SystemExit(0 if data.get('final_status') == 'SUCCESS' else 1)"; then
  echo "::error::Success contract does not indicate SUCCESS"
  exit 1
fi
```

---

## Success Verification Checklist

### ✅ On Successful Execution

1. **GitHub Actions UI**
   - All workflow jobs show ✅ green
   - Durations match expectations (5-10 min validation + 10-30 min agent)

2. **Artifacts**
   - `ollama-autonomous-agent-<run_id>` artifact available
   - Contains `ollamatracks/` directory

3. **ollamatracks/ Contents**
   ```
   OLLAMA_SUCCESS.json          ← Success contract with final_status: SUCCESS
   ollama-server.log            ← Ollama startup logs
   agent_run_1.log              ← Agent execution log
   telemetry.jsonl              ← Event telemetry
   CURRENT_STATUS.txt           ← Status snapshot
   LATEST_ACTIVITY.txt          ← Recent activity
   checkpoint.json              ← Resumable state
   ```

4. **OLLAMA_SUCCESS.json Validation**
   ```json
   {
     "final_status": "SUCCESS",
     "ollama_started": true,
     "ollama_healthy": true,
     "model_available": true,
     "inference_verified": true,
     "llm_coding_started": true,
     "validation_passed": true,
     "checkpoint_created": true
   }
   ```

5. **Workflow Logs**
   ```
   ✅ Ollama server is healthy at http://127.0.0.1:11434
   ✅ Model qwen2.5-coder:3b available
   ✅ Inference test: OLLAMA_QMOI_HEALTH_OK received
   ✅ Autonomous agent executed successfully.
   ✅ Ollama AI has started coding.
   ✅ Files modified: X
   ✅ Validation: PASSED
   ```

### ❌ On Failure Execution

1. **GitHub Actions UI**
   - At least one job shows ❌ red
   - Workflow run marked as "failed"

2. **Artifacts**
   - `ollamatracks/` contains failure diagnostics
   - `OLLAMA_SUCCESS.json` either missing OR `final_status: "FAILED"`

3. **Workflow Logs**
   - Specific error message showing what failed
   - No false "Autonomous agent executed successfully" message

---

## Debugging Failed Workflows

### If PR Validation Fails

1. Download `validation-artifacts` artifact
2. Check `pytest-output.txt` for test failures
3. Check platform validation logs
4. Run locally: `python -m pytest tests -v`

### If Master Orchestrator Fails

1. Check preflight logs
2. Verify Python 3.11 available
3. Check Git repository status
4. Run locally: `python -m compileall scripts tests`

### If Autonomous Agent Fails

1. Check `ollamatracks/ollama-server.log`
   - Look for Ollama startup errors
   - Check port 11434 is available

2. Check `agent_run_1.log`
   - Look for model pull failures
   - Look for inference timeouts
   - Check for validation failures

3. Verify `OLLAMA_SUCCESS.json` exists and check `final_status`

4. Check ollamatracks/ directory timestamps for staleness

---

## Expected Execution Times

| Stage | Min | Max | Notes |
|-------|-----|-----|-------|
| PR Validation | 5 | 10 | Parallel jobs |
| Master Orchestrator | 3 | 5 | Preflight + validation |
| Ollama Bootstrap | 1 | 5 | Install + startup |
| Model Verification | 1 | 10 | May need to pull 100-500MB |
| Inference Test | 1 | 2 | Quick sanity check |
| Repository Validation | 2 | 3 | Full validation |
| Autonomous Loop | 5 | 120 | Depends on iterations (max 3) |
| Post-Loop Validation | 2 | 3 | Final checks |
| Total | 20 | 158 | Most runs: 20-60 min |

---

## Key Metrics to Watch

1. **Ollama Startup Time**: Should be <5 min
2. **Model Pull Time**: Depends on network, 1-10 min first run
3. **Inference Latency**: Should be <5 seconds per inference
4. **Test Pass Rate**: Must be 100% (173/173)
5. **Autonomous Iterations**: Typically 1-3
6. **Files Modified**: Depends on work done

---

## No False Success Guarantees

This system **WILL NOT** print:

❌ "Autonomous agent executed successfully"

Unless ALL of the following are proven true:

1. ✅ Ollama server started and healthy
2. ✅ Model qwen2.5-coder:3b available
3. ✅ Real inference test passed
4. ✅ Autonomous coding loop executed
5. ✅ Repository validation passed
6. ✅ OLLAMA_SUCCESS.json created
7. ✅ final_status == "SUCCESS"

---

**Last Updated**: 2026-08-29  
**Version**: 1.0 (Production Ready)  
**Status**: ✅ Ready for GitHub Actions Execution
