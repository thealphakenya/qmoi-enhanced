#!/usr/bin/env bash
# Ensure .qmoi/config.json prefers zero-rated endpoints and local-only operation when possible.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CFG="$ROOT/.qmoi/config.json"
BACKUP="$CFG.bak"
if [ -f "$CFG" ]; then
  cp "$CFG" "$BACKUP"
fi
python3 - <<PY
import json,sys,os
cfgpath = r"${ROOT}/.qmoi/config.json"
with open(cfgpath,'r',encoding='utf-8') as f:
    cfg = json.load(f)
cfg.setdefault('zero_rating',{})
cfg['zero_rating'].setdefault('prefer_zero_rated', True)
cfg['prefer_local'] = True
# When running inside master workspace prefer local-only to avoid data bundles
try:
    rem = os.popen('git config --get remote.origin.url').read().strip()
    if 'thealphakenya' in rem:
        cfg['local_only'] = True
except Exception:
    pass
with open(cfgpath,'w',encoding='utf-8') as f:
    json.dump(cfg,f,indent=2)
print('Updated',cfgpath)
PY
echo "Zero-rating preferences applied (backup at $BACKUP if existed)."
