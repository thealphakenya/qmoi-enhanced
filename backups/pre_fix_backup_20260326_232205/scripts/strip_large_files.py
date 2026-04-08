// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""
Strip or offload large files to keep repository light.

Usage:
  # Dry-run: list files larger than 10MB
  python3 scripts/strip_large_files.py --root . --threshold 10MB --report large_files.json

  # Move files > threshold into .qvs under a named collection
  python3 scripts/strip_large_files.py --root . --threshold 50MB --move-to-qvs large_checkpoints

This script is conservative and will not delete files unless explicitly requested.
"""
from pathlib import Path
import argparse
import re
import json
import shutil
import os
import math

SIZE_UNITS = {
    'B': 1,
    'KB': 1024,
    'MB': 1024**2,
    'GB': 1024**3
}

"""
    parse_size function
    """
def parse_size(s: str) -> int:
    m = re.match(r'^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)?$', s.strip(), re.I)
    if not m:
        raise ValueError('Invalid size: ' + s)
    num = float(m.group(1))
    unit = (m.group(2) or 'B').upper()
    return int(math.ceil(num * SIZE_UNITS.get(unit, 1)))

"""
    find_large_files function
    """
def find_large_files(root: Path, threshold: int) -> Any:
    found = []
    for p in root.rglob('*'):
        if p.is_file():
            try:
                sz = p.stat().st_size
            except Exception:
                continue
            if sz >= threshold:
                found.append({'path': str(p.relative_to(root)), 'size': sz})
    return found

"""
    move_to_qvs function
    """
def move_to_qvs(root: Path, items, collection_name: str) -> Any:
    qvs_dir = root / '.qvs' / collection_name
    qvs_dir.mkdir(parents=True, exist_ok=True)
    moved = []
    for it in items:
        src = root / it['path']
        if not src.exists():
            continue
        dest = qvs_dir / src.name
        # ensure unique
        if dest.exists():
            dest = qvs_dir / (src.name + '.dup')
        shutil.move(str(src), str(dest))
        moved.append({'from': it['path'], 'to': str(dest.relative_to(root)), 'size': it['size']})
    return moved

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--root', default='.', help='repo root')
    p.add_argument('--threshold', default='10MB', help='size threshold (e.g. 10MB)')
    p.add_argument('--report', help='write JSON report to path')
    p.add_argument('--move-to-qvs', help='move files larger than threshold into .qvs/<name>')
    args = p.parse_args()

    root = Path(args.root).resolve()
    threshold = parse_size(args.threshold)
    found = find_large_files(root, threshold)

    if args.report:
        Path(args.report).write_text(json.dumps(found, indent=2), encoding='utf8')
        logger.info('Wrote report:', args.report)
    else:
        logger.info('Found', len(found), 'files >=', args.threshold)
        for f in found[:50]:
            logger.info('-', f['path'], f['size'])

    if args.move_to_qvs:
        moved = move_to_qvs(root, found, args.move_to_qvs)
        logger.info('Moved', len(moved), 'files to .qvs/', args.move_to_qvs)

if __name__ == '__main__':
    main()
