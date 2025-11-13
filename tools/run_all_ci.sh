#!/usr/bin/env bash
# Orchestrator script to run workflows locally via gh CLI.
# Requires: gh (GitHub CLI) authenticated with repo access, jq
# Usage: ./tools/run_all_ci.sh [branch]

set -euo pipefail
BRANCH=${1:-feature/ci-verify-and-release}
REPO="thealphakenya/qmoi-enhanced"

function run_workflow() {
  wf=$1
  echo "Dispatching workflow: $wf on branch $BRANCH"
  gh workflow run "$wf" --repo "$REPO" --ref "$BRANCH"
}

function wait_run() {
  wf=$1
  echo "Waiting for latest run of $wf to complete..."
  sleep 3
  runid=$(gh run list --workflow="$wf" --repo "$REPO" --limit 1 --json databaseId --jq '.[0].databaseId')
  if [ -z "$runid" ] || [ "$runid" = "null" ]; then
    echo "No run found for $wf"
    return 1
  fi
  gh run watch "$runid" --repo "$REPO"
}

echo "1) Run PWA Deploy and Smoke Tests"
run_workflow pwa-deploy-and-test.yml
sleep 2
wait_run pwa-deploy-and-test.yml || true

echo "2) Run Packaging Gate"
run_workflow packaging-gate.yml
sleep 2
wait_run packaging-gate.yml || true

echo "3) If packaging gate found secrets, run packaging workflows (manual step)"
read -p "Run packaged builds now? (y/N) " runpack
if [ "$runpack" = "y" ]; then
  run_workflow package-electron.yml
  sleep 2
  wait_run package-electron.yml || true
  run_workflow package-mobile.yml
  sleep 2
  wait_run package-mobile.yml || true
fi

echo "4) Trigger draft release publish by tagging"
read -p "Create draft tag and push? (y/N) " runtag
if [ "$runtag" = "y" ]; then
  tag="v0.0.1-auto-$(date -u +%Y%m%d%H%M%S)"
  git tag -a "$tag" -m "Auto draft release trigger"
  git push origin "$tag"
fi

echo "Done. Check Actions and Releases on GitHub for results."
#!/usr/bin/env bash
# Orchestrator script to run workflows locally via gh CLI.
# Requires: gh (GitHub CLI) authenticated with repo access, jq
# Usage: ./tools/run_all_ci.sh [branch]

set -euo pipefail
BRANCH=${1:-feature/ci-verify-and-release}
REPO="thealphakenya/qmoi-enhanced"

function run_workflow() {
  wf=$1
  echo "Dispatching workflow: $wf on branch $BRANCH"
  gh workflow run "$wf" --repo "$REPO" --ref "$BRANCH"
}

function wait_run() {
  wf=$1
  echo "Waiting for latest run of $wf to complete..."
  sleep 3
  # find last run id
  runid=$(gh run list --workflow="$wf" --repo "$REPO" --limit 1 --json databaseId --jq '.[0].databaseId')
  if [ -z "$runid" ] || [ "$runid" = "null" ]; then
    echo "No run found for $wf"
    return 1
  fi
  gh run watch "$runid" --repo "$REPO"
}

echo "1) Run PWA Deploy and Smoke Tests"
run_workflow pwa-deploy-and-test.yml
sleep 2
wait_run pwa-deploy-and-test.yml || true

echo "2) Run Packaging Gate"
run_workflow packaging-gate.yml
sleep 2
wait_run packaging-gate.yml || true

echo "3) If packaging gate found secrets, run packaging workflows (manual step)"
read -p "Run packaged builds now? (y/N) " runpack
if [ "$runpack" = "y" ]; then
  run_workflow package-electron.yml
  sleep 2
  wait_run package-electron.yml || true
  run_workflow package-mobile.yml
  sleep 2
  wait_run package-mobile.yml || true
fi

echo "4) Trigger draft release publish by tagging"
read -p "Create draft tag and push? (y/N) " runtag
if [ "$runtag" = "y" ]; then
  tag="v0.0.1-auto-$(date -u +%Y%m%d%H%M%S)"
  git tag -a "$tag" -m "Auto draft release trigger"
  git push origin "$tag"
fi

echo "Done. Check Actions and Releases on GitHub for results."
