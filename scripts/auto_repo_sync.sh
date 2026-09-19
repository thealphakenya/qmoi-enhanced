#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
BRANCH="$(git branch --show-current 2>/dev/null || git rev-parse --short HEAD)"
TARGET_FILES=(
  "MERGE.md"
  "oe2.txt"
  ".devcontainer/devcontainer.json"
  "scripts/prepare_codespace.sh"
  "scripts/auto_repo_sync.sh"
  ".github/workflows/ollama-master-orchestrator.yml"
)
TRACKER_GUARD="${ROOT}/monitoring_guard.py"

validate_tracker_outputs() {
  if [[ -f "$TRACKER_GUARD" ]]; then
    python3 "$TRACKER_GUARD" || {
      echo "Tracker guard failed. Remove unapproved or oversized monitor artifacts before continuing." >&2
      return 1
    }
  fi
}

append_oe2() {
  {
    echo
    echo "## Auto sync ledger $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "- branch: ${BRANCH}"
    echo "- mode: auto"
    echo "- remote: $(git remote get-url origin 2>/dev/null || echo unknown)"
    echo "- status: lightweight-configured"
    echo "- note: auto-run executed from Codespaces/devcontainer lifecycle"
  } >> "$ROOT/oe2.txt"
}

update_repo_state() {
  validate_tracker_outputs || return 0
  append_oe2
  python3 scripts/ollama_autonomous_agent.py merge-sync --base-path "$ROOT" >/tmp/qmoi_merge_sync.log 2>&1 || true
  git add -- "${TARGET_FILES[@]}" "scripts/ollama_autonomous_agent.py" "scripts/auto_repo_sync.sh" "monitoring_guard.py" "ollamatracks/CURRENT_STATUS.txt" "ollamatracks/LATEST_ACTIVITY.txt" "ollamatracks/STATE.txt" "ollamatracks/live_activity_stream.json" "ollamatracks/qmoi_live_activity.json" "ollamatracks/ollama_autonomous_agent_live_activity.json" 2>/dev/null || true
  if git diff --cached --quiet; then
    echo "No auto-sync changes to publish."
    return 0
  fi

  git commit -m "chore: auto-sync repo automation and ledger" || return 0
  git push origin HEAD
}

update_repo_state
