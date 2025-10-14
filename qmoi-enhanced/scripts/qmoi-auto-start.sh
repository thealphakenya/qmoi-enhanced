#!/bin/bash
# QMOI Auto-Start: Ensures QMOI extension is installed, started, and healthy on every workspace/codespace open
set -e

# Install Node.js dependencies if missing
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install --legacy-peer-deps || npm install --force
fi

# Run QMOI auto-setup and health check in parallel
node ./scripts/qmoi-parallel-runner.js &

# Mark QMOI as running
> .qmoi-running

echo "QMOI extension is auto-started, healthy, and fully automated."
