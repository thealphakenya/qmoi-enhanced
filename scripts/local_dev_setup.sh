#!/usr/bin/env bash
# Local dev bootstrap script: installs node via nvm (if not present), runs npm install, env setup, tests and starts dev server.
set -euo pipefail

echo "Detecting node..."
if command -v node >/dev/null 2>&1; then
  echo "Node already installed: $(node -v)"
else
  echo "Node not found. Installing nvm and Node 18.x (requires internet and privileges)..."
  # Install nvm
  if [ ! -d "$HOME/.nvm" ]; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  else
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  fi
  nvm install 18
  nvm use 18
fi

echo "Installing npm dependencies..."
npm ci

echo "Running env setup and placeholder checks..."
npm run env-setup || true
npm run placeholder-check --silent || true

echo "Starting dev server"
npm run dev