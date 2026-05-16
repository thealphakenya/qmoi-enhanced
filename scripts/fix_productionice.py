#!/usr/bin/env python3
import os
import sys
from pathlib import Path
import io

ROOT = Path('/workspaces/qmoi-enhanced')
EXCLUDE_DIRS = {'.backups', '.git', 'node_modules', '.venv', '__pycache__'}
REPLACEMENTS = [
    ('devices', 'devices'),
    ('device', 'device'),
    ('', ''),
    ('', ''),
    ('', ''),
]

changed = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip excluded directories
    parts = Path(dirpath).parts
    if any(exc in parts for exc in EXCLUDE_DIRS):
        continue
    for fname in filenames:
        fpath = Path(dirpath) / fname
        # skip binary files heuristically by extension
        if fpath.suffix.lower() in {'.png', '.jpg', '.jpeg', '.gif', '.zip', '.tar', '.gz', '.exe', '.dll', '.so', '.db', '.bin'}:
            continue
        try:
            text = fpath.read_text(encoding='utf-8')
        except Exception:
            try:
                text = fpath.read_text(encoding='latin-1')
            except Exception:
                continue
        newtext = text
        for old, new in REPLACEMENTS:
            newtext = newtext.replace(old, new)
        if newtext != text:
            try:
                # write backup
                bak = fpath.with_suffix(fpath.suffix + '.bak')
                bak.write_text(text, encoding='utf-8')
                fpath.write_text(newtext, encoding='utf-8')
                changed.append(str(fpath.relative_to(ROOT)))
            except Exception as e:
                print('FAILED', fpath, e)

print('CHANGED_FILES_COUNT:', len(changed))
for p in changed:
    print(p)

if len(changed) == 0:
    print('No changes made.')
else:
    print('Done.')
