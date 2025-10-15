#!/usr/bin/env bash
# Simple wrapper for scripts/push_all.py
set -euo pipefail

PY=python3
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  echo "Usage: $0 [--skip-backup] [--force] [--message \"text\"]"
  exit 1
}

SKIP_BACKUP=""
FORCE=""
MSG="workspace sync"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-backup) SKIP_BACKUP="--skip-backup"; shift ;;
    --force) FORCE="--force"; shift ;;
    --message) MSG="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

exec "$PY" "$SCRIPT_DIR/push_all.py" $SKIP_BACKUP $FORCE --message "$MSG"
#!/usr/bin/env bash
# Wrapper for scripts/push_all.py
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${SCRIPT_DIR}/.."
PYTHON="$(command -v python3 || command -v python)"

usage() {
  echo "Usage: $0 [--skip-backup] [--force] [--message 'summary']"
  exit 1
}

SKIP_BACKUP=""
FORCE=""
MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-backup) SKIP_BACKUP=1; shift ;;
    --force) FORCE=1; shift ;;
    --message) MSG="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

CMD="$PYTHON ${ROOT}/scripts/push_all.py"
[[ -n "$SKIP_BACKUP" ]] && CMD="$CMD --skip-backup"
[[ -n "$FORCE" ]] && CMD="$CMD --force"
[[ -n "$MSG" ]] && CMD="$CMD --message \"$MSG\""

echo "Running: $CMD"
eval "$CMD"
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
