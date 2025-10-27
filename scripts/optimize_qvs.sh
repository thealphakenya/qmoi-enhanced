#!/usr/bin/env bash
set -eu
# Apply low-bandwidth, limited-parallel settings to .lion/config.json and env
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LION_CFG="$ROOT/.lion/config.json"
mkdir -p "$(dirname "$LION_CFG")"
cat > "$LION_CFG" <<'JSON'
{
  "offline_mode": true,
  "max_bandwidth_kbps": 200,
  "max_parallel_jobs": 2,
  "disable_auto_updates": true,
  "cache_paths": ["docs_cache", "vendor"],
  "git": { "lfs_skip_smudge": true },
  "npm": { "maxsockets": 4 },
  "pip": { "find_links": "./vendor/wheels" }
}
JSON

export MAKEFLAGS='-j2'
export JOBS=2
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1
export OPENBLAS_NUM_THREADS=1
export NUMEXPR_NUM_THREADS=1
export GIT_LFS_SKIP_SMUDGE=1
echo "Applied low-bandwidth QVS/parallel settings to $LION_CFG and exported environment limits"
