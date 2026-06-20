#!/usr/bin/env python3
"""
Scan markdown files and add/update a YAML frontmatter `quantum-enabled` flag.
Heuristic: set true if filename or content contains 'quantum' or filename/path contains 'auto'.
Writes a report to `reports/quantum_metadata_propagation.log`.
"""
import os
import io
from pathlib import Path

ROOT = Path('.').resolve()
SKIP_DIRS = {'.git', '.venv', 'node_modules', '.backups', 'var/daemon', 'var/quantum_jobs', 'reports'}
REPORT_DIR = ROOT / 'reports'
REPORT_DIR.mkdir(exist_ok=True)
LOG_PATH = REPORT_DIR / 'quantum_metadata_propagation.log'

changed = []
scanned = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # filter dirs
    parts = set(Path(dirpath).parts)
    if parts & SKIP_DIRS:
        continue
    for fname in filenames:
        if not fname.lower().endswith('.md'):
            continue
        scanned += 1
        fpath = Path(dirpath) / fname
        try:
            text = fpath.read_text(encoding='utf-8')
        except Exception:
            continue
        low = text.lower()
        flag = False
        if 'quantum' in fname.lower() or 'quantum' in low:
            flag = True
        if 'auto' in fname.lower() or '/auto' in str(fpath).lower():
            flag = True
        # check existing frontmatter
        newtext = text
        if text.lstrip().startswith('---'):
            # find end of frontmatter
            try:
                parts = text.split('---', 2)
                if len(parts) >= 3:
                    fm = parts[1]
                    rest = parts[2]
                    if 'quantum-enabled' in fm:
                        # already present: skip
                        continue
                    # insert flag into existing frontmatter
                    new_fm = fm.strip() + '\nquantum-enabled: %s\n' % ('true' if flag else 'false')
                    newtext = '---\n' + new_fm + '\n---' + rest
                else:
                    # malformed, prepend
                    newtext = '---\nquantum-enabled: %s\n---\n\n' % ('true' if flag else 'false') + text
            except Exception:
                newtext = '---\nquantum-enabled: %s\n---\n\n' % ('true' if flag else 'false') + text
        else:
            # prepend frontmatter
            newtext = '---\nquantum-enabled: %s\n---\n\n' % ('true' if flag else 'false') + text
        if newtext != text:
            try:
                fpath.write_text(newtext, encoding='utf-8')
                changed.append({'path': str(fpath), 'quantum-enabled': flag})
            except Exception as e:
                print('Failed to write', fpath, e)

# write report
with LOG_PATH.open('w', encoding='utf-8') as fh:
    import json
    json.dump({'scanned': scanned, 'changed_count': len(changed), 'changes': changed}, fh, indent=2)

print('Scanned', scanned, 'markdown files; updated', len(changed), 'files; report:', LOG_PATH)
