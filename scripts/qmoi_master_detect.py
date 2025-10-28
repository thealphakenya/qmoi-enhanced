#!/usr/bin/env python3
"""Detect whether this workspace is the master's workspace and record master identity.

Writes .qmoi/master.json with owner, detected_remote and is_master boolean.
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.qmoi' / 'master.json'
OUT.parent.mkdir(parents=True, exist_ok=True)

def get_git_remote():
    try:
        out = subprocess.check_output(['git','config','--get','remote.origin.url'], cwd=str(ROOT), stderr=subprocess.DEVNULL)
        return out.decode().strip()
    except Exception:
        return None

def detect_master():
    remote = get_git_remote()
    owner = 'thealphakenya'
    is_master = False
    if remote and owner in remote:
        is_master = True
    data = {
        'owner': owner,
        'detected_remote': remote,
        'is_master': is_master
    }
    OUT.write_text(json.dumps(data, indent=2))
    print('Wrote', OUT)
    return data

if __name__ == '__main__':
    d = detect_master()
    if not d['is_master']:
        print('Not running in master workspace (owner mismatch). Exiting with code 0 — safe mode.')
    sys.exit(0)
