#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting dev environment for QMOI..."

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are available. Starting web and dashboard locally."
  # Start dashboard
  (python3 scripts/serve_dashboard.py &) || true
  # Start the Next.js app
  npm ci
  npm run dev
else
  if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
    echo "Node/npm not found; Docker and docker-compose found. Starting services via Docker Compose..."
    docker-compose up --build
  else
    echo "Neither Node/npm nor Docker+docker-compose found. Please install one of these to run the full stack locally."
    echo "Alternatively, activate the virtualenv and run 'python3 scripts/run_betting_once.py' and 'python3 scripts/serve_dashboard.py' to test python components only."
    exit 1
  fi
fi
