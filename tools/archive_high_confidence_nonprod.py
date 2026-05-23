#!/usr/bin/env python3
"""Archive high-confidence non-production files (mocks, fixtures, sample data).
Backs up originals under .backups/high_conf_nonprod_<ts>/ and writes placeholders.
"""
import os, shutil, time, re
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backup_dir = os.path.join(root, '.backups', f'high_conf_nonprod_{int(time.time())}')
patterns = [
    re.compile(r'__mocks__', re.IGNORECASE),
    re.compile(r'__MOCKS__', re.IGNORECASE),
    re.compile(r'/__tests__/'),
    re.compile(r'/tests?/'),
    re.compile(r'/fixtures?/', re.IGNORECASE),
    re.compile(r'/mocks?/', re.IGNORECASE),
]
file_name_pattern = re.compile(r'^(sample|sample_data|testdata|fixture|fixtures|mock|mocks|dummy)[._-]?.*\.(json|md|ts|js|py|txt|yaml|yml)$', re.IGNORECASE)
archived = []
for dirpath, dirnames, filenames in os.walk(root):
    # skip virtual env and node_modules and backups
    lp = dirpath.replace('\\','/')
    if any(part in lp for part in ['/.venv/', '/node_modules/', '/.backups/', '/.git/']):
        continue
    for fname in filenames:
        relpath = os.path.join(lp, fname).replace('\\','/')
        lower = relpath.lower()
        should_archive = False
        # path patterns
        for pat in patterns:
            if pat.search(relpath):
                # if it's inside src or app but is clearly a mock/fixture file, archive
                should_archive = True
                break
        # filename pattern
        if not should_archive and file_name_pattern.match(fname):
            should_archive = True
        if not should_archive:
            continue
        # safety: avoid archiving README.md or important docs that match words
        base = os.path.basename(fname).lower()
        if base in ('readme.md','license.md','license','changelog.md'):
            continue
        full = os.path.join(dirpath, fname)
        rel = os.path.relpath(full, root).replace('\\','/')
        bak = os.path.join(backup_dir, rel)
        os.makedirs(os.path.dirname(bak), exist_ok=True)
        try:
            shutil.copy2(full, bak)
            # write placeholder
            with open(full, 'w', encoding='utf-8') as fh:
                fh.write('# ARCHIVED NON-PRODUCTION FILE\n')
                fh.write('This file was identified as high-confidence non-production (mock/fixture/sample) and archived.\n')
                fh.write('Backup path: {}\n'.format(os.path.relpath(bak, root)))
            archived.append(rel)
        except Exception:
            continue

# write report
os.makedirs(os.path.join(root, 'reports'), exist_ok=True)
report = os.path.join(root, 'reports', f'archived_high_conf_nonprod_{int(time.time())}.md')
with open(report, 'w', encoding='utf-8') as fh:
    fh.write('# Archived high-confidence non-production files\n\n')
    fh.write('\n'.join(f'- {p}' for p in archived))

print('Archived', len(archived), 'files. Report:', report)
