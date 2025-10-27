#!/usr/bin/env bash
set -euo pipefail
# Apply QMOI Lion low-bandwidth / offline-focused defaults in this codespace/devcontainer.
CONFIG_FILE=".lion/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Missing $CONFIG_FILE. Create it or run the generator." >&2
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  MAX_BW=$(jq -r '.max_bandwidth_kbps // 200' "$CONFIG_FILE")
  MAX_JOBS=$(jq -r '.max_parallel_jobs // 2' "$CONFIG_FILE")
  NPM_MAXSOCKETS=$(jq -r '.npm.maxsockets // 4' "$CONFIG_FILE")
else
  MAX_BW=200
  MAX_JOBS=2
  NPM_MAXSOCKETS=4
fi

echo "Applying Lion settings: bandwidth=${MAX_BW}kbps, parallel_jobs=${MAX_JOBS}"

# Limit Git LFS auto-downloads
export GIT_LFS_SKIP_SMUDGE=1
git config --local lfs.fetchexclude "*" || true
git config --local fetch.recurseSubmodules false || true
git config --local remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*" || true

# Reduce build parallelism and set Python thread limits
export MAKEFLAGS="-j${MAX_JOBS}"
export JOBS="${MAX_JOBS}"
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1
export OPENBLAS_NUM_THREADS=1
export NUMEXPR_NUM_THREADS=1

# npm low-parallel settings (local userconfig)
mkdir -p "$HOME/.npm"
npm set maxsockets "${NPM_MAXSOCKETS}" --userconfig "$HOME/.npmrc" >/dev/null 2>&1 || true

# pip cache dir
mkdir -p .cache/pip
export PIP_DOWNLOAD_CACHE=".cache/pip"

echo "Lion settings applied. You may need to restart the shell or Codespace to pick up env vars."
#!/usr/bin/env bash
set -euo pipefail

# Apply QMOI Lion low-bandwidth / offline-focused defaults in this codespace/devcontainer.
CONFIG_FILE=".lion/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Missing $CONFIG_FILE. Create it or run the generator." >&2
  exit 1
fi

# Read with jq when available, otherwise use sensible defaults
if command -v jq >/dev/null 2>&1; then
  MAX_BW=$(jq -r '.max_bandwidth_kbps // 200' "$CONFIG_FILE")
  MAX_JOBS=$(jq -r '.max_parallel_jobs // 2' "$CONFIG_FILE")
  LFS_SKIP=$(jq -r '.git.lfs_skip_smudge // true' "$CONFIG_FILE")
  NPM_MAXSOCKETS=$(jq -r '.npm.maxsockets // 4' "$CONFIG_FILE")
else
  MAX_BW=200
  MAX_JOBS=2
  LFS_SKIP=true
  NPM_MAXSOCKETS=4
fi

echo "Applying Lion settings: bandwidth=${MAX_BW}kbps, parallel_jobs=${MAX_JOBS}"

# Limit Git LFS auto-downloads (best-effort local config)
export GIT_LFS_SKIP_SMUDGE=1
git config --local lfs.fetchexclude "*" || true
git config --local fetch.recurseSubmodules false || true
git config --local remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*" || true

# Reduce build parallelism and set Python thread limits
export MAKEFLAGS="-j${MAX_JOBS}"
export JOBS="${MAX_JOBS}"
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1
export OPENBLAS_NUM_THREADS=1
export NUMEXPR_NUM_THREADS=1

# npm low-parallel settings (local .npmrc)
mkdir -p .npmrc.d
npm set maxsockets "${NPM_MAXSOCKETS}" --userconfig .npmrc || true

# pip cache dir
mkdir -p .cache/pip
export PIP_DOWNLOAD_CACHE=".cache/pip"

# Best-effort: prevent common tools from auto-updating or checking network
export APT_LISTCHANGES_FRONTEND=none || true

echo "Lion settings applied (environment variables exported in this shell)."
echo "Note: restart shells or Codespace to pick up some settings; run scripts/lion_scan_and_cache.py to build docs cache." 
