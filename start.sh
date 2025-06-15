#! /bin/bash
set -e

echo "🔧 Verifying lockfile and installing deps..."
pnpm install --frozen-lockfile --prefer-offline

echo "🔍 Type checking and linting..."
pnpm lint --fix
pnpm tsc --noEmit

echo "🚀 Starting dev server..."
pnpm dev
