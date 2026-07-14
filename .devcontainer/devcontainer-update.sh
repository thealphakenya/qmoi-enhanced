#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="${LOG_DIR:-$HOME/.cache/qmoi-devcontainer}"
LOG_FILE="$LOG_DIR/devcontainer-update.log"
mkdir -p "$LOG_DIR"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "🔄 QMOI devcontainer update"
echo "Repository: $REPO_ROOT"

echo "Update started: $(date)"

cd "$REPO_ROOT"

if command -v npm >/dev/null 2>&1; then
  if [ -f package.json ]; then
    if [ -f package-lock.json ]; then
      echo "Installing Node dependencies with npm ci"
      npm ci --no-audit --no-fund || true
    elif [ -d node_modules ]; then
      echo "Refreshing existing Node dependencies"
      npm install --no-audit --no-fund || true
    else
      echo "Installing Node dependencies with npm install"
      npm install --no-audit --no-fund || true
    fi

    if npm run | grep -q 'type-check'; then
      echo "Running type check"
      npm run type-check || true
    fi

    if npm run | grep -q 'lint'; then
      echo "Running linter"
      npm run lint || true
    fi

    if npm run | grep -q 'test'; then
      echo "Running tests"
      npm run test || true
    fi
  else
    echo "No package.json found; skipping Node dependency update"
  fi
else
  echo "npm not available in this shell; skipping dependency updates"
fi

echo "Update completed: $(date)"
echo "Devcontainer update log: $LOG_FILE"
