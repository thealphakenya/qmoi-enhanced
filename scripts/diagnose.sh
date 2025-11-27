#!/usr/bin/env bash
set -euo pipefail

echo "Running QMOI-Enhanced diagnostics"

if ! command -v node >/dev/null 2>&1; then
  echo "node not found. Please install Node 18+ and npm before running this script." >&2
  exit 2
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Please install npm." >&2
  exit 2
fi

echo "Installing dependencies (this may take a while)..."
npm install

echo "Running TypeScript type-check..."
npx tsc --noEmit

echo "Type-check finished. If there are errors, paste output to the maintainer for fixes."

echo "You can run 'npm run build' to run next build or run CI in GitHub Actions."
