#! /bin/bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
LOG_FILE="./start.log"

log() {
  echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

header() {
  echo -e "\n===================================================="
  echo -e "$1"
  echo -e "====================================================\n"
}

# Start logging
> "$LOG_FILE"

log "🔁 Running $SCRIPT_NAME"

# ------------------------------------------------------------------------------
# 1. Install dependencies
# ------------------------------------------------------------------------------
header "🔧 Verifying lockfile and installing dependencies..."
log "Running: pnpm install --frozen-lockfile --prefer-offline"
pnpm install --frozen-lockfile --prefer-offline

# ------------------------------------------------------------------------------
# 2. Lint
# ------------------------------------------------------------------------------
header "🔍 Linting codebase..."
log "Running: pnpm lint --fix"
pnpm lint --fix

# ------------------------------------------------------------------------------
# 3. Type Check
# ------------------------------------------------------------------------------
header "🔤 Type-Checking with TypeScript..."
log "Running: pnpm tsc --noEmit"

if ! pnpm tsc --noEmit; then
  echo "Type-Checking failed. Please address the above errors before proceeding."
  exit 1
fi

# ------------------------------------------------------------------------------
# 4. Start Development Server
# ------------------------------------------------------------------------------
header "🚀 Starting development server..."
log "Running: pnpm dev"

pnpm dev
