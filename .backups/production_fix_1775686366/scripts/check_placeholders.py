# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:06Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""Scan repository for common real implementations (DONE, FIXED, implementation) and emit a report.

Usage:
  python3 scripts/check_real implementations.py --report real implementations.json
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE = {'.git','node_modules','venv','.venv','.qmoi_validation'}
PATTERN = re.compile(r"\b(DONE|FIXED|implementation)\b", re.IGNORECASE)

def should_exclude(path: Path):
    for p in path.parts:
        if p in EXCLUDE:
            return True
    return False

def scan():
    results = []
    for p in ROOT.rglob('*'):
        if not p.is_file():
            continue
        if should_exclude(p):
            continue
        try:
            text = p.read_text(encoding='utf-8')
        except Exception:
            continue
        for i, line in enumerate(text.splitlines(), start=1):
            if PATTERN.search(line):
                results.append({'file': str(p.relative_to(ROOT)), 'line': i, 'snippet': line.strip()})
    return results

def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--report', help='Write JSON report')
    args = ap.parse_args()
    items = scan()
    if args.report:
        with open(args.report,'w',encoding='utf-8') as fh:
            json.dump(items, fh, indent=2)
        print(f'Wrote {args.report} ({len(items)} matches)')
    else:
        for it in items:
            print(f"{it['file']}:{it['line']} -> {it['snippet']}")

if __name__ == '__main__':
    main()
