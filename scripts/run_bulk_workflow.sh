#!/usr/bin/env bash
set -euo pipefail

# Enhanced run_bulk_workflow.sh
# Usage:
#   ./run_bulk_workflow.sh          (dry-run)
#   ./run_bulk_workflow.sh --apply  (execute fixes/checks)
#   ./run_bulk_workflow.sh --apply --fix-sw --fix-pwa --run-lint --run-tests

DRY_RUN=1
APPLY=0
FIX_SW=0
FIX_PWA=0
RUN_LINT=0
RUN_TESTS=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) DRY_RUN=0; APPLY=1; shift ;;
    --fix-sw) FIX_SW=1; shift ;;
    --fix-pwa) FIX_PWA=1; shift ;;
    --run-lint) RUN_LINT=1; shift ;;
    --run-tests) RUN_TESTS=1; shift ;;
    --help) echo "Usage: $0 [--apply] [--fix-sw] [--fix-pwa] [--run-lint] [--run-tests]"; exit 0 ;;
    *) echo "Unknown arg: $1"; shift ;;
  esac
done

WORKDIR="$(cd "$(dirname "$0")/.." && pwd)"
REPORTS_DIR="$WORKDIR/reports"
mkdir -p "$REPORTS_DIR"
NONPROD_REPORT="$REPORTS_DIR/nonprod_matches.txt"
INTEGRATION_REPORT="$REPORTS_DIR/integration_test_results.txt"
FIX_LOG="$REPORTS_DIR/fix_log.txt"
RESUME_FILE="$WORKDIR/resumefromhere.txt"

echo "DRY_RUN=$DRY_RUN APPLY=$APPLY FIX_SW=$FIX_SW FIX_PWA=$FIX_PWA RUN_LINT=$RUN_LINT RUN_TESTS=$RUN_TESTS"

echo "1) Scanning repo for non-production markers..."
GREP_PATTERN='DEBUG|DEBUG_MODE|STAGING|STAGE_|production_IMPLEMENTED=false|TODO: non-prod|PLACEHOLDER|XXX|REPLACE_ME|adPRODUCTIONentListener'
GREP_CMD="grep -RIn --line-number --hidden --exclude-dir=.git --exclude-dir=node_modules -E \"$GREP_PATTERN\" \"$WORKDIR\" || true"

if [[ $DRY_RUN -eq 1 ]]; then
  echo "DRY: $GREP_CMD"
else
  echo "Running repo scan..."
  eval "$GREP_CMD" > "$NONPROD_REPORT" || true
  echo "Wrote $NONPROD_REPORT"
fi

echo "2) Optional safe-fixes (service worker / PWA)"
if [[ $FIX_SW -eq 1 || $FIX_PWA -eq 1 ]]; then
  echo "Will attempt safe automated fixes for common issues. (Dry-run=$DRY_RUN)"
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY: find . -type f -name '*.js' -o -name '*.ts' -o -name '*.html' -print | xargs grep -n 'adPRODUCTIONentListener' || true"
  else
    echo "Running replacements for 'adPRODUCTIONentListener' -> 'addEventListener'"
    # Find JS/HTML files and replace adPRODUCTIONentListener with addEventListener (create .bak)
    while IFS= read -r -d '' file; do
      if grep -Iq "adPRODUCTIONentListener" "$file"; then
        echo "Fixing $file" | tee -a "$FIX_LOG"
        sed -i.bak 's/adPRODUCTIONentListener/addEventListener/g' "$file" || true
      fi
    done < <(find "$WORKDIR" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.html" \) -print0)
    echo "Service worker / PWA fixes logged to $FIX_LOG"
  fi
fi

echo "3) Integration endpoint checks (model & chat)"
API_HOSTS=("http://localhost:3000" "http://127.0.0.1:3000")
MODEL_PATH="/api/qmoi-model"
CHAT_PATH="/api/qmoi/chat"

if [[ $DRY_RUN -eq 1 ]]; then
  for h in "${API_HOSTS[@]}"; do
    echo "DRY: curl -sS --fail $h$MODEL_PATH || echo 'unreachable'"
    echo "DRY: curl -sS -X POST -H 'Content-Type: application/json' -d '{\"input\":\"ping\"}' $h$CHAT_PATH || echo 'unreachable'"
  done
else
  echo "Integration tests run at $(date)" > "$INTEGRATION_REPORT"
  for h in "${API_HOSTS[@]}"; do
    echo "Testing $h$MODEL_PATH" | tee -a "$INTEGRATION_REPORT"
    if command -v curl >/dev/null 2>&1 && curl -sS --fail "$h$MODEL_PATH" -o /dev/null 2>&1; then
      echo "OK: $h$MODEL_PATH" | tee -a "$INTEGRATION_REPORT"
    else
      echo "FAIL: $h$MODEL_PATH" | tee -a "$INTEGRATION_REPORT"
    fi

    echo "Testing $h$CHAT_PATH (simple POST)" | tee -a "$INTEGRATION_REPORT"
    if command -v curl >/dev/null 2>&1 && curl -sS -X POST -H "Content-Type: application/json" -d '{"input":"ping"}' "$h$CHAT_PATH" -o /dev/null 2>&1; then
      echo "OK: POST $h$CHAT_PATH" | tee -a "$INTEGRATION_REPORT"
    else
      echo "FAIL: POST $h$CHAT_PATH" | tee -a "$INTEGRATION_REPORT"
    fi
  done
  echo "Wrote $INTEGRATION_REPORT"
fi

echo "4) Optional lint and test execution"
if [[ $RUN_LINT -eq 1 ]]; then
  if command -v npm >/dev/null 2>&1; then
    if [[ $DRY_RUN -eq 1 ]]; then
      echo "DRY: npm run lint --silent"
    else
      echo "Running lint (npm run lint --silent)"
      npm run lint --silent || true
    fi
  else
    echo "npm not found; skipping lint step"
  fi
fi

if [[ $RUN_TESTS -eq 1 ]]; then
  if command -v npm >/dev/null 2>&1; then
    if [[ $DRY_RUN -eq 1 ]]; then
      echo "DRY: npm test --silent"
    else
      echo "Running tests (npm test --silent)"
      npm test --silent || true
    fi
  else
    echo "npm not found; skipping tests step"
  fi
fi

echo "5) Attempt to run automatic docs refresh (if available)"
if command -v npm >/dev/null 2>&1; then
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY: npm run update-api-docs || bash scripts/autoupdate_api_docs.sh"
  else
    if npm run update-api-docs --silent; then
      echo "Ran npm run update-api-docs"
    elif bash scripts/autoupdate_api_docs.sh; then
      echo "Ran scripts/autoupdate_api_docs.sh"
    else
      echo "No docs update script succeeded; skipped"
    fi
  fi
else
  echo "npm not found; skipping automatic docs refresh"
fi

echo "6) Update resumefromhere.txt with summary"
TIMESTAMP="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
SUMMARY="$TIMESTAMP - run_bulk_workflow: DRY_RUN=$DRY_RUN APPLY=$APPLY FIX_SW=$FIX_SW FIX_PWA=$FIX_PWA RUN_LINT=$RUN_LINT RUN_TESTS=$RUN_TESTS"
if [[ $DRY_RUN -eq 1 ]]; then
  echo "DRY: append to $RESUME_FILE: $SUMMARY"
else
  echo "$SUMMARY" >> "$RESUME_FILE"
  echo "Appended to $RESUME_FILE"
fi

echo "Completed. Reports (if any) are in: $REPORTS_DIR"
if [[ $DRY_RUN -eq 1 ]]; then
  echo "Dry-run complete. To apply: $0 --apply [--fix-sw] [--fix-pwa] [--run-lint] [--run-tests]"
fi
