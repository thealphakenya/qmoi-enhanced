#!/usr/bin/env bash
# Helper to initialize repo-local git settings to avoid common CI/dev issues
# Usage: bash tools/git_safe_init.sh

set -euo pipefail

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [ -z "$ROOT" ]; then
  echo "Not in a git repository. Run this from the repo root."
  exit 1
fi

echo "Setting repository hooks path to '.githooks'"
git config core.hooksPath .githooks

echo "Disabling automatic GPG commit signing locally to avoid CI/GPG agent failures"
git config commit.gpgsign false

echo "Safe init complete. To enable hooks for other clones, run: git config core.hooksPath .githooks"
