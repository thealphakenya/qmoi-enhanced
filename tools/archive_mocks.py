#!/usr/bin/env python3
"""Archive files that are high-confidence mocks: filenames containing __MOCKS__ or in __tests__/__mocks__.
Backs up originals under .backups/archive_mocks_<ts>/ and writes a short placeholder.
"""
import os, shutil, time
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backup_dir = os.path.join(root, '.backups', f'archive_mocks_{int(time.time())}')
archived = []
for dirpath, dirnames, filenames in os.walk(root):
    # skip .venv and node_modules and .backups
    if any(p in dirpath for p in ['/.venv/', '/node_modules/', '/.backups/']):
        continue
    for fname in filenames:
        if '__mocks__' in fname or '__MOCKS__' in fname or (dirpath.endswith('__tests__') and fname.startswith('__mocks__')):
            full = os.path.join(dirpath, fname)
            rel = os.path.relpath(full, root).replace('\\','/')
            bak = os.path.join(backup_dir, rel)
            os.makedirs(os.path.dirname(bak), exist_ok=True)
            shutil.copy2(full, bak)
            # write placeholder
            try:
                with open(full, 'w', encoding='utf-8') as fh:
                    fh.write('# ARCHIVED MOCK FILE\n')
                    fh.write('This mock file was archived and backed up to: {}\n'.format(os.path.relpath(bak, root)))
                archived.append(rel)
            except Exception:
                pass

report = os.path.join(root, 'reports', f'archived_mocks_{int(time.time())}.md')
os.makedirs(os.path.dirname(report), exist_ok=True)
with open(report, 'w', encoding='utf-8') as fh:
    fh.write('# Archived mock files\n\n')
    for a in archived:
        fh.write('- ' + a + '\n')

print('Archived', len(archived), 'mock files. Report:', report)
