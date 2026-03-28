#!/bin/bash
# Wrapper to centralized build script in scripts/build/
set -euo pipefail
SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
bash "$SCRIPT_DIR/build/$SCRIPT_NAME" "$@"
