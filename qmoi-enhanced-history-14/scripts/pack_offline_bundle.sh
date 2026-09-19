#!/usr/bin/env bash
# Create a self-contained offline bundle of PWAs and server code
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT_DIR/offline_bundle"
rm -rf "$OUT"
mkdir -p "$OUT/pwa_apps"
# Copy PWAs and downloads
rsync -a --exclude='.git' --exclude='node_modules' "$ROOT_DIR/pwa_apps/" "$OUT/pwa_apps/"
mkdir -p "$OUT/server"
rsync -a --exclude='.git' --exclude='__pycache__' "$ROOT_DIR/qmoi_control_server.py" "$OUT/server/"
rsync -a --exclude='.git' "$ROOT_DIR/payments" "$OUT/server/"
cp "$ROOT_DIR/requirements.txt" "$OUT/server/" || true
echo "Offline bundle created at $OUT"
