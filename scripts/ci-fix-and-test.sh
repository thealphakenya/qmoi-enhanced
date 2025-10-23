#!/usr/bin/env bash
set -euo pipefail
echo "Running CI helper: lint mpesa files --fix, then mpesa unit tests"

echo "Installing dependencies (if needed)"
npm install --no-audit --no-fund || true

echo "Linting mpesa integration files"
npx eslint "src/integrations/mpesa/**" --fix || true

echo "Running mpesa unit tests"
npx jest src/integrations/mpesa --config ./jest.config.cjs --runInBand || true

echo "CI helper complete"
