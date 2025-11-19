#!/usr/bin/env bash
set -euo pipefail
# Minimal placeholder build script used by CI workflow.
# Replace build steps below with your real build commands for each platform.

PLATFORM="$1"
TAG="${2:-latest}"
OUTDIR="artifacts"
mkdir -p "$OUTDIR"

timestamp=$(date +%s)

case "$PLATFORM" in
  ubuntu-latest)
    fname="qmoi_linux_${TAG}_${timestamp}.AppImage"
    echo "Creating placeholder Linux AppImage: $fname"
    echo "QMOI Linux build - $TAG - $timestamp" > "$OUTDIR/$fname"
    ;;
  windows-latest)
    fname="qmoi_windows_${TAG}_${timestamp}.exe"
    echo "Creating placeholder Windows EXE: $fname"
    echo "QMOI Windows build - $TAG - $timestamp" > "$OUTDIR/$fname"
    ;;
  macos-latest)
    fname="qmoi_macos_${TAG}_${timestamp}.dmg"
    echo "Creating placeholder macOS DMG: $fname"
    echo "QMOI macOS build - $TAG - $timestamp" > "$OUTDIR/$fname"
    ;;
  *)
    fname="qmoi_generic_${TAG}_${timestamp}.zip"
    echo "Creating generic artifact: $fname"
    echo "QMOI generic build - $TAG - $timestamp" > "$OUTDIR/$fname"
    ;;
esac

echo "Built: $OUTDIR/$fname"
ls -la "$OUTDIR"
