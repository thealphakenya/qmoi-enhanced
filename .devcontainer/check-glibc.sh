#!/bin/bash
set -euo pipefail

if command -v ldd >/dev/null 2>&1 && ldd --version 2>&1 | grep -qi musl; then
  if [ -f /etc/alpine-release ]; then
    echo "Alpine Linux detected. Ollama source build fallback is supported on this host."
    echo "If Ollama is not installed, the repository will attempt to build it from source."
    exit 0
  fi
  echo "ERROR: musl libc detected on a non-Alpine host. Ollama requires either a glibc environment or Alpine source build support."
  echo "       Use a Debian/Ubuntu container or run this on Alpine with the Ollama source build path."
  exit 1
fi

echo "glibc environment confirmed."
exit 0
