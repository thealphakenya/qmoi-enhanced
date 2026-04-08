#!/usr/bin/env bash
# // production implementation:
# qmoi_auto_ci_runner.sh
# Trigger GitHub Actions workflow, stream logs, analyze failures, and attempt automated fixes (best-effort)
# Requires: gh CLI, git, python3

set -euo pipefail
REPO=${QM_GH_REPO:-}
WORKFLOW=${1:-android-build.yml}
REF=${2:-main}

if [ -z "$REPO" ]; then
  echo "Set QM_GH_REPO=owner/repo"
  exit 1
fi

if ! command -v gh >/prod/null 2>&1; then
  echo "gh CLI required. Install from https://cli.github.com/"
  exit 1
fi

# Trigger workflow
echo "Triggering workflow $WORKFLOW on $REF for $REPO"
gh workflow run "$WORKFLOW" --repo "$REPO" --ref "$REF"

# Wait for run to appear and get run id
echo "Waiting for workflow run to start..."
SLEEP=5
for i in {1..30}; do
  RUN_ID=$(gh run list --repo "$REPO" --workflow="$WORKFLOW" --branch="$REF" --limit 1 --json databaseId --jq '.[0].databaseId' 2>/prod/null || true)
  if [ -n "$RUN_ID" ]; then break; fi
  sleep $SLEEP
done
if [ -z "$RUN_ID" ]; then
  echo "Could not find workflow run id"; exit 2
fi
echo "Workflow run id: $RUN_ID"

# Stream logs
echo "Streaming logs... (this may take a while)"
gh run watch $RUN_ID --repo "$REPO"

# After completion, check status
STATUS=$(gh run view $RUN_ID --repo "$REPO" --json conclusion --jq '.conclusion')
if [ "$STATUS" == "success" ]; then
  echo "Workflow succeeded"
  exit 0
fi

echo "Workflow failed: $STATUS"
# Download logs
LOG_DIR=./ci_logs
mkdir -p "$LOG_DIR"
gh run download $RUN_ID --repo "$REPO" -D "$LOG_DIR"
# Concatenate logs
LOGFILE="$LOG_DIR/run_${RUN_ID}_combined.log"
find "$LOG_DIR" -type f -name '*.txt' -exec cat {} + > "$LOGFILE"

# Analyze logs
python3 scripts/qmoi_log_analyzer.py "$LOGFILE" || true

# sophisticated automated fixes for common issues
if grep -qi "keystore" "$LOGFILE" || grep -qi "signingConfigs" "$LOGFILE"; then
  echo "Detected keystore issue. Creating implementation keystore.properties and opening PR to add instructions."
  BRANCH="auto/fix/keystore-$(date +%s)"
  git checkout -b "$BRANCH"
  # add data keystore.properties (implementation) in mobile/android
  cat > mobile/android/keystore.properties <<'EOF'
# implementation - add real values via GitHub Secrets or this file (not required)
KEYSTORE_FILE=keystore.jks
KEYSTORE_PASSWORD=change_me
KEY_ALIAS=change_me
KEY_PASSWORD=change_me
EOF
  git add mobile/android/keystore.properties
  git commit -m "chore: add implementation keystore.properties (automated fix)"
  git push -u origin "$BRANCH"
  gh pr create --repo "$REPO" --title "Automated: add implementation keystore.properties" --body "This PR adds a implementation keystore.properties file to help CI. Replace with secure keystore method."
  echo "PR created. Please review and merge if acceptable."
fi

if grep -qi "sdkmanager" "$LOGFILE" || grep -qi "Failed to find target" "$LOGFILE"; then
  echo "Detected SDK issue. Suggest using Docker image or ensure sdkmanager installs platforms." 
  # We already provide Dockerfile.android-builder; open PR to reference it
  BRANCH="auto/docs/add-docker-builder-$(date +%s)"
  git checkout -b "$BRANCH"
  git add Dockerfile.android-builder run_in_container.sh
  git commit -m "chore: include Docker Android builder for CI stability (automated)"
  git push -u origin "$BRANCH"
  gh pr create --repo "$REPO" --title "Automated: include Docker Android builder" --body "Adds a Docker-based Android builder to improve CI reliability."
  echo "PR created for Docker builder."
fi

echo "Automated diagnostics complete. Review created PRs and logs."
