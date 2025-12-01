#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "QMOI Dev Helper: checking environment"

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node and npm found — installing JS deps and starting dev server"
  # Run a quick compatibility check for ESM/CJS mismatches
  if [ -f scripts/check_node_compat.js ]; then
    echo "Running Node compat check (scripts/check_node_compat.js)"
    node scripts/check_node_compat.js || true
  fi
  export CI=${CI:-false}
  # Avoid breaking on peer deps for older lockfiles
  if npm ci --silent --legacy-peer-deps; then
    echo "npm ci completed successfully"
  else
    echo "npm ci failed — attempting npm install --legacy-peer-deps"
    npm install --legacy-peer-deps
  fi
  # Run the dev server (Next/Express/React). This is interactive; run in foreground
  echo "Starting Node dev server (foreground). Press Ctrl-C to stop."
  npm run dev
  exit 0
fi

if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
  echo "Node not found; Docker and docker-compose available — launching containers"
  docker-compose up --build
  exit 0
fi

echo "Neither Node nor Docker is installed or available."
echo "You can install Node >=18 (recommended) or use Docker (if available)."
echo "To run a Python-only dev environment, use:"
echo "  .venv/bin/python -m pip install -r requirements/server_requirements.txt -r requirements/betting_requirements.txt"
echo "  ./scripts/dev_supervisor.sh start"
exit 1
