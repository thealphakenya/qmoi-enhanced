#!/usr/bin/env python3
import os
from datetime import datetime, timezone
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
md_files = []
EXCLUDE_DIR_KEYWORDS = ['/.venv/', '/node_modules/', '/.git/', '/.backups/', '/backups/', '/__pycache__/', '/.pytest_cache/', '/.venv_qmoi_control/']

for dirpath, dirnames, filenames in os.walk(root):
    # normalize path for comparison
    norm = dirpath.replace('\\', '/')
    if any(ex in norm for ex in EXCLUDE_DIR_KEYWORDS):
        continue
    for f in filenames:
        if f.lower().endswith('.md'):
            full = os.path.join(dirpath, f)
            rel = os.path.relpath(full, root)
            md_files.append('./' + rel.replace('\\','/'))
md_files.sort()
out = []
out.append('# ALLMDFILESREFS.md')
out.append('Generated: ' + datetime.now(timezone.utc).isoformat())
out.append('Total markdown files: ' + str(len(md_files)))
out.append('\n'.join(md_files))
out.append('')
with open(os.path.join(root, 'ALLMDFILESREFS.md'), 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(out))
print('Wrote ALLMDFILESREFS.md with', len(md_files), 'entries')
