#!/usr/bin/env bash
# scripts/push_all.sh
# Wrapper for the Python push helper. Usage:
#   ./scripts/push_all.sh            -> backup, commit (auto message) and push to current branch
#   ./scripts/push_all.sh --no-backup
#   ./scripts/push_all.sh --force

set -euo pipefail
SCRIPT_DIR=$(dirname "${BASH_SOURCE[0]}")
PY=${PY:-python3}

ARGS=()
for arg in "$@"; do
  case "$arg" in
    --no-backup) ARGS+=("--no-backup") ;;
    --force) ARGS+=("--force") ;;
    --branch=*) ARGS+=("$arg") ;;
    --message=*) ARGS+=("$arg") ;;
    *) echo "Unknown arg: $arg"; exit 1 ;;
  esac
done

$PY "$SCRIPT_DIR/push_all_changes.py" "${ARGS[@]}"
