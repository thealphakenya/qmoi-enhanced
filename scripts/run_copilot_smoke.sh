#!/usr/bin/env bash
set -euo pipefail

echo "Local Copilot smoke test"

if command -v node >/dev/null 2>&1; then
  echo "node: $(node --version)"
else
  echo "node not found"
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm: $(npm --version)"
else
  echo "npm not found"
fi

if command -v copilot >/dev/null 2>&1; then
  echo "copilot: $(copilot --version)"
  copilot --help || true
else
  echo "copilot not found. To install locally run: npm install -g @githubnext/copilot-cli"
fi

echo "Listing a few repo checks"
git status --porcelain --branch | sed -n '1,200p'

echo "Done"
