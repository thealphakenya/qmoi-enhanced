#!/bin/bash
set -euo pipefail

# Rebuild helper: detects musl vs glibc and recommends devcontainer rebuild
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Checking libc type in container..."
if ldd --version 2>&1 | head -n1 | grep -qi musl; then
  echo "Detected musl libc (Alpine). Ollama requires glibc; please rebuild the devcontainer from .devcontainer/Dockerfile."
  echo "Suggested change: ensure .devcontainer/Dockerfile uses a glibc base such as mcr.microsoft.com/devcontainers/base:bullseye and rebuild the container."
  if [ -x "$REPO_ROOT/.devcontainer/update-resume.sh" ]; then
    bash "$REPO_ROOT/.devcontainer/update-resume.sh" "rebuild-advice: musl detected; recommend switching devcontainer to glibc base and rebuilding" || true
  fi
  exit 2
else
  echo "glibc detected — proceeding to run verification script"
fi

echo "Running .devcontainer/check-glibc.sh now..."
bash "$REPO_ROOT/.devcontainer/check-glibc.sh"

echo "Running .devcontainer/verify-ollama.sh now..."
bash "$REPO_ROOT/.devcontainer/verify-ollama.sh"

echo "Verification complete. Check resumefromhere.txt for status." 
exit 0
