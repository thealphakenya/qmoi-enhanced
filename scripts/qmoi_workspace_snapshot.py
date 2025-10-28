#!/usr/bin/env python3
"""Create a lightweight workspace snapshot for QMOI to understand the project.

Writes `.qmoi/workspace_snapshot.json` containing a list of top-level files,
counts by extension, and a short list of largest files (names + sizes).

Excludes node_modules, .git, vendor, build artefacts by default.
"""
import os
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
QM_DIR = ROOT / '.qmoi'
QM_DIR.mkdir(exist_ok=True)
OUT = QM_DIR / 'workspace_snapshot.json'

EXCLUDE = {'node_modules', '.git', 'vendor', 'dist', 'build', '__pycache__'}
MAX_FILES = 5000

def snapshot(root=ROOT):
    files = []
    ext_counts = {}
    for dirpath, dirnames, filenames in os.walk(root):
        # skip excludes
        parts = set(Path(dirpath).parts)
        if parts & EXCLUDE:
            continue
        for fn in filenames:
            fp = Path(dirpath) / fn
            try:
                size = fp.stat().st_size
            except Exception:
                continue
            rel = fp.relative_to(ROOT).as_posix()
            files.append({'path': rel, 'size': size})
            ext = fp.suffix.lower() or '<noext>'
            ext_counts[ext] = ext_counts.get(ext, 0) + 1
            if len(files) >= MAX_FILES:
                break
        if len(files) >= MAX_FILES:
            break

    # largest files
    largest = sorted(files, key=lambda x: x['size'], reverse=True)[:50]

    out = {
        'generated_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
        'file_count': len(files),
        'ext_counts': ext_counts,
        'largest_files': largest[:20]
    }
    OUT.write_text(json.dumps(out, indent=2), encoding='utf-8')
    print('Snapshot written to', OUT)

if __name__ == '__main__':
    snapshot()
