#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Checking Python environment and key packages for qmoiexe"

python3 --version || { echo "python3 not found"; exit 1; }

check_pkg(){
  pkg=$1
  python3 - <<PY
import importlib, sys
try:
    importlib.import_module('$pkg')
    print('OK: $pkg')
except Exception as e:
    print('MISSING: $pkg')
    sys.exit(2)
PY
}

check_pkg fastapi || true
check_pkg uvicorn || true
check_pkg PIL || true

echo "To install missing packages:"
echo "  python3 -m pip install -r requirements.txt"

exit 0
