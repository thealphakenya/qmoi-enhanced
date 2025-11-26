#!/usr/bin/env python3
"""
Split matches.json by component and use tools/auto_fix_placeholders.py to create component patches.
Run this script from repository root: python3 tools/create_component_patches.py
"""
from pathlib import Path
import json
import subprocess
import re

ROOT = Path('.').resolve()
MATCHES = ROOT / 'matches.json'
TOOLS = ROOT / 'tools'
PATCH_DIR = TOOLS / 'patches'
PATCH_DIR.mkdir(parents=True, exist_ok=True)

if not MATCHES.exists():
    print('matches.json not found. Run tools/find_placeholders.py first.')
    exit(1)

matches = json.loads(MATCHES.read_text(encoding='utf-8'))

# Heuristic for component key
# - app/api/<module> -> app/api/<module>
# - qmoi-enhanced/app/api/<module> -> qmoi-enhanced/app/api/<module>
# - src/services/<service> -> src/services/<service>
# - scripts/<script> -> scripts/<first_dir>
# - else: top-level folder

def component_key(filepath):
    parts = [p for p in re.split(r"/|\\\\", filepath) if p]
    if len(parts) >= 3 and parts[0] == 'app' and parts[1] == 'api':
        return 'app/api/' + parts[2]
    if len(parts) >= 4 and parts[0] == 'qmoi-enhanced' and parts[1] == 'app' and parts[2] == 'api':
        return 'qmoi-enhanced/app/api/' + parts[3]
    if len(parts) >= 3 and parts[0] == 'src' and parts[1] == 'services':
        return 'src/services/' + parts[2]
    if len(parts) >= 2 and parts[0] == 'scripts':
        return 'scripts/' + parts[1]
    if len(parts) >= 2:
        return parts[0] + '/' + (parts[1] if len(parts)>1 else '')
    return parts[0]

by_component = {}
for m in matches:
    key = component_key(m['file'])
    by_component.setdefault(key, []).append(m)

print('Found', len(by_component), 'components with TBD matches')

# We'll generate patches for the top N components by match count
components_sorted = sorted(by_component.items(), key=lambda kv: len(kv[1]), reverse=True)

# Limit to top components to avoid huge patches in one run
TOP_N = 10
for key, entries in components_sorted[:TOP_N]:
    print('Processing component', key, 'matches:', len(entries))
    tmp_matches = ROOT / f'matches_{key.replace("/","_")}.json'
    tmp_matches.write_text(json.dumps(entries, indent=2), encoding='utf-8')
    # back up original MATCHES (if any)
    original_matches = MATCHES.with_suffix('.backup.json')
    if MATCHES.exists():
        MATCHES.rename(original_matches)
    tmp_matches.rename(MATCHES)
    # run auto-fix script to produce placeholder_fixes.patch
    try:
        result = subprocess.run(['python3', str(TOOLS / 'auto_fix_placeholders.py')], check=True, capture_output=True, text=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print('auto_fix_placeholders failed for', key, e)
    # move patch to component patch
    patch_src = ROOT / 'placeholder_fixes.patch'
    if patch_src.exists():
        patch_dst = PATCH_DIR / f'placeholder_fixes_{key.replace('/','_')}.patch'
        patch_src.rename(patch_dst)
        print('Wrote', patch_dst)
    else:
        print('No patch generated for', key)
    # restore original matches
    if original_matches.exists():
        original_matches.rename(MATCHES)
    if tmp_matches.exists():
        tmp_matches.unlink()

print('Done creating component patches (top', TOP_N, 'components)')
