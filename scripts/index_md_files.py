#!/usr/bin/env python3
"""Scan repository for .md files and generate ALLMDFILESREFS.md with headings and first paragraph excerpts."""
from pathlib import Path
import re
ROOT = Path('.')
out = []
IGNORED = ['node_modules', '.git', 'qmoi-enhanced/mobile/node_mod', 'qmoi-enhanced/qmoi-enhanced/mobile/node_mod']
for p in sorted(ROOT.rglob('*.md')):
    # skip vendor and heavy folders
    if any(ig in p.parts for ig in IGNORED):
        continue
    rel = p.relative_to(ROOT)
    text = p.read_text(encoding='utf-8', errors='ignore')
    m = re.search(r'^#\s*(.+)$', text, re.M)
    title = m.group(1).strip() if m else rel.name
    first_para = ''
    for line in text.splitlines():
        if line.strip():
            first_para = line.strip()
            break
    out.append((str(rel), title, first_para))

lines = ['# ALL Markdown Files Reference\n']
for path, title, para in out:
    lines.append(f'## {title}\n')
    lines.append(f'- Path: `{path}`\n')
    lines.append(f'- Excerpt: {para}\n')

Path('ALLMDFILESREFS.md').write_text('\n'.join(lines) + '\n')
print('Wrote ALLMDFILESREFS.md')
