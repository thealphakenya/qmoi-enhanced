#!/usr/bin/env bash
set -Eeuo pipefail

MODE="${1:-light}"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

case "$MODE" in
  light)
    git config core.sparseCheckout true
    git config core.sparseCheckoutCone false
    git sparse-checkout set \
      '/*' \
      '!/qmoi-enhanced-history-14/**' \
      '!/Alpha-Q-ai/**' \
      '!/qmoi-enhanced-history-14/.venv/**' \
      '!/qmoi-enhanced-history-14/.venv_qmoi_control/**' \
      '!/qmoi-enhanced-history-14/node_modules/**' \
      '!/qmoi-enhanced-history-14/**/node_modules/**' \
      '!/qmoi-enhanced-history-14/**/.npm-cache/**' \
      '!/qmoi-enhanced-history-14/**/backups/**' \
      '!/qmoi-enhanced-history-14/**/.git/**'
    git config gc.auto 0
    git config fetch.writeCommitGraph true
    git config fetch.parallel 4
    git config remote.origin.promisor true
    git config remote.origin.partialclonefilter blob:none
    echo "Codespace light mode enabled. Historical material is available through Git history and on-demand staging."
    ;;
  full)
    git sparse-checkout disable
    git config --unset remote.origin.promisor 2>/dev/null || true
    git config --unset remote.origin.partialclonefilter 2>/dev/null || true
    git fetch --all --tags --prune
    echo "Full repository mode enabled. All tracked materialized paths are present."
    ;;
  audit)
    python scripts/merge_inventory.py \
      --qmoi "$ROOT" \
      --alpha "${ALPHA_REPOSITORY_PATH:-$ROOT/Alpha-Q-ai}" \
      --history "$ROOT/qmoi-enhanced-history-14" \
      --staging "${MERGE_STAGING_ROOT:-/tmp/qmoi-complete-merge-staging}" \
      --report "${MERGE_REPORT_PATH:-$ROOT/ollamatracks/complete_merge_report.json}"
    ;;
  *)
    echo "Usage: $0 [light|full|audit]" >&2
    exit 2
    ;;
esac
