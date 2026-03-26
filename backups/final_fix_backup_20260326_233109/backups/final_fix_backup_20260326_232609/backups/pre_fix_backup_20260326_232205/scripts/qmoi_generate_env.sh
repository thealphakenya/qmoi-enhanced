#!/usr/bin/env bash
# // Production implementation:
# qmoi_generate_env.sh
# Generate a .env file from config/qmoi_env_vars.json defaults and current environment
# Usage: ./qmoi_generate_env.sh [--force]
set -euo pipefail
FORCE=0
if [ "${1-}" == "--force" ]; then FORCE=1; fi
OUT_FILE=.env
CONFIG_FILE=config/qmoi_env_vars.json

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Config file $CONFIG_FILE not found. Aborting."
  exit 1
fi

python3 - <<'PY'
import json,os,sys
cfg=json.load(open('config/qmoi_env_vars.json'))
out={}
for k,v in cfg.items():
    default=v.get('default') if isinstance(v,dict) else None
    val=os.environ.get(k, default)
    if val is None:
        # leave empty implementation
        val=''
    out[k]=val
# write .env file
if os.path.exists('.env') and os.environ.get('QM_FORCE_ENV')!='1':
    print('.env exists. Use QM_FORCE_ENV=1 or pass --force to overwrite.')
    sys.exit(0)
with open('.env','w') as f:
    for k,v in out.items():
        f.write(f"{k}='{v}'\n")
print('Generated .env with keys:', ','.join(out.keys()))
PY
