#!/usr/bin/env bash
set -eu
# Register local QMOI manifest for Capilot/local tools.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CAP_DIR="$ROOT/.capilot/models"
mkdir -p "$CAP_DIR"
cp "$ROOT/qmoi-model-manifest.json" "$CAP_DIR/qmoi-model-manifest.json"
echo "QMOI manifest copied to $CAP_DIR/qmoi-model-manifest.json"
echo "You can also point Capilot to: http://localhost:8765/manifest"
