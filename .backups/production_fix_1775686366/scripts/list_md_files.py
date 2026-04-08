# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:05Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""List all markdown files under the repository root (excludes common vendor dirs).

Usage:
  python3 scripts/list_md_files.py [--json out.json]
"""
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE = {'.git','node_modules','venv','.venv','.qmoi_validation'}

def should_exclude(path: Path):
    for p in path.parts:
        if p in EXCLUDE:
            return True
    return False

def find_md():
    files = []
    for p in ROOT.rglob('*.md'):
        if should_exclude(p):
            continue
        files.append(str(p.relative_to(ROOT)).replace('\\','/'))
    return sorted(files)

def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', help='Write json to path')
    args = ap.parse_args()
    md = find_md()
    if args.json:
        with open(args.json,'w',encoding='utf-8') as fh:
            json.dump(md, fh, indent=2)
        print(f'Wrote {args.json} ({len(md)} entries)')
    else:
        for m in md:
            print(m)

if __name__ == '__main__':
    main()
